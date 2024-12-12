'use client';

import styles from './page.module.css';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import { Undo2, Redo2, FileX, Heading, Bold } from 'lucide-react';

const LAZY_MD_INTRO = `마크다운 작성의 새로운 기준!

LazyMD는 복잡한 마크다운 문법을 손쉽게 작성하고, 실시간으로 결과를 확인할 수 있는 직관적인 에디터입니다. 단순한 클릭만으로도 아름다운 문서를 완성할 수 있으며, 강력한 툴바와 미리보기 기능으로 누구나 프로처럼 마크다운을 작성할 수 있습니다. 빠르고, 간편하고, 당신의 생산성을 극대화합니다. 이제 LazyMD로 마크다운 작성의 즐거움을 경험하세요!`;

interface MenuButtonsProps {
  mounted: boolean;
  markdownText: string;
  onSave: () => void;
  onLoad: () => void;
  onToggleTheme: () => void;
  isDarkTheme: boolean;
  setMarkdownText: (text: string) => void;
}

const MenuButtons = ({
  mounted,
  markdownText,
  onSave,
  onLoad,
  onToggleTheme,
  isDarkTheme,
  setMarkdownText,
}: MenuButtonsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      alert('마크다운(.md) 파일만 불러올 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdownText(content);
    };
    reader.readAsText(file);

    event.target.value = '';
  };

  const showIntro = () => {
    if (mounted) {
      console.log('LazyMD 소개 버튼 클릭됨');
      window.alert(LAZY_MD_INTRO);
    }
  };

  const handleSaveFile = () => {
    // 사용자에게 파일명 입력받기
    const filename = window.prompt(
      '저장할 파일명을 입력하세요 (.md)',
      'LazyMD.md'
    );

    // 취소하거나 빈 파일명인 경우 중단
    if (!filename) return;

    // 파일명에 .md 확장자가 없으면 추가
    const finalFilename = filename.endsWith('.md')
      ? filename
      : `${filename}.md`;

    // 마크다운 텍스트를 Blob으로 변환
    const blob = new Blob([markdownText], { type: 'text/markdown' });

    // 다운로드 링크 생성
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;

    // 링크 클릭 시뮬레이션
    document.body.appendChild(link);
    link.click();

    // cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.menuContent}>
      <input
        type='file'
        ref={fileInputRef}
        accept='.md'
        style={{ display: 'none' }}
        onChange={handleLoadFile}
      />
      <button type='button' onClick={handleSaveFile}>
        <span>💾</span>
        파일로 저장
      </button>
      <button type='button' onClick={() => fileInputRef.current?.click()}>
        <span>📂</span>
        불러오기
      </button>
      <button type='button' onClick={onToggleTheme}>
        <span>{isDarkTheme ? '🌞' : '🌙'}</span>
        테마 변경
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
        breaks: false,
        html: true,
        linkify: true,
      }).use((md) => {
        const defaultRender =
          md.renderer.rules.softbreak ||
          function (tokens, idx, options) {
            return options.xhtmlOut ? '<br />' : '\n';
          };

        md.renderer.rules.softbreak = function (tokens, idx, options) {
          return '<br />';
        };
      }),
    []
  );
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isCursorBold, setIsCursorBold] = useState(false);

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

    setTimeout(() => {
      const textarea = document.querySelector(
        `.${styles.editor}`
      ) as HTMLTextAreaElement | null;
      const preview = document.querySelector(`.${styles.preview}`);

      if (textarea && preview) {
        textarea.scrollTop = textarea.scrollHeight;
        preview.scrollTop = preview.scrollHeight;
      }
    }, 0);
  }, [markdownText, md]);

  useEffect(() => {
    if (markdownText !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(markdownText);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [markdownText]);

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

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMarkdownText(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setMarkdownText(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  const handleClearFormatting = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 현재 줄의 전체 텍스트 가져오기
    const lines = markdownText.split('\n');
    let currentLine = '';
    let lineStart = 0;
    let lineEnd = 0;

    // 현재 커서가 위치한 줄 찾기
    for (let i = 0; i < lines.length; i++) {
      lineEnd = lineStart + lines[i].length;
      if (start >= lineStart && start <= lineEnd) {
        currentLine = lines[i];
        break;
      }
      lineStart = lineEnd + 1;
    }

    // 서식이 적용된 텍스트 찾기
    let formatStart = lineStart;
    let formatEnd = lineEnd;

    // 헤더 검사
    if (currentLine.match(/^#{1,6}\s/)) {
      const headerText = currentLine.replace(/^#{1,6}\s+/, '');
      setMarkdownText(
        markdownText.substring(0, lineStart) +
          headerText +
          markdownText.substring(lineEnd)
      );
      return;
    }

    // 볼드체 검사
    if (currentLine.includes('**')) {
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let match;
      while ((match = boldRegex.exec(currentLine)) !== null) {
        const matchStart = lineStart + match.index;
        const matchEnd = matchStart + match[0].length;
        if (start >= matchStart && start <= matchEnd) {
          setMarkdownText(
            markdownText.substring(0, matchStart) +
              match[1] +
              markdownText.substring(matchEnd)
          );
          return;
        }
      }
    }

    // 이탤릭체 검사
    if (currentLine.includes('*')) {
      const italicRegex = /\*([^*]+)\*/g;
      let match;
      while ((match = italicRegex.exec(currentLine)) !== null) {
        const matchStart = lineStart + match.index;
        const matchEnd = matchStart + match[0].length;
        if (start >= matchStart && start <= matchEnd) {
          setMarkdownText(
            markdownText.substring(0, matchStart) +
              match[1] +
              markdownText.substring(matchEnd)
          );
          return;
        }
      }
    }
  }, [markdownText]);

  const handleBold = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 텍스트가 선택되었는지 확인
    if (start === end) {
      alert('볼드체로 변경할 텍스트를 선택해주세요.');
      return;
    }

    // 선택 영역 앞뒤의 문자를 포함하여 확인
    const beforeText = markdownText.substring(Math.max(0, start - 2), start);
    const afterText = markdownText.substring(
      end,
      Math.min(markdownText.length, end + 2)
    );
    const selectedText = markdownText.substring(start, end);

    // 현재 선택된 텍스트가 볼드체인지 확인
    const isBold = beforeText === '**' && afterText === '**';

    let newText;
    if (isBold) {
      // 볼드체 제거
      newText =
        markdownText.substring(0, start - 2) +
        selectedText +
        markdownText.substring(end + 2);

      // 커서 위치 조정 (볼드체 마크다운 제거 고려)
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start - 2, end - 2);
      }, 0);
    } else {
      // 볼드체 적용
      newText =
        markdownText.substring(0, start) +
        `**${selectedText}**` +
        markdownText.substring(end);

      // 커서 위치 조정 (볼드체 마크다운 추가 고려)
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, end + 2);
      }, 0);
    }

    setMarkdownText(newText);
  }, [markdownText]);

  const handleCursorChange = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 현재 줄의 전��� 텍스트 가져오기
    const lines = markdownText.split('\n');
    let currentLine = '';
    let lineStart = 0;
    let lineEnd = 0;

    // 현재 커서가 위치한 줄 찾기
    for (let i = 0; i < lines.length; i++) {
      lineEnd = lineStart + lines[i].length;
      if (start >= lineStart && start <= lineEnd) {
        currentLine = lines[i];
        break;
      }
      lineStart = lineEnd + 1;
    }

    // 볼드체 패턴 찾기
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match;
    let isBold = false;

    while ((match = boldRegex.exec(currentLine)) !== null) {
      const matchStart = lineStart + match.index;
      const matchEnd = matchStart + match[0].length;

      // 커서가 볼드체 영역 안에 있는지 확인
      if (start >= matchStart && start <= matchEnd) {
        isBold = true;
        break;
      }
    }

    setIsCursorBold(isBold);
  }, [markdownText]);

  useEffect(() => {
    handleCursorChange();
  }, [handleCursorChange, markdownText]);

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
            markdownText={markdownText}
            onSave={handleSave}
            onLoad={handleLoad}
            onToggleTheme={handleToggleTheme}
            isDarkTheme={isDarkTheme}
            setMarkdownText={setMarkdownText}
          />
        </div>
        <div className={styles.editorContainer}>
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
                <button
                  key={index}
                  className={styles.toolbarButton}
                  onClick={
                    index === 0
                      ? handleUndo
                      : index === 1
                      ? handleRedo
                      : index === 2
                      ? handleClearFormatting
                      : index === 4
                      ? handleBold
                      : undefined
                  }
                  style={{
                    width: '40px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {index === 0 ? (
                    <Undo2 size={18} />
                  ) : index === 1 ? (
                    <Redo2 size={18} />
                  ) : index === 2 ? (
                    <FileX size={18} />
                  ) : index === 3 ? (
                    <div
                      className={styles.headingButtonWrapper}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const dropdown = e.currentTarget.querySelector(
                          `.${styles.headingDropdown}`
                        );
                        if (dropdown) {
                          (dropdown as HTMLElement).style.top = `${
                            rect.bottom + 5
                          }px`;
                          (
                            dropdown as HTMLElement
                          ).style.left = `${rect.left}px`;
                        }
                      }}
                    >
                      <Heading size={18} />
                      <div className={styles.headingDropdown}>
                        <button className={styles.headingOption}>H1</button>
                        <button className={styles.headingOption}>H2</button>
                        <button className={styles.headingOption}>H3</button>
                        <button className={styles.headingOption}>H4</button>
                        <button className={styles.headingOption}>H5</button>
                        <button className={styles.headingOption}>H6</button>
                      </div>
                    </div>
                  ) : index === 4 ? (
                    <button
                      className={styles.toolbarButton}
                      style={{
                        width: '40px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isCursorBold
                          ? '#1E90FF'
                          : 'var(--background-color)',
                        color: isCursorBold ? 'white' : 'var(--text-color)',
                      }}
                    >
                      <Bold size={18} />
                    </button>
                  ) : (
                    index + 1
                  )}
                </button>
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
          <div className={styles.editorWrapper}>
            <div className={styles.lineNumbers}>
              {Array.from({ length: markdownText.split('\n').length || 1 }).map(
                (_, i) => (
                  <div key={i} className={styles.lineNumber}>
                    {i + 1}
                  </div>
                )
              )}
            </div>
            <textarea
              className={styles.editor}
              placeholder='마크다운을 입력하세요...'
              value={markdownText}
              onChange={(e) => {
                setMarkdownText(e.target.value);
                const textarea = e.target;
                const preview = document.querySelector(`.${styles.preview}`);

                if (textarea && preview) {
                  textarea.scrollTop = textarea.scrollHeight;
                  preview.scrollTop = preview.scrollHeight;
                }
              }}
              onSelect={handleCursorChange}
              onScroll={(e) => {
                const lineNumbers = document.querySelector(
                  `.${styles.lineNumbers}`
                );
                if (lineNumbers) {
                  lineNumbers.scrollTop = e.currentTarget.scrollTop;
                }

                const preview = document.querySelector(`.${styles.preview}`);
                if (preview) {
                  const scrollRatio =
                    e.currentTarget.scrollTop /
                    (e.currentTarget.scrollHeight -
                      e.currentTarget.clientHeight);
                  preview.scrollTop =
                    scrollRatio * (preview.scrollHeight - preview.clientHeight);
                }
              }}
            />
          </div>
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
