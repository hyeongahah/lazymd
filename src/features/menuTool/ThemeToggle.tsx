import { useTheme } from '@/hooks/useTheme';
import styles from '@/pages/page.module.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.menuButton} onClick={toggleTheme}>
      <span>{theme === 'light' ? '🌙' : '☀️'}</span> Toggle Theme
    </button>
  );
}
