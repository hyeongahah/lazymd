import { ReactNode, useRef } from 'react';
import styles from './styles.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Toolbar() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!contentRef.current) return;

    const scrollAmount = 200;
    const currentScroll = contentRef.current.scrollLeft;

    contentRef.current.scrollTo({
      left:
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.scrollButton} ${styles.scrollLeft}`}
        onClick={() => handleScroll('left')}
      >
        <ChevronLeft size={18} />
      </button>
      <div className={styles.toolbarContent} ref={contentRef}>
        {/* 툴바 버튼들 */}
      </div>
      <button
        className={`${styles.scrollButton} ${styles.scrollRight}`}
        onClick={() => handleScroll('right')}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
