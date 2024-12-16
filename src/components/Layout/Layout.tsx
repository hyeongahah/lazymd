import { ReactNode, useEffect, useState } from 'react';
import styles from '@/pages/page.module.css';
import { useMenuStore } from '@/store/menuStore';
import { useSearchStore } from '@/store/searchStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, toggle } = useMenuStore();
  const { isSearchOpen, toggleSearch } = useSearchStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            onClick={toggleSearch}
            title='Syntax Search'
          >
            <span className={styles.toggleIcon}>🔍</span>
          </button>
        </div>
      </header>
      {children}
      {isSearchOpen && (
        <>
          <div className={styles.modalOverlay} onClick={toggleSearch} />
          <div className={styles.searchModal}>
            <div className={styles.searchContent}>
              <input
                type='text'
                className={styles.searchInput}
                placeholder='Search syntax...'
                autoFocus
              />
              <button className={styles.closeButton} onClick={toggleSearch}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
