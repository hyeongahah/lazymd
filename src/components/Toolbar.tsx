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
        <button className={styles.toolbarButton} title='실행 취소'>
          ↶
        </button>
        <button className={styles.toolbarButton} title='다시 실행'>
          ↷
        </button>
        <button className={styles.toolbarButton} title='서식 제거'>
          Aa
        </button>
        <div className={styles.toolbarDivider} />

        <button className={styles.toolbarButton} title='제목'>
          Hn
        </button>
        <button className={styles.toolbarButton} title='굵게'>
          B
        </button>
        <button className={styles.toolbarButton} title='기울임'>
          I
        </button>
        <button className={styles.toolbarButton} title='취소선'>
          S
        </button>
        <button className={styles.toolbarButton} title='밑줄'>
          U
        </button>
        <button className={styles.toolbarButton} title='형광펜'>
          ✏️
        </button>
        <div className={styles.toolbarDivider} />

        <button className={styles.toolbarButton} title='편집 옵션'>
          ⋮
        </button>
        <button className={styles.toolbarButton} title='링크'>
          🔗
        </button>
        <button className={styles.toolbarButton} title='테이블'>
          ▦
        </button>
        <div className={styles.toolbarDivider} />

        <button className={styles.toolbarButton} title='체크리스트'>
          ☑️
        </button>
        <button className={styles.toolbarButton} title='인용구'>
          ❝
        </button>
        <button className={styles.toolbarButton} title='정렬'>
          ⇲
        </button>
        <div className={styles.toolbarDivider} />

        <button className={styles.toolbarButton} title='서식 옵션'>
          T
        </button>
        <button className={styles.toolbarButton} title='리스트'>
          ≡
        </button>
        <button className={styles.toolbarButton} title='글자색'>
          A
        </button>
        <button className={styles.toolbarButton} title='배경색'>
          ⬚
        </button>
        <div className={styles.toolbarDivider} />

        <button className={styles.toolbarButton} title='전체화면'>
          ⛶
        </button>
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
