import React, { useCallback, useRef } from 'react';
import styles from '@/app/page.module.css';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  setMarkdownText: (text: string) => void;
}

export const FileUpload = ({ setMarkdownText }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdownText(content);
      };
      reader.readAsText(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [setMarkdownText]
  );

  return (
    <>
      <input
        type='file'
        accept='.md,.markdown,text/markdown'
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button
        className={styles.menuButton}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={18} />
        파일 불러오기
      </button>
    </>
  );
};
