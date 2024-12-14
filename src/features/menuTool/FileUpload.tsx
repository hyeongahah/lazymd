import { useMarkdown } from '@/hooks/useMarkdown';
import styles from '@/pages/page.module.css';

export function FileUpload() {
  const { setText } = useMarkdown();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setText(text);
  };

  return (
    <label className={styles.menuButton}>
      <span>📤</span> Import File
      <input
        type='file'
        accept='.md,.markdown,text/markdown'
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
    </label>
  );
}
