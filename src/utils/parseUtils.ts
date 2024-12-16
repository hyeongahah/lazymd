import { parseBold } from '@/features/markdownSyntax/01basicSyntax/10Bold';
import { parseItalic } from '@/features/markdownSyntax/01basicSyntax/11Italic';

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
