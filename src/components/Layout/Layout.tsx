import { ReactNode, useEffect, useState } from 'react';
import styles from '@/pages/page.module.css';
import { useMenuStore } from '@/store/menuStore';
import { useSearchStore } from '@/store/searchStore';
import { SearchInputModal } from '@/components/SearchInputModal';
import { SearchResultModal } from '@/components/SearchResultModal';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, toggle } = useMenuStore();
  const { isSearchModalOpen, searchResult, openSearchModal } = useSearchStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault(); // 브라우저 기본 F1 동작 방지
        openSearchModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearchModal]);

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
            onClick={openSearchModal}
            title='Search Syntax (F1)'
          >
            <span className={styles.toggleIcon}>🔍</span>
          </button>
        </div>
      </header>
      {children}
      {isSearchModalOpen && <SearchInputModal />}
      {searchResult && <SearchResultModal />}
    </div>
  );
}
