'use client';
import TestInterface from '../components/TestInterface';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>GenAI Testing Framework</h1>
        <p>Test and evaluate your language model responses with detailed analytics</p>
      </header>
      <main>
        <TestInterface />
      </main>
    </div>
  );
}
