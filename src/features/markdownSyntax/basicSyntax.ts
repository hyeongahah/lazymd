import { unified } from 'unified';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import { BasicNode, ElementNode, TextNode } from '@/types/markdown';
import { parseHeaders } from './01basicSyntax/01-06Headers';
import { parseUnorderedList } from './01basicSyntax/07UnorderedList';
import { parseOrderedList } from './01basicSyntax/08OrderedList';
import { parseTaskList } from './01basicSyntax/09TaskList';
import { parseInlineStyles } from '@/utils/parseUtils';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';

// 코드 블록 파싱 함수
const parseCodeBlock = (content: string): ElementNode => {
  // 언어 식별자와 코드 내용을 분리하는 정규식
  const match = content.match(/^```(\w+)?\n([\s\S]*?)\n```$/);
  if (!match)
    return {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{ type: 'text', value: content }],
    };

  const [, language = '', code] = match;
  let highlightedCode = code.trim(); // 앞뒤 공백 제거

  // 언어가 지정되어 있고 Prism이 해당 언어를 지원하는 경우 구문 강조 적용
  if (language && Prism.languages[language]) {
    try {
      highlightedCode = Prism.highlight(
        highlightedCode,
        Prism.languages[language],
        language
      );
    } catch (error) {
      console.error('Syntax highlighting failed:', error);
    }
  }

  return {
    type: 'element',
    tagName: 'pre',
    properties: {},
    children: [
      {
        type: 'element',
        tagName: 'code',
        properties: {
          className: language ? [`language-${language}`] : [],
        },
        children: [{ type: 'text', value: highlightedCode }],
      },
    ],
  };
};

export const basicSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(() => (tree: BasicNode) => {
      const blocks = content.split('\n\n');

      return {
        type: 'root',
        children: blocks.map((block) => {
          const trimmedBlock = block.trim();

          // 코드 블록 처리
          if (trimmedBlock.startsWith('```')) {
            return parseCodeBlock(trimmedBlock);
          }

          // 기존 라우팅 로직
          if (/^#{1,6}\s/.test(trimmedBlock)) return parseHeaders(trimmedBlock);
          if (/^[-*+]\s+\[[ x]?\]/.test(trimmedBlock))
            return parseTaskList(trimmedBlock);
          if (/^\d+\.\s+/.test(trimmedBlock))
            return parseOrderedList(trimmedBlock);
          if (/^[-*+]\s+/.test(trimmedBlock))
            return parseUnorderedList(trimmedBlock);

          // 기본 문단 처리 + 인라인 스타일 처리
          return {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: trimmedBlock
              .split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/)
              .map(parseInlineStyles)
              .filter(Boolean),
          };
        }),
      };
    })
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
