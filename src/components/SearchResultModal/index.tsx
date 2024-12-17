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
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const syntax = searchResult.syntax.trim();
    let insertText = '';
    let newCursorPos = cursorPos;

    // 실제 문법만 추출 (예시 텍스트 제외)
    const extractSyntax = (syntax: string) => {
      // '#' 또는 '-' 또는 '>' 로 시작하는 경우
      if (
        syntax.startsWith('#') ||
        syntax.startsWith('-') ||
        syntax.startsWith('>')
      ) {
        return syntax.split(' ')[0]; // 첫 번째 공백 이전까지만 추출
      }
      // **텍스트**, ==텍스트== 형태인 경우
      if (
        syntax.includes('**') ||
        syntax.includes('__') ||
        syntax.includes('~~') ||
        syntax.includes('==')
      ) {
        const match = syntax.match(/(\*\*|__|~~|==)/);
        return match ? match[1] : syntax;
      }
      return syntax;
    };

    const actualSyntax = extractSyntax(syntax);

    // 문법 타입에 따른 처리
    if (
      actualSyntax.startsWith('#') ||
      actualSyntax.startsWith('-') ||
      actualSyntax.startsWith('>')
    ) {
      // 단일 문자 문법 (예: #, -, >)
      insertText = `${actualSyntax} `;
      newCursorPos = cursorPos + insertText.length;
    } else if (
      actualSyntax.includes('**') ||
      actualSyntax.includes('__') ||
      actualSyntax.includes('~~') ||
      actualSyntax.includes('==')
    ) {
      // 감싸는 문법 (예: **, __, ~~, ==)
      const wrapper = actualSyntax;
      insertText = wrapper + wrapper;
      newCursorPos = cursorPos + wrapper.length;
    } else {
      // 기본: 문법 그대로 삽입
      insertText = actualSyntax;
      newCursorPos = cursorPos + actualSyntax.length;
    }

    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);

    setMarkdownText(textBefore + insertText + textAfter);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);

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
