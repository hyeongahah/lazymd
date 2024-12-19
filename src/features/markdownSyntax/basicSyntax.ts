import { unified } from 'unified';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import { BasicNode } from '@/types/markdown';
import { parseHeaders } from './01basicSyntax/01-06Headers';
import { parseUnorderedList } from './01basicSyntax/07UnorderedList';
import { parseOrderedList } from './01basicSyntax/08OrderedList';
import { parseTaskList } from './01basicSyntax/09TaskList';
import { parseInlineStyles } from '@/utils/parseUtils';

export const basicSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(() => (tree: BasicNode) => {
      const blocks = content.split('\n\n');

      return {
        type: 'root',
        children: blocks.map((block) => {
          const trimmedBlock = block.trim();

          // 라우팅만 담당
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
