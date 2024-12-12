import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '@/utils/storageUtils';
import { createMarkdownIt } from '@/utils/markdownUtils';

export const useMarkdown = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const md = createMarkdownIt();

  // 마크다운 렌더링
  useEffect(() => {
    setHtmlContent(md.render(markdownText));
  }, [markdownText, md]);

  // 히스토리 관리
  useEffect(() => {
    if (markdownText !== history[historyIndex]) {
      setHistory([...history.slice(0, historyIndex + 1), markdownText]);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [markdownText]);

  return {
    markdownText,
    setMarkdownText,
    htmlContent,
    history,
    historyIndex,
    setHistoryIndex,
  };
};
