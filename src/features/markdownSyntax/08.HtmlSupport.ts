import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { HtmlNode, RehypeOptions } from '@/types/markdown';

export const htmlSupport = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 28. HTML Tags
          // 29. HTML Comments
          html: (handler: Handler, node: HtmlNode) => {
            const sanitizedHtml = node.value.replace(
              /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
              ''
            );

            return {
              type: 'raw',
              value: sanitizedHtml,
            };
          },
        },
      } as RehypeOptions<HtmlNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
