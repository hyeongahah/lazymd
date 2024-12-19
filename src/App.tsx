import React from 'react';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}></header>
      <main className={styles.main}>
        <div className={styles.content}></div>
      </main>
    </div>
  );
}
