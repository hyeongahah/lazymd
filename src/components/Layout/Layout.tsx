import React from 'react';
import styles from '@/app/page.module.css';

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.container}>
    <header className={styles.header}>
      <h1>LazyMD</h1>
    </header>
    <main className={styles.main}>{children}</main>
  </div>
);
