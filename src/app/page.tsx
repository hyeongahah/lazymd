'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>LazyMD</h1>
      </header>
      <main className={styles.main}>
        {/* 왼쪽 토글 메뉴 */}
        <div
          className={`${styles.leftMenu} ${!isMenuOpen ? styles.closed : ''}`}
        >
          <button
            className={styles.toggleButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '◀' : '▶'}
          </button>
          <div className={styles.menuContent}>
            <button>저장</button>
            <button>불러오기</button>
            <button>테마 변경</button>
            <button>LazyMD 소개</button>
          </div>
        </div>

        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            placeholder='마크다운을 입력하세요...'
          />
        </div>
        <div className={styles.previewContainer}>
          <div className={styles.preview}>프리뷰 영역</div>
        </div>
      </main>
    </div>
  );
}
