'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

const LAZY_MD_INTRO = `마크다운 작성의 새로운 기준!

LazyMD는 복잡한 마크다운 문법을 손쉽게 작성하고, 실시간으로 결과를 확인할 수 있는 직관적인 에디터입니다. 단순한 클릭만으로도 아름다운 문서를 완성할 수 있으며, 강력한 툴바와 미리보기 기능으로 누구나 프로처럼 마크다운을 작성할 수 있습니다. 빠르고, 간편하고, 당신의 생산성을 극대화합니다. 이제 LazyMD로 마크다운 작성의 즐거움을 경험하세요!`;

interface MenuButtonsProps {
  mounted: boolean;
}

const MenuButtons = ({ mounted }: MenuButtonsProps) => {
  const showIntro = () => {
    if (mounted) {
      console.log('LazyMD 소개 버튼 클릭됨');
      window.alert(LAZY_MD_INTRO);
    }
  };

  return (
    <div className={styles.menuContent}>
      <button type='button'>
        <span>💾</span>
        저장
      </button>
      <button type='button'>
        <span>📂</span>
        불러오기
      </button>
      <button type='button'>
        <span>🎨</span>
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

  useEffect(() => {
    setMounted(true);
    setIsMenuOpen(true);
  }, []);

  const mainContent = (
    <>
      <div className={`${styles.leftMenu} ${!isMenuOpen ? styles.closed : ''}`}>
        {mounted && (
          <button
            type='button'
            className={styles.toggleButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span>{isMenuOpen ? '◀' : '▶'}</span>
            <span className={styles.toggleText}>메뉴</span>
          </button>
        )}
        <MenuButtons mounted={mounted} />
      </div>
      <div className={styles.editorContainer}>
        <div className={styles.toolbar}></div>
        <textarea
          className={styles.editor}
          placeholder='마크다운을 입력하세요...'
        />
      </div>
      <div className={styles.previewContainer}>
        <div className={styles.preview}>프리뷰 영역</div>
      </div>
    </>
  );

  return <Layout>{mainContent}</Layout>;
}
