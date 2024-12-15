import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { HtmlNode, RehypeOptions } from '@/types/markdown';
import { sanitizeHtml } from '@/utils/sanitize';
import { visit } from 'unist-util-visit';

interface HtmlComment extends HtmlNode {
  value: string;
}

export const htmlSupport = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree) => {
      // 29. HTML Comments
      visit(tree, 'html', (node: HtmlComment) => {
        if (node.value.startsWith('<!--') && node.value.endsWith('-->')) {
          node.value = `<span class="html-comment">${node.value}</span>`;
        }
      });
      return tree;
    })
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 28. HTML Tags
          html: (handler: Handler, node: HtmlNode) => {
            const sanitizedHtml = sanitizeHtml(node.value);

            return {
              type: 'element',
              tagName: 'div',
              properties: {
                className: ['html-content'],
                dangerouslySetInnerHTML: { __html: sanitizedHtml },
              },
              children: [],
            };
          },
        },
      } as RehypeOptions<HtmlNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
