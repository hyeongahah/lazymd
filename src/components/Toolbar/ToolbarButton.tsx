import { ReactNode, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMarkdown } from '@/hooks/useMarkdown';
import { UndoButton } from '@/features/markdownSyntax/09simpleEdit/31undo';
import {
  RedoButton,
  RedoManager,
  handleRedoKeyPress,
} from '@/features/markdownSyntax/09simpleEdit/32redo';
import {
  ClearFormattingButton,
  handleClearFormatting,
} from '@/features/markdownSyntax/09simpleEdit/33clearFormatting';
import { HeadingDropdownButton } from '@/features/markdownSyntax/01basicSyntax/01-06headingDropdown';
import { useUndo } from '@/features/markdownSyntax/09simpleEdit/31undo';
import { BoldButton } from '@/features/markdownSyntax/01basicSyntax/10Bold';
import { ItalicButton } from '@/features/markdownSyntax/01basicSyntax/11Italic';
import { StrikethroughButton } from '@/features/markdownSyntax/01basicSyntax/12Strikethrough';
import { UnderlineButton } from '@/features/markdownSyntax/09simpleEdit/35underline';
import { HighlightButton } from '@/features/markdownSyntax/06miscFeatures/21highlight';
import { ClearAllButton } from '@/features/markdownSyntax/09simpleEdit/50clearAll';
import { BlockquoteButton } from '@/features/markdownSyntax/03blockElements/17Blockquote';
import {
  UnorderedListButton,
  handleUnorderedList,
} from '@/features/markdownSyntax/01basicSyntax/07UnorderedList';
import { OrderedListButton } from '@/features/markdownSyntax/01basicSyntax/08OrderedList';
import { InlineLinkButton } from '@/features/markdownSyntax/02linksAndImages/14InlineLink';

interface ToolbarButtonProps {
  onClick: () => void;
  children: ReactNode;
  title?: string;
}

