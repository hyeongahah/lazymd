import { ReactNode } from 'react';
import styles from '@/pages/page.module.css';
import { useMenuStore } from '@/store/menuStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, toggle } = useMenuStore();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerMenuToggle}>
          <button
            className={styles.toggleButton}
            onClick={toggle}
            title={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            <span className={styles.toggleIcon}>{isOpen ? '◀' : '▶'}</span>
          </button>
        </div>
        <div className={styles.headerLogo}>
          <div className={styles.logo}>LazyMD</div>
        </div>
        <div className={styles.headerSyntaxSearch}>
          <button
            className={styles.toggleButton}
            onClick={() => {
              /* 문법 검색 토글 기능 추가 예정 */
            }}
            title='Syntax Search'
          >
            <span className={styles.toggleIcon}>🔍</span>
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
