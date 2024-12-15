import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { EscapeNode, RehypeOptions } from '@/types/markdown';

export const escapeCharacters = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          text: (handler: Handler, node: EscapeNode) => {
            const escapedContent = node.value.replace(
              /\\([\\`*{}[\]()#+\-.!_>])/g,
              (_, char) =>
                `<span class="escaped-char" data-original="${char}">${char}</span>`
            );
            return {
              type: 'raw',
              value: escapedContent,
            };
          },
        },
      } as RehypeOptions<EscapeNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
