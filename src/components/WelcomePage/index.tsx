import React from 'react';
import styles from './styles.module.css';

interface WelcomePageProps {
  onStart: () => void;
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <h1 className={styles.title}>LazyMD</h1>
        <p className={styles.description}>간단하고 우아한 마크다운 에디터</p>
        <button onClick={onStart} className={styles.startButton}>
          시작하기
        </button>
      </div>
    </div>
  );
}
