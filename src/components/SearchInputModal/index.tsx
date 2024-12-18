import { useState, useEffect, useRef } from 'react';
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
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // 자동완성 처리
  useEffect(() => {
    if (query.trim()) {
      const results = getAutocompleteSuggestions(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // 선택된 항목이 변경될 때 스크롤 조정
  useEffect(() => {
    if (
      selectedIndex >= 0 &&
      suggestionsRef.current &&
      suggestions.length > 0
    ) {
      const modalElement = document.querySelector('.styles_modal__mtHmO');
      const suggestionItems = suggestionsRef.current.children;
      const selectedItem = suggestionItems[selectedIndex] as HTMLElement;

      if (!modalElement || !selectedItem) return;

      // 선택된 항목의 위치와 크기 계산
      const selectedRect = selectedItem.getBoundingClientRect();
      const modalRect = modalElement.getBoundingClientRect();

      // 선택된 항목이 모달의 보이는 영역을 벗어났는지 확인
      if (
        selectedRect.bottom > modalRect.bottom ||
        selectedRect.top < modalRect.top
      ) {
        // 스크롤 가능한 전체 높이
        const scrollableHeight =
          modalElement.scrollHeight - modalElement.clientHeight;

        // 선택된 항목의 상대적 위치 계산 (0~1 사이 값)
        const itemPosition = selectedIndex / (suggestions.length - 1);

        // 스크롤 위치 계산 및 적용
        const newScrollTop = scrollableHeight * itemPosition;
        modalElement.scrollTop = newScrollTop;
      }
    }
  }, [selectedIndex, suggestions.length]);

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
      case 'Escape':
        e.preventDefault();
        closeSearchModal();
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
          <ul className={styles.suggestions} ref={suggestionsRef}>
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
