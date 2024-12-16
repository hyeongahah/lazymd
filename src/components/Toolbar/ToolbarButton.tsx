import { ReactNode, useRef, useEffect } from 'react';
import styles from '@/pages/page.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUndo } from '@/features/markdownSyntax/09simpleEdit/31undo';

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

  const handleUndo = () => {
    if (textareaRef.current) {
      undoManager.undo(textareaRef.current);
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
        {/* 1번부터 20번까지의 버튼 */}
        {Array.from({ length: 20 }, (_, i) => {
          const buttonNumber = i + 1; // 1부터 20까지의 번호
          return (
            <div key={buttonNumber} className={styles.toolbarItem}>
              <ToolbarButton
                onClick={buttonNumber === 1 ? handleUndo : () => {}}
                title={buttonNumber === 1 ? 'Undo (Ctrl+Z)' : undefined}
              >
                {buttonNumber === 1 ? '↶' : buttonNumber}
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
