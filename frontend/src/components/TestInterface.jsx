'use client';
import { useState } from 'react';
import styles from './TestInterface.module.css';

export default function TestInterface() {
  const [prompt, setPrompt] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runTest = async () => {
    if (!prompt || !expectedOutput) {
      setError('Please fill in both prompt and expected output');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          expectedOutput: expectedOutput.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run test');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setPrompt('');
    setExpectedOutput('');
    setResults(null);
    setError(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return styles.excellent;
    if (score >= 60) return styles.good;
    if (score >= 40) return styles.fair;
    return styles.poor;
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label>Prompt:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            disabled={loading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Expected Output:</label>
          <textarea
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
            placeholder="Enter expected output..."
            disabled={loading}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttonGroup}>
          <button 
            className={styles.runButton} 
            onClick={runTest}
            disabled={loading}
          >
            {loading ? 'Running Test...' : 'Run Test'}
          </button>
          <button 
            className={styles.clearButton} 
            onClick={clearForm}
            disabled={loading}
          >
            Clear Form
          </button>
        </div>
      </div>

      {results && (
        <div className={styles.resultsSection}>
          <h2>Test Results</h2>
          
          <div className={styles.modelResponse}>
            <h3>Model Response:</h3>
            <p>{results.model_response}</p>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <h3>BERT Score</h3>
                <div className={styles.infoIcon} title="BERT Score uses contextual embeddings to measure semantic similarity between the expected and actual outputs. Higher scores indicate better semantic matching.">
                  ℹ️
                </div>
              </div>
              <div className={styles.scoreContainer}>
                <span className={getScoreColor(results.bert_score)}>
                  {results.bert_score}%
                </span>
              </div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <h3>BLEU Score</h3>
                <div className={styles.infoIcon} title="BLEU Score measures the quality of machine-translated text by comparing it to reference translations. Higher scores indicate better quality.">
                  ℹ️
                </div>
              </div>
              <div className={styles.scoreContainer}>
                <span className={getScoreColor(results.bleu_score)}>
                  {results.bleu_score}%
                </span>
              </div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <h3>Relevancy Score</h3>
                <div className={styles.infoIcon} title="Relevancy Score indicates how well the response addresses the given prompt. Higher scores mean more relevant responses.">
                  ℹ
                </div>
              </div>
              <div className={styles.scoreContainer}>
                <span className={getScoreColor(results.relevancy_score)}>
                  {results.relevancy_score}%
                </span>
              </div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <h3>Accuracy Score</h3>
                <div className={styles.infoIcon} title="Accuracy Score compares how closely the model's response matches the expected output. Higher scores indicate better accuracy.">
                  ℹ️
                </div>
              </div>
              <div className={styles.scoreContainer}>
                <span className={getScoreColor(results.accuracy_score)}>
                  {results.accuracy_score}%
                </span>
              </div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <h3>Response Time</h3>
                <div className={styles.infoIcon} title="Time taken by the model to generate the response, measured in seconds.">
                  ℹ️
                </div>
              </div>
              <span>{results.response_time}s</span>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <h3>Advanced Score</h3>
                <div className={styles.infoIcon} title="Advanced semantic similarity score using sentence transformers. Measures deep contextual understanding between expected and actual outputs.">
                  ℹ️
                </div>
              </div>
              <div className={styles.scoreContainer}>
                <span className={getScoreColor(results.advance_score)}>
                  {results.advance_score}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 