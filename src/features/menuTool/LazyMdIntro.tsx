import React from 'react';
import styles from '@/pages/page.module.css';
import { useMarkdown } from '@/hooks/useMarkdown';

export function LazyMdIntro() {
  const { setMarkdownText } = useMarkdown();

  const handleIntroClick = () => {
    setMarkdownText(`# Welcome to LazyMD

LazyMD는 간단하고 편리한 마크다운 에디터입니다.

## 주요 기능
- 실시간 마크다운 미리보기
- 파일 저장 및 불러오기
- 다양한 마크다운 서식 지원

### 사용 방법
1. 왼쪽 패널에 마크다운 작성
2. 오른쪽 패널에서 실시간으로 결과 확인
3. 작성한 내용 자동 저장

#### 마크다운 문법 예시
- **굵은 글씨**
- *기울임 글씨*
- ~~취소선~~
- \`코드\`
- > 인용문
`);
  };

  return (
    <button className={styles.menuButton} onClick={handleIntroClick}>
      <span>📖</span> About LazyMD
    </button>
  );
}
