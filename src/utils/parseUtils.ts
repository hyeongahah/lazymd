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

  // 텍스트를 빈 줄로 구분된 단락들로 나눔
  const paragraphs = text.split(/\n\n+/);
  let html = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    // 연속된 공백을 하나의 공백으로 변환하고, 줄바꿈을 공백으로 변환
    const processedParagraph = paragraph
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .replace(/\n/g, ' ') // 줄바꿈을 공백으로
      .trim();

    const lines = paragraph.split('\n');
    let currentListStack: { level: number; count: number }[] = [];
    let currentLevel = -1;

    // 인용문 확인
    if (lines[0].startsWith('>')) {
      const quotedContent = lines
        .map((line) => {
          // 중첩된 인용문 레벨 계산
          const level = (line.match(/^>+/)?.[0] || '').length;
          // '>' 문자와 그 뒤의 공백 제거
          const content = line.replace(/^>+\s?/, '');
          return { level, content };
        })
        .reduce((acc, { level, content }) => {
          // 현재 레벨에 따라 인용문 중첩
          let html = content;
          for (let i = 0; i < level; i++) {
            html = `<blockquote>${html}</blockquote>`;
          }
          return acc + html + ' ';
        }, '');

      html += parseInlineStyles(quotedContent.trim());
      continue;
    }

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];

      // 헤더 매칭
      const headerMatch = line.match(/^(#{1,6})\s(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const content = parseInlineStyles(headerMatch[2].trim());
        html += `<h${level}>${content}</h${level}>`;
        continue;
      }

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
        if (!lines[j + 1]?.match(/^(\s*)[-*+]\s+\[([ x])\]\s*(.*)$/)) {
          html += '</ul>';
        }
        continue;
      }

      // 순서 없는 리스트 매칭
      const unorderedListMatch = line.match(/^(\s*)[-*+]\s+(?!\[[ x]\])(.*)$/);
      if (unorderedListMatch) {
        const [, indent, text] = unorderedListMatch;
        const level = indent ? indent.length / 2 : 0;
        const markers = ['disc', 'circle', 'square'];
        const markerStyle = markers[level % markers.length];

        // 새로운 리스트 시작
        if (currentLevel === -1) {
          html += `<ul style="list-style-type: ${markerStyle}">`;
          currentLevel = 0;
        }
        // 들여쓰기 레벨이 증가한 경우
        else if (level > currentLevel) {
          html = html.replace(/<\/li>$/, ''); // 마지막 li 태그를 제거
          html += `<ul style="list-style-type: ${markerStyle}">`;
          currentLevel = level;
        }
        // 들여쓰기 레벨이 감소한 경우
        else if (level < currentLevel) {
          html += '</li>';
          while (currentLevel > level) {
            html += '</ul></li>';
            currentLevel--;
          }
        }
        // 같은 레벨의 새로운 항목
        else if (level === currentLevel && html.endsWith('</li>')) {
          html = html.slice(0, -5); // 마지막 </li> 제거
        }

        html += `<li>${parseInlineStyles(text)}`;

        // 다음 줄이 리스트가 아니거나 마지막 줄인 경우 리스트 종료
        if (
          j === lines.length - 1 ||
          !lines[j + 1].match(/^(\s*)[-*+]\s+(?!\[[ x]\])/)
        ) {
          html += '</li>';
          while (currentLevel >= 0) {
            html += '</ul>';
            currentLevel--;
          }
        }
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
          currentListStack.push({ level, count: 1 });
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
            currentListStack.length > 0 &&
            currentListStack[currentListStack.length - 1].level > level
          ) {
            html += '</ol></li>';
            currentListStack.pop();
          }
          currentLevel = level;
        }
        // 같은 레벨의 새로운 항목
        else {
          html += '</li>';
          if (currentListStack[currentListStack.length - 1]) {
            currentListStack[currentListStack.length - 1].count++;
          }
        }

        const currentStack = currentListStack[currentListStack.length - 1];
        const marker = currentStack
          ? getOrderedListMarker(currentStack.level, currentStack.count)
          : '1.';

        html += `<li><span class="list-marker">${marker}</span> ${text}`;
      } else {
        // 리스트가 아닌 경우, 모든 열린 리스트 닫기
        while (currentListStack.length > 0) {
          html += '</li></ol>';
          currentListStack.pop();
        }
        currentLevel = -1;

        if (processedParagraph.trim()) {
          html += `<p>${parseInlineStyles(processedParagraph)}</p>`;
        }
      }
    }
  }

  return html;
};
