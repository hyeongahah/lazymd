import { ReactNode } from 'react';

// 툴바 버튼 컴포넌트의 속성 타입 정의
export interface ToolbarButtonProps {
  onClick: () => void; // 클릭 이벤트 핸들러
  children: ReactNode; // 버튼 내부 컨텐츠
  title?: string; // 버튼 툴팁 텍스트
}
