import { ElementNode, TextNode, ListNode } from '@/types/markdown';
import { ListOrdered } from 'lucide-react'; // 순서 있는 리스트 아이콘
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { updateCursorPosition } from '@/utils/editorUtils';
import {
  calculateIndentLevel,
  handleListIndentation,
  getOrderedListMarker,
  handleListEnterKey,
} from '@/utils/listUtils';
import React from 'react';

// ... 기존 parseOrderedList, handleOrderedList 로직 유지 ...

export const parseOrderedList = (text: string): ElementNode => {
  const items = text.split('\n');
  let currentLevel = 0;
  let currentList: ElementNode = {
    type: 'element',
    tagName: 'ol',
    properties: { className: ['ordered-list'] },
    children: [],
  };
  let listStack: ElementNode[] = [currentList];

  // ... 기존 parseOrderedList 로직 ...
  return listStack[0];
};

export const handleOrderedList = (
  currentLine: string,
  cursorPosition: number,
  isTab: boolean,
  markdownText: string,
  setMarkdownText: (text: string) => void,
  textarea: HTMLTextAreaElement
) => {
  const listMatch = currentLine.match(
    /^(\s*)(?:(\d+)|([IVXivx]+)|([A-Za-z]))\.?\s(.*)$/
  );
  if (!listMatch) return false;

  const [, indent, num, roman, alpha, text] = listMatch;
  const indentLevel = indent ? indent.length / 2 : 0;

  // 탭 키 처리
  if (isTab) {
    const lines = markdownText.split('\n');
    const currentLineIndex =
      markdownText.slice(0, cursorPosition).split('\n').length - 1;

    // 이전 라인의 들여쓰기 레벨 확인
    const prevLineIndent =
      currentLineIndex > 0
        ? (lines[currentLineIndex - 1].match(/^\s*/) || [''])[0]
        : '';
    const prevIndentLevel = prevLineIndent.length / 2;

    // 이전 라인보다 한 단계만 더 들여쓰기 허용
    if (indentLevel >= prevIndentLevel + 1) {
      return true;
    }

    // 새로운 들여쓰기 레벨의 마커 생성
    const newIndent = '  '.repeat(indentLevel + 1);
    const newMarker = getOrderedListMarker(indentLevel + 1, 1);
    const newLine = `${newIndent}${newMarker} ${text}`;

    lines[currentLineIndex] = newLine;
    const newText = lines.join('\n');
    setMarkdownText(newText);

    // 커서 위치 조정
    const newCursorPosition = newText.indexOf(newLine) + newLine.length;
    textarea.selectionStart = textarea.selectionEnd = newCursorPosition;

    return true;
  }

  // 엔터 키 처리
  if (!text.trim()) {
    const lines = markdownText.split('\n');
    const currentLineIndex =
      markdownText.slice(0, cursorPosition).split('\n').length - 1;

    // 이전 라인이 비어있었는지 확인
    const prevLineWasEmpty =
      currentLineIndex > 0 && !lines[currentLineIndex - 1].trim();

    if (prevLineWasEmpty) {
      // 이전 빈 라인과 현재 라인을 제거
      lines.splice(currentLineIndex - 1, 2);
      const newText = lines.join('\n') + '\n\n';
      setMarkdownText(newText);

      // 커서를 새로운 빈 라인의 시작 위치로 이동
      const newPosition = lines.join('\n').length + 1;
      textarea.selectionStart = textarea.selectionEnd = newPosition;
      return true;
    } else if (indentLevel > 0) {
      // 들여쓰기된 상태에서는 한 레벨 위로 이동
      const newIndent = '  '.repeat(indentLevel - 1);
      const newMarker =
        indentLevel > 1 ? getOrderedListMarker(indentLevel - 1, 1) : '1.';
      const newLine = newIndent + newMarker + ' ';

      lines[currentLineIndex] = newLine;
      const newText = lines.join('\n');
      setMarkdownText(newText);

      // 커서 위치 조정
      const newCursorPosition = newText.indexOf(newLine) + newLine.length;
      textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
      return true;
    }

    // 첫 번째 엔터: 현재 라인을 빈 리스트 항목으로 유지
    return true;
  }

  // 새로운 리스트 항목 추가
  const lines = markdownText.split('\n');
  const currentLineIndex =
    markdownText.slice(0, cursorPosition).split('\n').length - 1;

  // 현재 레벨의 다음 마커 생성
  const nextMarker = getOrderedListMarker(
    indentLevel,
    num ? parseInt(num) + 1 : 2
  ); // 숫자가 있으면 증가, 없으면 2부터 시작

  const newLine = `${indent}${nextMarker} `;
  const newText =
    markdownText.slice(0, cursorPosition) +
    '\n' +
    newLine +
    markdownText.slice(cursorPosition);

  setMarkdownText(newText);

  // 커서 위치 조정
  const newCursorPosition = cursorPosition + newLine.length + 1;
  textarea.selectionStart = textarea.selectionEnd = newCursorPosition;

  return true;
};

// 순서 있는 리스트 버튼 컴포넌트
export function OrderedListButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Ordered List'>
      <ListOrdered size={18} />
    </ToolbarButton>
  );
}
