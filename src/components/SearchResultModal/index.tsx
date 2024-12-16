import { Modal } from '@/components/common/Modal';
import { SyntaxItem } from '@/types/syntax';
import styles from './styles.module.css';
import { useSearchStore } from '@/store/searchStore';
import { useMarkdown } from '@/hooks/useMarkdown';

export function SearchResultModal() {
  const { searchResult, setSearchResult } = useSearchStore();
  const { setMarkdownText } = useMarkdown();

  if (!searchResult) return null;

  const handleApply = () => {
    setMarkdownText((prev) => prev + '\n' + searchResult.example + '\n');
    setSearchResult(null);
  };

  return (
    <Modal onClose={() => setSearchResult(null)}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {searchResult.nameEn}
          <span className={styles.koreanName}>{searchResult.nameKo}</span>
        </h2>
        <span className={styles.category}>{searchResult.category}</span>
      </div>

      <div className={styles.section}>
        <h3>설명</h3>
        <p>{searchResult.description}</p>
      </div>

      <div className={styles.section}>
        <h3>사용 방법</h3>
        <pre className={styles.syntax}>{searchResult.syntax}</pre>
      </div>

      <div className={styles.section}>
        <h3>예시</h3>
        <div className={styles.example}>
          <div className={styles.sourceCode}>
            <h4>마크다운</h4>
            <pre>{searchResult.example}</pre>
          </div>
          <div className={styles.preview}>
            <h4>결과</h4>
            <div
              dangerouslySetInnerHTML={{ __html: searchResult.result || '' }}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.applyButton} onClick={handleApply}>
          Apply
        </button>
        <button
          className={styles.closeButton}
          onClick={() => setSearchResult(null)}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
