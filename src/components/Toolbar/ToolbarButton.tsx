import { ReactNode, useRef } from 'react';
import styles from '@/pages/page.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ToolbarButtonProps {
  onClick: () => void;
  children: ReactNode;
  title?: string;
}

export function ToolbarButton({
  onClick,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <button className={styles.toolbarButton} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

export function Toolbar() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!contentRef.current) return;

    const scrollAmount = 200; // 스크롤할 픽셀 양
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
        {/* 1번부터 20번까지의 버튼 */}
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className={styles.toolbarItem}>
            <button className={styles.toolbarButton}>{i + 1}</button>
          </div>
        ))}
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
