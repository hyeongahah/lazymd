import React from 'react';
import styles from '@/pages/page.module.css';

export function Logo() {
  return (
    <div className={styles.headerLogo}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>L</span>
        <span className={styles.logoText}>azy</span>
      </div>
    </div>
  );
}
