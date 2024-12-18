import React from 'react';
import styles from '@/pages/page.module.css';
import { Logo } from './Logo';
import { Maximize2 } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import { useSearchStore } from '@/store/searchStore';

export function Header() {
  const { isOpen, toggle } = useMenuStore();
  const { openSearchModal } = useSearchStore();

  return (
    <header className={styles.header}>
      <div className={styles.headerMenuToggle}>
        <button
          className={styles.toggleButton}
          onClick={toggle}
          title={isOpen ? 'Close Menu' : 'Open Menu'}
        >
          <span className={styles.toggleIcon}>{isOpen ? '◀' : '▶'}</span>
        </button>
      </div>
      <div className={styles.headerLogo}>
        <Logo />
      </div>
      <div className={styles.headerSyntaxSearch}>
        <button
          className={styles.toggleButton}
          onClick={openSearchModal}
          title='Search Syntax (F1)'
        >
          <span className={styles.toggleIcon}>🔍</span>
        </button>
      </div>
      <div className={styles.headerExpandToggle}>
        <button className={styles.toggleButton}>
          <Maximize2 size={18} />
        </button>
      </div>
    </header>
  );
}
