import { ReactNode } from 'react';
import styles from '@/pages/page.module.css';
import {
  Bold,
  Italic,
  Strike,
  Underline,
  Highlight,
  HeadingDropdown,
  ClearFormatting,
  Undo,
  Redo,
} from '@/features/mdTool';

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

export function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarContent}>
        <Bold />
        <Italic />
        <Strike />
        <Underline />
        <Highlight />
        <div className={styles.toolbarDivider} />
        <HeadingDropdown />
        <div className={styles.toolbarDivider} />
        <ClearFormatting />
        <div className={styles.toolbarDivider} />
        <Undo />
        <Redo />
      </div>
    </div>
  );
}
