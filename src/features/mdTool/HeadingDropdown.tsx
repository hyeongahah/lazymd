import { Heading } from 'lucide-react';
import styles from '@/pages/page.module.css';

export function HeadingDropdown() {
  return (
    <div className={styles.headingButton}>
      <Heading size={18} />
      <div className={styles.headingDropdown}>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            className={styles.headingOption}
            onClick={() => handleHeadingClick(level)}
            title={`Heading ${level}`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
