import { parseBold } from '@/features/markdownSyntax/01basicSyntax/10Bold';
import { parseItalic } from '@/features/markdownSyntax/01basicSyntax/11Italic';
import { getOrderedListMarker } from '@/utils/listUtils';
import { convertMarkdownToHtml } from '@/utils/markdownUtils';

// 인라인 마크다운 스타일을 HTML로 변환하는 함수
// 볼드체, 이탤릭체, 취소선, 인라인 코드, 하이라이트, 링크 등을 처리
export const parseInlineStyles = (text: string): string => {
  // 볼드체와 이탤릭체가 함께 있는 경우
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // 볼드체
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 이탤릭체
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 취소선
  text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // 인라인 코드
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');

  // 하이라이트 (== 문법)
  while (text.includes('==')) {
    text = text.replace(/==([^=]*?)==/g, '<mark>$1</mark>');
  }

  // 인라인 링크 ([text](url) 형식)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // URL 링크 (<url> 형식)
  text = text.replace(/<(https?:\/\/[^\s>]+)>/g, '<a href="$1">$1</a>');

  return text;
};

// 마크다운 텍스트를 HTML로 변환하는 메인 함수
// 단락, 헤더, 체크리스트, 순서/비순서 리스트, 인용문 등을 처리
export const parseMarkdown = async (text: string): Promise<string> => {
  if (!text) return '';

  // 텍스트를 빈 줄로 구분된 단락들로 나눔 (두 번 이상의 줄바���으로 구분)
  const paragraphs = text.split(/\n\n+/);
  let html = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    // 마크다운 문법: 연속된 공백은 하나로, 단일 줄바꿈은 공백으로 처리
    const processedParagraph = paragraph
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .replace(/\n/g, ' ') // 줄바꿈을 공백으로
      .trim();

    const lines = paragraph.split('\n');
    let currentListStack: { level: number; count: number }[] = [];
    let currentLevel = -1;
    let hasSpecialBlock = false; // 특수 블록(헤더, 리스트, 인용문 등) 여부

    // 인용문 처리: > 로 시작하는 블록
    if (lines[0].startsWith('>')) {
      hasSpecialBlock = true;
      const quotedContent = lines
        .map((line) => {
          const level = (line.match(/^>+/)?.[0] || '').length;
          const content = line.replace(/^>+\s?/, '');
          return { level, content };
        })
        .reduce((acc, { level, content }) => {
          let html = content;
          for (let i = 0; i < level; i++) {
            html = `<blockquote>${html}</blockquote>`;
          }
          return acc + html + ' ';
        }, '');

      const parsedContent = await convertMarkdownToHtml(quotedContent.trim());
      html += parsedContent;
      continue;
    }

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];

      // 헤더 처리: # 으로 시작하는 라인
      const headerMatch = line.match(/^(#{1,6})\s(.+)$/);
      if (headerMatch) {
        hasSpecialBlock = true;
        const level = headerMatch[1].length;
        const content = parseInlineStyles(headerMatch[2].trim());
        html += `<h${level}>${content}</h${level}>`;
        continue;
      }

      // 체크리스트 처리: - [ ] 또는 - [x] 형식
      const checklistMatch = line.match(/^(\s*)[-*+]\s+\[([ x])\]\s*(.*)$/);
      if (checklistMatch) {
        hasSpecialBlock = true;
        const [, indent, checked, content] = checklistMatch;
        const isChecked = checked === 'x';

        if (!html.includes('<ul class="task-list">')) {
          html += '<ul class="task-list">';
        }

        html += `<li class="task-list-item"><input type="checkbox" ${
          isChecked ? 'checked' : ''
        } disabled>${parseInlineStyles(content)}</li>`;

        if (!lines[j + 1]?.match(/^(\s*)[-*+]\s+\[([ x])\]\s*(.*)$/)) {
          html += '</ul>';
        }
        continue;
      }

      // 순서 없는 리스트 처리: -, *, + 로 시작하는 라인
      const unorderedListMatch = line.match(/^(\s*)[-*+]\s+(?!\[[ x]\])(.*)$/);
      if (unorderedListMatch) {
        hasSpecialBlock = true;
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
          html = html.replace(/<\/li>$/, '');
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
          html = html.slice(0, -5);
        }

        html += `<li>${parseInlineStyles(text)}`;

        // 리스트 종료 처리
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

      // 순서 있는 리스트 처리: 숫자, 로마자, 알파벳으로 시작하는 라인
      const listMatch = line.match(
        /^(\s*)(?:(\d+)|([IVXivx]+)|([A-Za-z]))\.?\s(.*)$/
      );
      if (listMatch) {
        hasSpecialBlock = true;
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
        // 리스트가 아닌 경우, 열린 리스트 태그들을 모두 닫기
        while (currentListStack.length > 0) {
          html += '</li></ol>';
          currentListStack.pop();
        }
        currentLevel = -1;
      }
    }

    // 일반 텍스트 처리: 특수 블록이 없는 경우에만 처리
    if (!hasSpecialBlock && processedParagraph.trim()) {
      html += `<p>${parseInlineStyles(processedParagraph)}</p>`;
    }
  }

  return html;
};
