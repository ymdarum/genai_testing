from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import pymysql
import time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import re
import nltk
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
from bert_score import score
import torch
from sentence_transformers import SentenceTransformer, util
import warnings

# Download required NLTK data
nltk.download('punkt')

pymysql.install_as_MySQLdb()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:admin@localhost/genai_tests'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Initialize the model globally
model = SentenceTransformer('all-MiniLM-L6-v2')

warnings.filterwarnings("ignore", message="Some weights of RobertaModel were not initialized")

class TestResult(db.Model):
    __tablename__ = 'test_results'
    
    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.Text, nullable=False)
    expected_output = db.Column(db.Text, nullable=False)
    model_response = db.Column(db.Text, nullable=False)
    relevancy_score = db.Column(db.Float, nullable=False)
    accuracy_score = db.Column(db.Float, nullable=False)
    bleu_score = db.Column(db.Float, nullable=False)
    bert_score = db.Column(db.Float, nullable=False)
    response_time = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    advance_score = db.Column(db.Float, nullable=False)

def simple_tokenize(text):
    """Simple tokenization function"""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    return [token for token in text.split() if token.strip()]

def calculate_relevancy(expected, actual):
    """Calculate relevancy score using TF-IDF and cosine similarity"""
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([expected, actual])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(similarity * 100)
    except:
        return 0.0

def calculate_accuracy(expected, actual):
    """Calculate accuracy score using multiple metrics"""
    expected = expected.lower()
    actual = actual.lower()
    
    max_len = max(len(expected), len(actual))
    if max_len == 0:
        return 0.0
    
    def levenshtein(s1, s2):
        if len(s1) < len(s2):
            return levenshtein(s2, s1)
        if len(s2) == 0:
            return len(s1)
        
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        return previous_row[-1]
    
    edit_distance = levenshtein(expected, actual)
    edit_sim = (1 - edit_distance / max_len) * 100
    
    expected_words = set(simple_tokenize(expected))
    actual_words = set(simple_tokenize(actual))
    overlap = len(expected_words.intersection(actual_words))
    total = len(expected_words.union(actual_words))
    word_sim = (overlap / total) * 100 if total > 0 else 0
    
    final_score = (edit_sim * 0.4 + word_sim * 0.6)
    return float(final_score)

def calculate_bleu_score(expected, actual):
    """
       The BLEU (Bilingual Evaluation Understudy) score is a metric used to assess the quality of machine-generated translations 
       by comparing them to one or more human reference translations. It evaluates how closely the machine's output matches 
       human translations, focusing on the overlap of n-grams—sequences of 'n' consecutive words—between the candidate 
       and reference texts. A higher BLEU score indicates a closer match to human translations, suggesting better translation quality.
       Below will c alculate BLEU score with smoothing    
    """
    try:
        reference_tokens = expected.lower().split()
        candidate_tokens = actual.lower().split()
        
        # Use smoothing function to handle edge cases
        smoothie = SmoothingFunction().method3
        
        # Calculate BLEU score with smoothing
        bleu = sentence_bleu(
            [reference_tokens],
            candidate_tokens,
            smoothing_function=smoothie
        )
        
        # Convert to percentage
        return float(bleu * 100)
    except Exception as e:
        print(f"Error calculating BLEU score: {str(e)}")
        return 0.0

def calculate_bert_score(expected, actual):
    """Calculate BERT score between expected and actual outputs"""
    try:
        # Ensure inputs are in list format
        refs = [expected]
        hyps = [actual]
        
        # Calculate BERT score (P, R, F1) with specific model to avoid warnings
        P, R, F1 = score(
            hyps, 
            refs, 
            lang="en", 
            verbose=False,
            model_type="microsoft/deberta-xlarge-mnli",  # Use DeBERTa instead of RoBERTa
            num_layers=None,  # Use all layers
            batch_size=1
        )
        
        # Convert to percentage and use F1 as the main score
        bert_score = float(F1.mean().item() * 100)
        return round(bert_score, 2)
    except Exception as e:
        print(f"Error calculating BERT score: {str(e)}")
        return 0.0

def calculate_advance_score(expected, actual):
    """Calculate semantic similarity using sentence transformers"""
    try:
        # Encode sentences to get embeddings
        actual_embedding = model.encode(actual, convert_to_tensor=True)
        expected_embedding = model.encode(expected, convert_to_tensor=True)
        
        # Calculate cosine similarity
        similarity_score = util.pytorch_cos_sim(actual_embedding, expected_embedding).item()
        
        # Convert to percentage
        return float(similarity_score * 100)
    except Exception as e:
        print(f"Error calculating advance score: {str(e)}")
        return 0.0

