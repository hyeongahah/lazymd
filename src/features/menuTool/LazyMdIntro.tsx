import { useMarkdown } from '@/hooks/useMarkdown';
import styles from '@/pages/page.module.css';

export function LazyMdIntro() {
  const { setText } = useMarkdown();

  const handleClick = () => {
    setText(`# Welcome to LazyMD

LazyMD is a markdown editor.

## Main Features
- Real-time markdown preview
- File save and load
- Various markdown formatting options

### How to Use
1. Write markdown in the left panel
2. Check the result in real-time on the right panel
3. Your content is automatically saved`);
  };

  return (
    <button className={styles.menuButton} onClick={handleClick}>
      <span>📖</span> About LazyMD
    </button>
  );
}
