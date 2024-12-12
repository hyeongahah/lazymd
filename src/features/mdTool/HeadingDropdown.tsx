import { useCallback } from 'react';
import styles from '@/app/page.module.css';

interface HeadingDropdownProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export const HeadingDropdown = ({
  markdownText,
  setMarkdownText,
}: HeadingDropdownProps) => {
  const handleHeading = useCallback(
    (level: number) => {
      // 헤딩 적용 로직...
    },
    [markdownText]
  );

  return (
    <div className={styles.headingButtonWrapper}>
      <div className={styles.headingIcon}>H</div>
      <div className={styles.headingDropdown}>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            className={styles.headingOption}
            onClick={(e) => {
              e.stopPropagation();
              handleHeading(level);
            }}
          >
            H{level}
          </button>
        ))}
      </div>
    </div>
  );
};