def get_llama_response(prompt):
    """Get response from Ollama Llama3.2"""
    url = "http://localhost:11434/api/generate"
    
    start_time = time.time()
    try:
        response = requests.post(url, json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False
        })
        response_time = time.time() - start_time
        
        if response.status_code == 200:
            return response.json()["response"], response_time
        else:
            return "Error getting response from model", response_time
    except Exception as e:
        return f"Error: {str(e)}", time.time() - start_time

@app.route('/api/test', methods=['POST'])
def run_test():
    try:
        data = request.json
        prompt = data['prompt']
        expected_output = data['expectedOutput']
        request_start_time = data.get('requestStartTime', time.time())  # Get start time from frontend
        
        # Get model response
        model_response, model_time = get_llama_response(prompt)
        
        # Calculate all metrics
        relevancy_score = calculate_relevancy(expected_output, model_response)
        accuracy_score = calculate_accuracy(expected_output, model_response)
        bleu_score = calculate_bleu_score(expected_output, model_response)
        bert_score = calculate_bert_score(expected_output, model_response)
        advance_score = calculate_advance_score(expected_output, model_response)
        
        # Calculate total response time from request start to completion
        total_response_time = time.time() - float(request_start_time)
        
        metrics = {
            'relevancy_score': round(relevancy_score, 2),
            'accuracy_score': round(accuracy_score, 2),
            'bleu_score': round(bleu_score, 2),
            'bert_score': round(bert_score, 2),
            'response_time': round(total_response_time, 2),  # Total time including network latency
            'model_time': round(model_time, 2),  # Just the model processing time
            'model_response': model_response,
            'advance_score': round(advance_score, 2),
        }
        
        # Save to database
        test_result = TestResult(
            prompt=prompt,
            expected_output=expected_output,
            model_response=model_response,
            relevancy_score=metrics['relevancy_score'],
            accuracy_score=metrics['accuracy_score'],
            bleu_score=metrics['bleu_score'],
            bert_score=metrics['bert_score'],
            response_time=metrics['response_time'],
            advance_score=metrics['advance_score']
        )
        db.session.add(test_result)
        db.session.commit()
        
        return jsonify(metrics)
    except Exception as e:
        print(f"Error in run_test: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/save', methods=['POST'])
def save_results():
    try:
        data = request.json
        prompt = data['prompt']
        expected_output = data['expectedOutput']
        model_response = data['modelResponse']
        relevancy_score = data['relevancyScore']
        accuracy_score = data['accuracyScore']
        bleu_score = data['bleuScore']
        bert_score = data['bertScore']
        response_time = data['responseTime']
        
        # Save to database
        test_result = TestResult(
            prompt=prompt,
            expected_output=expected_output,
            model_response=model_response,
            relevancy_score=relevancy_score,
            accuracy_score=accuracy_score,
            bleu_score=bleu_score,
            bert_score=bert_score,
            response_time=response_time
        )
        db.session.add(test_result)
        db.session.commit()
        
        return jsonify({'message': 'Results saved successfully!'}), 201
    except Exception as e:
        print(f"Error in save_results: {str(e)}")
        return jsonify({'error': str(e)}), 500

def init_db():
    """Initialize database and check schema"""
    with app.app_context():
        try:
            # Create tables if they don't exist (won't affect existing tables)
            db.create_all()
            print("Checked existing tables.")
            
            # Check if bert_score column exists
            inspector = db.inspect(db.engine)
            columns = inspector.get_columns('test_results')
            column_names = [col['name'] for col in columns]
            
            # if 'bert_score' not in column_names:
            #     print("Adding bert_score column...")
            #     try:
            #         # Use text() to create a proper SQL expression
            #         sql = db.text('ALTER TABLE test_results ADD COLUMN bert_score FLOAT NOT NULL DEFAULT 0.0')
            #         db.session.execute(sql)
            #         db.session.commit()
            #         print("bert_score column added successfully!")
            #     except Exception as e:
            #         print(f"Error adding bert_score column: {str(e)}")
            #         db.session.rollback()
            # else:
            #     print("bert_score column already exists.")
            
            # Check if advance_score column exists
            # if 'advance_score' not in column_names:
            #     print("Adding advance_score column...")
            #     try:
            #         sql = db.text('ALTER TABLE test_results ADD COLUMN advance_score FLOAT NOT NULL DEFAULT 0.0')
            #         db.session.execute(sql)
            #         db.session.commit()
            #         print("advance_score column added successfully!")
            #     except Exception as e:
            #         print(f"Error adding advance_score column: {str(e)}")
            #         db.session.rollback()
            # else:
            #     print("advance_score column already exists.")
            
        except Exception as e:
            print(f"Error during database initialization: {str(e)}")
            raise e

# Update the main execution block
if __name__ == '__main__':
    try:
        # Initialize the database (only adds new column if needed)
        init_db()
        
        # Start the Flask application
        app.run(debug=True)
    except Exception as e:
        print(f"Failed to initialize application: {str(e)}")