export function ToolbarButton({
  onClick,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <button className={styles.toolbarButton} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

interface ToolbarProps {
  undoManager: ReturnType<typeof useUndo>['undoManager'];
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export function Toolbar({ undoManager, textareaRef }: ToolbarProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef<number>(0);
  const { markdownText, setMarkdownText } = useMarkdown();
  const redoManager = new RedoManager(setMarkdownText);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleRedoKeyPress(e, textareaRef.current, redoManager);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [redoManager, textareaRef]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      lastScrollRef.current = content.scrollLeft;
    };

    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !contentRef.current) return;

    const handleFocus = () => {
      if (contentRef.current) {
        contentRef.current.scrollLeft = lastScrollRef.current;
      }
    };

    textarea.addEventListener('focus', handleFocus);
    return () => textarea.removeEventListener('focus', handleFocus);
  }, [textareaRef]);

  const handleScroll = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();

    if (!contentRef.current) return;

    const container = contentRef.current;
    const buttonWidth = 34;
    const gapWidth = 8;
    const unitWidth = buttonWidth + gapWidth;

    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let targetScroll;
    if (direction === 'left') {
      targetScroll = Math.max(0, currentScroll - unitWidth * 6);
    } else {
      targetScroll = Math.min(maxScroll, currentScroll + unitWidth * 6);
    }

    lastScrollRef.current = targetScroll;

    requestAnimationFrame(() => {
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    });
  };

  const handleClearAll = () => {
    if (textareaRef.current) {
      setMarkdownText('');
      textareaRef.current.setSelectionRange(0, 0);
      textareaRef.current.focus();
    }
  };

  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.scrollButton} ${styles.scrollLeft}`}
        onClick={(e) => handleScroll(e, 'left')}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ChevronLeft size={18} />
      </button>
      <div
        className={styles.toolbarContent}
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
      >
        {Array.from({ length: 20 }, (_, i) => {
          const buttonNumber = i + 1;
          return (
            <div key={buttonNumber} className={styles.toolbarItem}>
              {buttonNumber === 1 ? (
                <UndoButton
                  undoManager={undoManager}
                  textareaRef={textareaRef}
                />
              ) : buttonNumber === 2 ? (
                <RedoButton
                  onClick={() => redoManager.redo(textareaRef.current)}
                />
              ) : buttonNumber === 3 ? (
                <ClearAllButton onClick={handleClearAll} />
              ) : buttonNumber === 4 ? (
                <ClearFormattingButton
                  onClick={() => {
                    if (textareaRef.current) {
                      handleClearFormatting(
                        textareaRef.current,
                        markdownText,
                        setMarkdownText
                      );
                    }
                  }}
                />
              ) : buttonNumber === 5 ? (
                <HeadingDropdownButton
                  onClick={() => {}}
                  textareaRef={textareaRef}
                  setMarkdownText={setMarkdownText}
                />
              ) : buttonNumber === 6 ? (
                <BoldButton />
              ) : buttonNumber === 7 ? (
                <ItalicButton />
              ) : buttonNumber === 8 ? (
                <StrikethroughButton />
              ) : buttonNumber === 9 ? (
                <UnderlineButton />
              ) : buttonNumber === 10 ? (
                <HighlightButton />
              ) : buttonNumber === 11 ? (
                <BlockquoteButton
                  onClick={() => {}}
                  textareaRef={textareaRef}
                  setMarkdownText={setMarkdownText}
                />
              ) : buttonNumber === 12 ? (
                <UnorderedListButton
                  onClick={() => {
                    if (textareaRef.current) {
                      const start = textareaRef.current.selectionStart;
                      const end = textareaRef.current.selectionEnd;
                      const text = textareaRef.current.value;

                      // 선택된 텍스트가 있는 경우
                      if (start !== end) {
                        const selectedText = text.substring(start, end);
                        const lines = selectedText.split('\n');
                        const isAllList = lines.every((line) =>
                          line.trimStart().startsWith('- ')
                        );

                        const newLines = lines
                          .map((line) => {
                            const trimmed = line.trimStart();
                            return isAllList
                              ? line.replace(/^\s*- /, '')
                              : `- ${line}`;
                          })
                          .join('\n');

                        const newText =
                          text.substring(0, start) +
                          newLines +
                          text.substring(end);
                        setMarkdownText(newText);

                        // 커서 위치 조정
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.selectionStart = start;
                            textareaRef.current.selectionEnd =
                              start + newLines.length;
                            textareaRef.current.focus();
                          }
                        }, 0);
                      } else {
                        // 현재 줄에 리스트 마커 추가/제거
                        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
                        const lineEnd = text.indexOf('\n', start);
                        const currentLine = text.substring(
                          lineStart,
                          lineEnd === -1 ? text.length : lineEnd
                        );

                        const trimmedLine = currentLine.trimStart();
                        const isAlreadyList = trimmedLine.startsWith('- ');

                        const newLine = isAlreadyList
                          ? currentLine.replace(/^\s*- /, '')
                          : `- ${currentLine}`;

                        const newText =
                          text.substring(0, lineStart) +
                          newLine +
                          text.substring(
                            lineEnd === -1 ? text.length : lineEnd
                          );

                        setMarkdownText(newText);

                        // 커서 위치 조정
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.selectionStart =
                              lineStart + newLine.length;
                            textareaRef.current.selectionEnd =
                              lineStart + newLine.length;
                            textareaRef.current.focus();
                          }
                        }, 0);
                      }
                    }
                  }}
                />
              ) : buttonNumber === 13 ? (
                <OrderedListButton
                  onClick={() => {
                    if (textareaRef.current) {
                      const start = textareaRef.current.selectionStart;
                      const end = textareaRef.current.selectionEnd;
                      const text = textareaRef.current.value;

                      // 선택된 텍스트가 있는 경우
                      if (start !== end) {
                        const selectedText = text.substring(start, end);
                        const lines = selectedText.split('\n');
                        const isAllList = lines.every((line) =>
                          line.trimStart().match(/^\d+\.\s/)
                        );

                        const newLines = lines
                          .map((line, index) => {
                            const trimmed = line.trimStart();
                            return isAllList
                              ? line.replace(/^\s*\d+\.\s/, '')
                              : `${index + 1}. ${line}`;
                          })
                          .join('\n');

                        const newText =
                          text.substring(0, start) +
                          newLines +
                          text.substring(end);
                        setMarkdownText(newText);

                        // 커서 위치 조정
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.selectionStart = start;
                            textareaRef.current.selectionEnd =
                              start + newLines.length;
                            textareaRef.current.focus();
                          }
                        }, 0);
                      } else {
                        // 현재 줄에 리스트 마커 추가/제거
                        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
                        const lineEnd = text.indexOf('\n', start);
                        const currentLine = text.substring(
                          lineStart,
                          lineEnd === -1 ? text.length : lineEnd
                        );

                        const trimmedLine = currentLine.trimStart();
                        const isAlreadyList = trimmedLine.match(/^\d+\.\s/);

                        const newLine = isAlreadyList
                          ? currentLine.replace(/^\s*\d+\.\s/, '')
                          : `1. ${currentLine}`;

                        const newText =
                          text.substring(0, lineStart) +
                          newLine +
                          text.substring(
                            lineEnd === -1 ? text.length : lineEnd
                          );

                        setMarkdownText(newText);

                        // 커서 위치 조정
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.selectionStart =
                              lineStart + newLine.length;
                            textareaRef.current.selectionEnd =
                              lineStart + newLine.length;
                            textareaRef.current.focus();
                          }
                        }, 0);
                      }
                    }
                  }}
                />
              ) : buttonNumber === 14 ? (
                <InlineLinkButton />
              ) : (
                <ToolbarButton onClick={() => {}} title={undefined}>
                  {buttonNumber}
                </ToolbarButton>
              )}
            </div>
          );
        })}
      </div>
      <button
        className={`${styles.scrollButton} ${styles.scrollRight}`}
        onClick={(e) => handleScroll(e, 'right')}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
