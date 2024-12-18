import { ReactNode, useEffect, useState } from 'react';
import styles from '@/pages/page.module.css';
import { useSearchStore } from '@/store/searchStore';
import { SearchInputModal } from '@/components/SearchInputModal';
import { SearchResultModal } from '@/components/SearchResultModal';
import { Header } from '@/components/Header';

interface LayoutProps {
  children: ReactNode;
  onExpandToggle: () => void;
  isExpanded: boolean;
}

export function Layout({ children, onExpandToggle, isExpanded }: LayoutProps) {
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
        e.preventDefault();
        openSearchModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearchModal]);

  return (
    <div className={styles.container}>
      <Header isExpanded={isExpanded} onExpandToggle={onExpandToggle} />
      <main className={styles.main}>
        <div
          className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}
        >
          {children}
        </div>
      </main>
      {isSearchModalOpen && <SearchInputModal />}
      {searchResult && <SearchResultModal />}
    </div>
  );
}
