'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import { Layout } from '@/components/Layout/Layout';
import { LeftMenu } from '@/features/menuTool/LeftMenu';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { checkFormatAtCursor } from '@/components/Util/textUtils';
import { createMarkdownIt, syncScroll } from '@/utils/markdownUtils';
import { loadFromStorage, saveToStorage } from '@/utils/storageUtils';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [markdownText, setMarkdownText] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const md = createMarkdownIt();
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorFormats, setCursorFormats] = useState({
    isBold: false,
    isItalic: false,
    isStrike: false,
    isUnderline: false,
    isHighlight: false,
  });

  // 초기화 및
  useEffect(() => {
    setMounted(true);
    setIsMenuOpen(true);
    const savedMarkdown = loadFromStorage('markdown_data');
    if (savedMarkdown) setMarkdownText(savedMarkdown);

    const savedTheme = loadFromStorage('theme');
    setIsDarkTheme(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme || 'light');
  }, []);

  // 마크다운 렌더링
  useEffect(() => {
    setHtmlContent(md.render(markdownText));
  }, [markdownText, md]);

  // 자동 저장 기능 수정
  useEffect(() => {
    let saveTimer: NodeJS.Timeout;

    const autoSave = () => {
      if (markdownText) {
        saveToStorage('markdown_data', markdownText);
      }
    };

    // 5초 후에 저장 실행
    saveTimer = setTimeout(autoSave, 5000);

    return () => {
      clearTimeout(saveTimer);
    };
  }, [markdownText]);

  // 히스토리 관리
  useEffect(() => {
    if (markdownText !== history[historyIndex]) {
      setHistory([...history.slice(0, historyIndex + 1), markdownText]);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [markdownText]);

  // 커서 위치의 포맷 상태 확인
  const handleCursorChange = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    setCursorFormats(
      checkFormatAtCursor(markdownText, textarea.selectionStart)
    );
  }, [markdownText]);

  return (
    <Layout>
      <main className={styles.main}>
        <LeftMenu
          mounted={mounted}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          markdownText={markdownText}
          isDarkTheme={isDarkTheme}
          setMarkdownText={setMarkdownText}
          setIsDarkTheme={setIsDarkTheme}
          onLoad={() => {
            const data = loadFromStorage('markdown_data');
            if (data) setMarkdownText(data);
          }}
          onToggleTheme={() => {
            setIsDarkTheme(!isDarkTheme);
            document.documentElement.setAttribute(
              'data-theme',
              !isDarkTheme ? 'dark' : 'light'
            );
          }}
        />
        {/* 에디터 영역 */}
        <div className={styles.editorContainer}>
          {/* 툴바 */}
          <div className={styles.previewToolbar}>
            <button
              className={`${styles.toolbarScrollButton} ${styles.toolbarScrollLeft}`}
              onClick={() => {
                const content = document.querySelector(
                  `.${styles.toolbarContent}`
                );
                if (content) {
                  content.scrollLeft -= 200;
                }
              }}
              style={{ backgroundColor: '#90EE90' }}
            >
              ≪
            </button>

            <div className={styles.toolbarContent}>
              {Array.from({ length: 20 }).map((_, index) => (
                <ToolbarButton
                  key={index}
                  index={index}
                  isCursorBold={cursorFormats.isBold}
                  isCursorItalic={cursorFormats.isItalic}
                  isCursorStrike={cursorFormats.isStrike}
                  isCursorUnderline={cursorFormats.isUnderline}
                  isCursorHighlight={cursorFormats.isHighlight}
                  markdownText={markdownText}
                  setMarkdownText={setMarkdownText}
                  history={history}
                  historyIndex={historyIndex}
                  setHistoryIndex={setHistoryIndex}
                />
              ))}
            </div>

            <button
              className={`${styles.toolbarScrollButton} ${styles.toolbarScrollRight}`}
              onClick={() => {
                const content = document.querySelector(
                  `.${styles.toolbarContent}`
                );
                if (content) {
                  content.scrollLeft += 200;
                }
              }}
              style={{ backgroundColor: '#90EE90' }}
            >
              ≫
            </button>
          </div>
          {/* 에디터 */}
          <textarea
            className={styles.editor}
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
            onSelect={handleCursorChange}
            onScroll={(e) => {
              const preview = document.querySelector(`.${styles.preview}`);
              if (preview) {
                const textarea = e.currentTarget;
                const scrollPercentage =
                  textarea.scrollTop /
                  (textarea.scrollHeight - textarea.clientHeight);
                preview.scrollTop =
                  scrollPercentage *
                  (preview.scrollHeight - preview.clientHeight);
              }
            }}
          />
        </div>
        {/* 프리뷰 */}
        <div className={styles.previewContainer}>
          <div className={styles.previewToolbar}>
            <div className={styles.previewContent}>마크다운 미리보기</div>
          </div>
          <div
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </main>
    </Layout>
  );
}
