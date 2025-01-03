'use client';
import React, { useState } from 'react';
import styles from './TestInterface.module.css';
import { FaInfoCircle } from 'react-icons/fa';

// Add tooltips content
const tooltips = {
  bert: "BERT Score measures semantic similarity between the model's response and expected output using BERT embeddings (0-100%)",
  bleu: "BLEU Score evaluates the quality of machine-generated text by comparing it to reference text using n-gram precision (0-100%)",
  relevancy: "Relevancy Score indicates how well the response addresses the core elements of the prompt (0-100%)",
  accuracy: "Accuracy Score measures the factual correctness of the response compared to the expected output (0-100%)",
  responseTime: "Response Time shows how long the model took to generate the answer in seconds",
  advanced: "Advanced Score is a composite metric combining multiple evaluation factors (0-100%)"
};

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
    const requestStartTime = Date.now() / 1000; // Convert to seconds to match Python time.time()

    try {
      const response = await fetch('http://localhost:5000/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          expectedOutput: expectedOutput.trim(),
          requestStartTime: requestStartTime
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run test');
      }

      const data = await response.json();
      setResults({
        ...data,
        model_response: data.model_response,
        response_time: data.response_time,
        model_time: data.model_time // Add this if you want to show model processing time separately
      });
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
                <FaInfoCircle className={styles.infoIcon} title={tooltips.bert} />
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
                <FaInfoCircle className={styles.infoIcon} title={tooltips.bleu} />
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
                <FaInfoCircle className={styles.infoIcon} title={tooltips.relevancy} />
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
                <FaInfoCircle className={styles.infoIcon} title={tooltips.accuracy} />
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
                <FaInfoCircle 
                  className={styles.infoIcon} 
                  title={tooltips.responseTime + " (Total time: " + results.response_time + "s, Model processing: " + results.model_time + "s)"} 
                />
              </div>
              <span>{results.response_time}s</span>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricHeader}>
                <h3>Advanced Score</h3>
                <FaInfoCircle className={styles.infoIcon} title={tooltips.advanced} />
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