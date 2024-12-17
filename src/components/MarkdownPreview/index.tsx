import React from 'react';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useEffect, useState } from 'react';
import { useScrollSync } from '@/hooks/useScrollSync';
import styles from './styles.module.css';
import { parseMarkdown } from '@/utils/parseUtils';

export function MarkdownPreview() {
  const { markdownText } = useMarkdown();
  const [html, setHtml] = useState('');
  const previewRef = useScrollSync();

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        const parsedHtml = parseMarkdown(markdownText);
        setHtml(parsedHtml);
      } catch (error) {
        console.error('Markdown rendering error:', error);
        setHtml('<p>Error rendering markdown</p>');
      }
    };
    renderMarkdown();
  }, [markdownText]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewToolbar}>
        <div className={styles.toolbarContent}>{/* 툴바 내용 */}</div>
      </div>
      <div className={styles.previewContent}>
        <div className={styles.previewWrapper}>
          <div
            ref={previewRef}
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
