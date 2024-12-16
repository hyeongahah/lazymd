import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { searchSyntax, getAutocompleteSuggestions } from '@/utils/searchUtils';
import { useSearchStore } from '@/store/searchStore';
import { SyntaxItem } from '@/types/syntax';
import styles from './styles.module.css';

export function SearchInputModal() {
  const { closeSearchModal, setSearchResult } = useSearchStore();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SyntaxItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // 자동완성 처리
  useEffect(() => {
    if (query.trim()) {
      const results = getAutocompleteSuggestions(query);
      setSuggestions(results);
      console.log('Autocomplete suggestions:', results);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      const results = searchSyntax(query);
      if (results.length > 0) {
        setSearchResult(results[0]);
        closeSearchModal();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          setSearchResult(suggestions[selectedIndex]);
          closeSearchModal();
        } else {
          handleSearch();
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (suggestions.length > 0) {
          const suggestion =
            suggestions[selectedIndex === -1 ? 0 : selectedIndex];
          setQuery(suggestion.nameEn);
          setSuggestions([]);
        }
        break;
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
        {suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((item, index) => (
              <li
                key={item.id}
                className={`${styles.suggestion} ${
                  index === selectedIndex ? styles.selected : ''
                }`}
                onClick={() => {
                  setSearchResult(item);
                  closeSearchModal();
                }}
              >
                <span className={styles.nameEn}>{item.nameEn}</span>
                <span className={styles.nameKo}>{item.nameKo}</span>
              </li>
            ))}
          </ul>
        )}
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
