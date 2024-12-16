import { FileX } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

// 서식 제거 함수
const clearFormatting = (
  text: string,
  selectionStart: number,
  selectionEnd: number
): string => {
  // 선택된 텍스트가 없으면 전체 텍스트를 대상으로
  if (selectionStart === selectionEnd) {
    return text
      .replace(/^(#{1,6}\s+|[-*+]\s+|\d+\.\s+|\s{2,})/gm, '') // 줄 시작 부분의 서식 제거
      .replace(/[*_~`\[\](){}]/g, ''); // 인라인 서식 제거
  }

  // 선택된 부분의 텍스트만 서식 제거
  const beforeSelection = text.slice(0, selectionStart);
  const selectedText = text
    .slice(selectionStart, selectionEnd)
    .replace(/^(#{1,6}\s+|[-*+]\s+|\d+\.\s+|\s{2,})/gm, '') // 줄 시작 부분의 서식 제거
    .replace(/[*_~`\[\](){}]/g, ''); // 인라인 서식 제거
  const afterSelection = text.slice(selectionEnd);

  return beforeSelection + selectedText + afterSelection;
};

// 서식 제거 핸들러
export const handleClearFormatting = (
  textArea: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
): void => {
  const { selectionStart, selectionEnd } = textArea;
  const newText = clearFormatting(markdownText, selectionStart, selectionEnd);
  setMarkdownText(newText);
};

// 서식 제거 버튼 컴포넌트
export function ClearFormattingButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Clear Formatting'>
      <FileX size={18} />
    </ToolbarButton>
  );
}
