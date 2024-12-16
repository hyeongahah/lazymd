import { useEffect, useState } from 'react';
import { SyntaxItem } from '@/types/syntax';
import { useMarkdown } from '@/hooks/useMarkdown';
import styles from './styles.module.css';

interface SearchModalProps {
  item: SyntaxItem;
  onClose: () => void;
  onApply: () => void;
}

export function SearchModal({ item, onClose, onApply }: SearchModalProps) {
  const { setMarkdownText } = useMarkdown();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      // 검색 로직 구현
      console.log('Searching:', query);
    }
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleApply = () => {
    setMarkdownText((prev) => prev + '\n' + item.example + '\n');
    onApply();
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.searchSection}>
            <input
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search syntax...'
              className={styles.searchInput}
            />
          </div>
          <div className={styles.buttonSection}>
            <button className={styles.searchButton} onClick={handleSearch}>
              Search
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
