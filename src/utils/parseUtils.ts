import { parseBold } from '@/features/markdownSyntax/01basicSyntax/10Bold';
import { parseItalic } from '@/features/markdownSyntax/01basicSyntax/11Italic';
import { getOrderedListMarker } from '@/utils/listUtils';

// 인라인 스타일 파싱 함수
export const parseInlineStyles = (text: string) => {
  // 볼드체와 이탤릭체가 중첩된 경우 (***text***)
  if (text.startsWith('***') && text.endsWith('***')) {
    const innerText = text.slice(3, -3);
    return {
      type: 'element',
      tagName: 'strong',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'em',
          properties: {},
          children: [{ type: 'text', value: innerText }],
        },
      ],
    };
  }

  // 볼드체 처리
  const boldResult = parseBold(text);
  if (boldResult) return boldResult;

  // 이탤릭체 처리
  const italicResult = parseItalic(text);
  if (italicResult) return italicResult;

  // 일반 텍스트
  if (text.trim()) {
    return {
      type: 'text',
      value: text,
    };
  }

  return null;
};

export const parseMarkdown = (text: string): string => {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';
  let listStack: { level: number; count: number }[] = [];
  let currentLevel = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
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
        html += `<p>${line}</p>`;
      }
    }
  }

  // 남은 리스트 태그 닫기
  if (listStack.length > 0) {
    html += '</li>';
    while (listStack.length > 0) {
      html += '</ol>';
      listStack.pop();
    }
  }

  return html;
};
