import { useEffect, useRef, useState } from 'react';
import { SyntaxItem } from '@/types/syntax';
import { getAutocompleteSuggestions } from '@/utils/searchUtils';
import styles from './styles.module.css';
import { SearchModal } from '../SearchModal';

interface SearchAutocompleteProps {
  onSearch: (item: SyntaxItem) => void;
}

export function SearchAutocomplete({ onSearch }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SyntaxItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedItem, setSelectedItem] = useState<SyntaxItem | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (query.trim()) {
      const results = getAutocompleteSuggestions(query);
      console.log('Suggestions updated:', results);
      setSuggestions(results);

      if (results.length === 0) {
        setError('검색 결과가 없습니다.');
      } else {
        setError('');
      }
    } else {
      setSuggestions([]);
      setError('');
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (suggestions.length > 0) {
          const selectedItem =
            suggestions[selectedIndex === -1 ? 0 : selectedIndex];
          setQuery(selectedItem.nameEn);
          setSuggestions([]);
        }
        break;
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
        if (query.trim()) {
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSearch(suggestions[selectedIndex]);
          } else if (suggestions.length > 0) {
            handleSearch(suggestions[0]);
          }
          setSuggestions([]);
          setQuery('');
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = (item: SyntaxItem) => {
    console.log('Searching for:', item);
    setSelectedItem(item);
    onSearch(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleApplyModal = () => {
    onSearch(selectedItem!);
    setSelectedItem(null);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchWrapper}>
          <input
            ref={inputRef}
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Search syntax...'
            className={styles.input}
          />
          <button
            className={styles.searchButton}
            onClick={() => {
              if (query.trim() && suggestions.length > 0) {
                handleSearch(suggestions[0]);
                setSuggestions([]);
                setQuery('');
              }
            }}
          >
            Search
          </button>
        </div>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((item, index) => (
                <li
                  key={item.id}
                  className={`${styles.suggestion} ${
                    index === selectedIndex ? styles.selected : ''
                  }`}
                  onClick={() => {
                    handleSearch(item);
                    setSuggestions([]);
                    setQuery('');
                  }}
                >
                  <span className={styles.nameEn}>{item.nameEn}</span>
                  <span className={styles.nameKo}>{item.nameKo}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
      {selectedItem && (
        <SearchModal
          item={selectedItem}
          onClose={handleCloseModal}
          onApply={handleApplyModal}
        />
      )}
    </>
  );
}
