import React, { useRef, useEffect } from 'react';
import { useMarkdown } from '@/hooks/useMarkdown';
import useScrollSync from '@/hooks/useScrollSync';
import styles from './styles.module.css';
import { parseMarkdown } from '@/utils/parseUtils';

export function MarkdownPreview() {
  const { markdownText } = useMarkdown();
  const previewRef = useRef<HTMLDivElement>(null);
  const syncScroll = useScrollSync(previewRef);

  // 텍스트가 변경될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    const previewElement = previewRef.current;
    if (previewElement) {
      previewElement.scrollTop = previewElement.scrollHeight;
    }
  }, [markdownText]);

  return (
    <div className={styles.container}>
      <div className={styles.notice}>
        공지사항 : 수학 기호 입력 기능 추가 예정
      </div>
      <div
        ref={previewRef}
        className={styles.preview}
        onScroll={syncScroll}
        dangerouslySetInnerHTML={{
          __html: parseMarkdown(markdownText),
        }}
      />
    </div>
  );
}
