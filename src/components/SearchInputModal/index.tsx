import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { searchSyntax } from '@/utils/searchUtils';
import { useSearchStore } from '@/store/searchStore';
import styles from './styles.module.css';

export function SearchInputModal() {
  const { closeSearchModal, setSearchResult } = useSearchStore();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      const results = searchSyntax(query);
      console.log('Search results:', results);

      if (results.length > 0) {
        setSearchResult(results[0]);
        closeSearchModal();
      } else {
        console.log('No results found');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Modal onClose={closeSearchModal}>
      <div className={styles.searchSection}>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Search syntax...'
          className={styles.searchInput}
          autoFocus
        />
      </div>
      <div className={styles.buttonSection}>
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
        <button className={styles.closeButton} onClick={closeSearchModal}>
          Close
        </button>
      </div>
    </Modal>
  );
}
