import { ReactNode, useRef } from 'react';
import styles from '@/pages/page.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUndo } from '@/features/markdownSyntax/09simpleEdit/31undo';
import { RedoManager } from '@/features/markdownSyntax/09simpleEdit/32redo';
import { useMarkdown } from '@/hooks/useMarkdown';

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
    <button
      className={styles.toolbarButton}
      onClick={onClick}
      title={title}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        padding: '4px',
        margin: '0 2px',
        borderRadius: '4px',
        cursor: 'pointer',
        isolation: 'isolate',
        zIndex: 1,
      }}
    >
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
  const { setMarkdownText } = useMarkdown();
  const redoManager = new RedoManager(setMarkdownText);

  const handleUndo = () => {
    if (textareaRef.current) {
      undoManager.undo(textareaRef.current);
    }
  };

  const handleRedo = () => {
    if (textareaRef.current) {
      redoManager.redo(textareaRef.current);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!contentRef.current) return;

    const scrollAmount = 200;
    const currentScroll = contentRef.current.scrollLeft;

    contentRef.current.scrollTo({
      left:
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.scrollButton} ${styles.scrollLeft}`}
        onClick={() => handleScroll('left')}
      >
        <ChevronLeft size={18} />
      </button>
      <div className={styles.toolbarContent} ref={contentRef}>
        {Array.from({ length: 20 }, (_, i) => {
          const buttonNumber = i + 1;
          return (
            <div key={buttonNumber} className={styles.toolbarItem}>
              <ToolbarButton
                onClick={
                  buttonNumber === 1
                    ? handleUndo
                    : buttonNumber === 2
                    ? handleRedo
                    : () => {}
                }
                title={
                  buttonNumber === 1
                    ? 'Undo (Ctrl+Z)'
                    : buttonNumber === 2
                    ? 'Redo (Ctrl+Y)'
                    : undefined
                }
              >
                {buttonNumber === 1
                  ? '↶'
                  : buttonNumber === 2
                  ? '↷'
                  : buttonNumber}
              </ToolbarButton>
            </div>
          );
        })}
      </div>
      <button
        className={`${styles.scrollButton} ${styles.scrollRight}`}
        onClick={() => handleScroll('right')}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
