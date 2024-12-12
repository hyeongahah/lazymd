'use client';

import styles from './page.module.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Toolbar from '@/components/Toolbar';
import MarkdownIt from 'markdown-it';

const LAZY_MD_INTRO = `마크다운 작성의 새로운 기준!

LazyMD는 복잡한 마크다운 문법을 손쉽게 작성하고, 실시간으로 결과를 확인할 수 있는 직관적인 에디터입니다. 단순한 클릭만으로도 아름다운 문서를 완성할 수 있으며, 강력한 툴바와 미리보기 기능으로 누구나 프로처럼 마크다운을 작성할 수 있습니다. 빠르고, 간편하고, 당신의 생산성을 극대화합니다. 이제 LazyMD로 마크다운 작성의 즐거움을 경험하세요!`;

interface MenuButtonsProps {
  mounted: boolean;
  onSave: () => void;
  onLoad: () => void;
  onToggleTheme: () => void;
  isDarkTheme: boolean;
}

const MenuButtons = ({
  mounted,
  onSave,
  onLoad,
  onToggleTheme,
  isDarkTheme,
}: MenuButtonsProps) => {
  const showIntro = () => {
    if (mounted) {
      console.log('LazyMD 소개 버튼 클릭됨');
      window.alert(LAZY_MD_INTRO);
    }
  };

  return (
    <div className={styles.menuContent}>
      <button type='button' onClick={onSave}>
        <span>💾</span>
        저장
      </button>
      <button type='button' onClick={onLoad}>
        <span>📂</span>
        불러오기
      </button>
      <button type='button' onClick={onToggleTheme}>
        <span>{isDarkTheme ? '🌞' : '🌙'}</span>
        테마 경
      </button>
      <button type='button' onClick={showIntro}>
        <span>ℹ️</span>
        LazyMD 소개
      </button>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.container}>
    <header className={styles.header}>
      <h1>LazyMD</h1>
    </header>
    <main className={styles.main}>{children}</main>
  </div>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [markdownText, setMarkdownText] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const md = useMemo(
    () =>
      new MarkdownIt({
        breaks: true,
        html: true,
      }),
    []
  );

  useEffect(() => {
    setMounted(true);
    setIsMenuOpen(true);

    const savedMarkdown = localStorage.getItem('markdown_data');
    if (savedMarkdown) {
      setMarkdownText(savedMarkdown);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  useEffect(() => {
    const html = md.render(markdownText);
    setHtmlContent(html);
  }, [markdownText, md]);

  const handleSave = useCallback(() => {
    if (mounted) {
      try {
        localStorage.setItem('markdown_data', markdownText);
        alert('저장되었습니다.');
      } catch (error) {
        console.error('저장 중 오류 발생:', error);
        alert('저장에 실패했습니다.');
      }
    }
  }, [mounted, markdownText]);

  const handleLoad = useCallback(() => {
    if (mounted) {
      try {
        const savedMarkdown = localStorage.getItem('markdown_data');
        if (savedMarkdown) {
          setMarkdownText(savedMarkdown);
          alert('불러오기가 완료되었습니다.');
        } else {
          alert('저장된 내용이 없습니다.');
        }
      } catch (error) {
        console.error('불러오기 중 오류 발생:', error);
        alert('불러오기에 실패했습니다.');
      }
    }
  }, [mounted]);

  const handleToggleTheme = useCallback(() => {
    if (mounted) {
      const newTheme = !isDarkTheme;
      setIsDarkTheme(newTheme);
      document.documentElement.setAttribute(
        'data-theme',
        newTheme ? 'dark' : 'light'
      );
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
  }, [mounted, isDarkTheme]);

  const mainContent = (
    <>
      <main className={styles.main}>
        <div
          className={`${styles.leftMenu} ${!isMenuOpen ? styles.closed : ''}`}
        >
          {mounted && (
            <button
              className={styles.toggleButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? '◀' : '▶'}
            </button>
          )}
          <MenuButtons
            mounted={mounted}
            onSave={handleSave}
            onLoad={handleLoad}
            onToggleTheme={handleToggleTheme}
            isDarkTheme={isDarkTheme}
          />
        </div>
        <div className={styles.editorContainer}>
          <Toolbar />
          <textarea
            className={styles.editor}
            placeholder='마크다운을 입력하세요...'
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
          />
        </div>
        <div className={styles.previewContainer}>
          <div className={styles.previewToolbar}>마크다운 미리보기</div>
          <div
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </main>
    </>
  );

  return <Layout>{mainContent}</Layout>;
}
