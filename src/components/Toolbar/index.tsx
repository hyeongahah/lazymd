'use client';

import { useRef, useEffect, useState } from 'react';
import styles from '@/app/page.module.css';

export default function Toolbar() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // 20개의 서로 다른 색상 생성
  const colors = [
    '#FFB3BA',
    '#BAFFC9',
    '#BAE1FF',
    '#FFFFBA',
    '#FFB3FF',
    '#B3FFB3',
    '#B3B3FF',
    '#FFD700',
    '#98FB98',
    '#DDA0DD',
    '#F0E68C',
    '#E6E6FA',
    '#FFA07A',
    '#98FF98',
    '#FFDAB9',
    '#D8BFD8',
    '#B0E0E6',
    '#FFB6C1',
    '#87CEEB',
    '#F0FFF0',
  ];

  if (!isMounted) return null;

  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.toolbarScrollButton} ${styles.toolbarScrollLeft}`}
        onClick={scrollLeft}
      >
        ◀
      </button>

      <div className={styles.toolbarContent} ref={contentRef}>
        {colors.map((color, index) => (
          <button
            key={index}
            className={styles.toolbarButton}
            style={{
              backgroundColor: color,
              width: '40px',
              minWidth: '40px',
              height: '30px',
              margin: '0 2px',
              padding: 0,
            }}
          />
        ))}
      </div>

      <button
        className={`${styles.toolbarScrollButton} ${styles.toolbarScrollRight}`}
        onClick={scrollRight}
      >
        ▶
      </button>
    </div>
  );
}
