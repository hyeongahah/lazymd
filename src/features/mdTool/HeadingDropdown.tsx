import { useMarkdown } from '@/hooks/useMarkdown';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import styles from '@/pages/page.module.css';

export function HeadingDropdown() {
  const { text, setText } = useMarkdown();

  const handleHeading = (level: number) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const prefix = '#'.repeat(level) + ' ';

    const newText =
      text.substring(0, start) +
      `${prefix}${selectedText}` +
      text.substring(end);

    setText(newText);
  };

  return (
    <div className={styles.headingButtonWrapper}>
      <ToolbarButton onClick={() => {}} title='제목'>
        <span className={styles.headingIcon}>H</span>
      </ToolbarButton>
      <div className={styles.headingDropdown}>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            className={styles.headingOption}
            onClick={() => handleHeading(level)}
          >
            H{level}
          </button>
        ))}
      </div>
    </div>
  );
}
