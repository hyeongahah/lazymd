'use client';

import { useRef } from 'react';
import styles from '../app/page.module.css';

export default function Toolbar() {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (contentRef.current) {
      contentRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (contentRef.current) {
      contentRef.current.scrollLeft += 200;
    }
  };

  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.toolbarScrollButton} ${styles.toolbarScrollLeft}`}
        onClick={scrollLeft}
      >
        ≪
      </button>

      <div className={styles.toolbarContent} ref={contentRef}>
        {/* 아이콘 버튼들이 여기에 추가될 예정 */}
      </div>

      <button
        className={`${styles.toolbarScrollButton} ${styles.toolbarScrollRight}`}
        onClick={scrollRight}
      >
        ≫
      </button>
    </div>
  );
}
