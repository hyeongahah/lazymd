import React, { useRef, useEffect, useState } from 'react';
import { useMarkdown } from '@/hooks/useMarkdown';
import useScrollSync from '@/hooks/useScrollSync';
import styles from './styles.module.css';
import statsStyles from './statsBox.module.css';
import { parseMarkdown } from '@/utils/parseUtils';
import {
  getCharacterCount,
  getWordCount,
  getReadingTime,
} from '@/utils/textCount';

export function MarkdownPreview() {
  const { markdownText } = useMarkdown();
  const previewRef = useRef<HTMLDivElement>(null);
  const syncScroll = useScrollSync(previewRef);
  const [parsedHtml, setParsedHtml] = useState('');

  useEffect(() => {
    const parseContent = async () => {
      const html = await parseMarkdown(markdownText);
      setParsedHtml(html);
    };
    parseContent();
  }, [markdownText]);

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
        <div className={`${statsStyles.statsBox} ${statsStyles.box1}`}>
          Chars
        </div>
        <div className={`${statsStyles.statsBox} ${statsStyles.box2}`}>
          {getCharacterCount(markdownText)}
        </div>
        <div className={`${statsStyles.statsBox} ${statsStyles.box3}`}>
          Words
        </div>
        <div className={`${statsStyles.statsBox} ${statsStyles.box4}`}>
          {getWordCount(markdownText)}
        </div>
        <div className={`${statsStyles.statsBox} ${statsStyles.box5}`}>
          Read Time
        </div>
        <div className={`${statsStyles.statsBox} ${statsStyles.box6}`}>
          {getReadingTime(markdownText)}
        </div>
      </div>
      <div
        ref={previewRef}
        className={styles.preview}
        onScroll={syncScroll}
        dangerouslySetInnerHTML={{
          __html: parsedHtml,
        }}
      />
    </div>
  );
}
