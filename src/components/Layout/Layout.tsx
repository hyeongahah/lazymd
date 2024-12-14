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
        <div className={styles.headerLeft}>
          <button
            className={styles.toggleButton}
            onClick={toggle}
            title={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            <span className={styles.toggleIcon}>{isOpen ? '◀' : '▶'}</span>
          </button>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.logo}>LazyMD</div>
        </div>
      </header>
      {children}
    </div>
  );
}
