import React from 'react';
import { useMarkdown } from '@/hooks/useMarkdown';
import styles from '@/pages/page.module.css';

export function FileUpload() {
  const { setMarkdownText } = useMarkdown();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setMarkdownText(text);
      e.target.value = ''; // 같은 파일을 다시 선택할 수 있도록 초기화
    } catch (error) {
      console.error('파일을 읽는 중 오류가 발생했습니다:', error);
      alert('파일을 읽는 중 오류가 발생했습니다.');
    }
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
