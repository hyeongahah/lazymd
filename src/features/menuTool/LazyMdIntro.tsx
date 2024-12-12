import React from 'react';
import styles from '@/app/page.module.css';
import { FileText } from 'lucide-react';

export const LAZY_MD_INTRO = `마크다운 작성의 새로운 기준!

LazyMD는 복잡한 마크다운 문법을 손쉽게 작성하고, 실시간으로 결과를 확인할 수 있는 직관적인 에디터입니다. 단순한 클릭만으로도 아름다운 문서를 완성할 수 있으며, 강력한 툴바와 미리보기 기능으로 누구나 프로처럼 마크다운을 작성할 수 있습니다. 빠르고, 간편하고, 당신의 생산성을 극대화합니다. 이제 LazyMD로 마크다운 작성의 즐거움을 경험하세요!`;

interface LazyMdIntroProps {
  setMarkdownText: (text: string) => void;
}

export const LazyMdIntro = ({ setMarkdownText }: LazyMdIntroProps) => {
  return (
    <button
      className={styles.menuButton}
      onClick={() => setMarkdownText(LAZY_MD_INTRO)}
    >
      <FileText size={18} />
      LazyMD 소개글 보기
    </button>
  );
};
