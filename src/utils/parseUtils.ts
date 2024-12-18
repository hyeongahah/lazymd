import { parseBold } from '@/features/markdownSyntax/01basicSyntax/10Bold';
import { parseItalic } from '@/features/markdownSyntax/01basicSyntax/11Italic';
import { getOrderedListMarker } from '@/utils/listUtils';

// 인라인 스타일 파싱 함수
export const parseInlineStyles = (text: string): string => {
  // 볼드체와 이탤릭체가 함께 있는 경우
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // 볼드체
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 이탤릭체
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 취소선 추가
  text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // 인라인 코드 추가
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');

  // 하이라이트 파싱 추가 (== 문법)
  // 안쪽부터 바깥쪽으로 처리
  while (text.includes('==')) {
    // 가장 안쪽의 == 쌍을 찾아서 처리
    text = text.replace(/==([^=]*?)==/g, '<mark>$1</mark>');
  }

  // 인라인 링크 추가 ([text](url) 형식)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // URL 링크 추가 (<url> 형식)
  text = text.replace(/<(https?:\/\/[^\s>]+)>/g, '<a href="$1">$1</a>');

  return text;
};

export const parseMarkdown = (text: string): string => {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';
  let listStack: { level: number; count: number }[] = [];
  let currentLevel = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 체크리스트 매칭
    const checklistMatch = line.match(/^(\s*)[-*+]\s+\[([ x])\]\s*(.*)$/);
    if (checklistMatch) {
      const [, indent, checked, content] = checklistMatch;
      const isChecked = checked === 'x';

      // 체크리스트가 시작될 때 ul 태그 추가
      if (!html.includes('<ul class="task-list">')) {
        html += '<ul class="task-list">';
      }

      // 불필요한 개행과 공백 제거
      html += `<li class="task-list-item"><input type="checkbox" ${
        isChecked ? 'checked' : ''
      } disabled>${parseInlineStyles(content)}</li>`;

      // 다음 줄이 체크리스트가 아니면 ul 태그 닫기
      if (!lines[i + 1]?.match(/^(\s*)[-*+]\s+\[([ x])\]\s*(.*)$/)) {
        html += '</ul>';
      }
      continue;
    }

    // 헤더 매칭
    const headerMatch = line.match(/^(#{1,6})\s(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = parseInlineStyles(headerMatch[2]);
      html += `<h${level}>${content}</h${level}>`;
      continue;
    }

    // 순서 있는 리스트 매칭
    const listMatch = line.match(
      /^(\s*)(?:(\d+)|([IVXivx]+)|([A-Za-z]))\.?\s(.*)$/
    );
    if (listMatch) {
      const [, indent, num, roman, alpha, text] = listMatch;
      const level = indent ? indent.length / 2 : 0;

      // 새로운 리스트 시작 또는 더 깊은 레벨로 이동
      if (level > currentLevel) {
        // 새로운 레벨의 카운터 초기화
        listStack.push({ level, count: 1 });
        const marker = getOrderedListMarker(level, 1);
        const newList = `<ol class="level-${level}" style="list-style-type: none;">`;

        if (currentLevel === -1) {
          html += newList;
        } else {
          html = html.replace(/<\/li>\s*$/, '');
          html += newList;
        }
        currentLevel = level;
      }
      // 이전 레벨로 돌아가기
      else if (level < currentLevel) {
        while (
          listStack.length > 0 &&
          listStack[listStack.length - 1].level > level
        ) {
          html += '</ol></li>';
          listStack.pop();
        }
        currentLevel = level;
      }
      // 같은 레벨의 새로운 항목
      else {
        html += '</li>';
        // 현재 레벨의 카운터 증가
        if (listStack[listStack.length - 1]) {
          listStack[listStack.length - 1].count++;
        }
      }

      // 현재 레벨의 마커 생성
      const currentStack = listStack[listStack.length - 1];
      const marker = currentStack
        ? getOrderedListMarker(currentStack.level, currentStack.count)
        : '1.';

      html += `<li><span class="list-marker">${marker}</span> ${text}`;
    } else {
      // 리스트가 아닌 경우, 모든 열린 리스트 닫기
      while (listStack.length > 0) {
        html += '</li></ol>';
        listStack.pop();
      }
      currentLevel = -1;

      if (line.trim()) {
        // 일반 텍스트에 인라인 스타일 적용
        const parsedLine = parseInlineStyles(line);
        html += `<p>${parsedLine}</p>`;
      }
    }
  }

  return html;
};
