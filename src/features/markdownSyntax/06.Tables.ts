import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { TableNode, RehypeOptions } from '@/types/markdown';

export const markdownTable = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          table: (handler: Handler, node: TableNode) => ({
            type: 'element',
            tagName: 'table',
            properties: {
              className: ['md-table'],
            },
            children: node.children,
          }),

          tableRow: (handler: Handler, node: TableNode) => ({
            type: 'element',
            tagName: 'tr',
            properties: {
              className: ['md-table-row'],
              'data-row-type': node.isHeader ? 'header' : 'data',
            },
            children: node.children,
          }),

          tableCell: (handler: Handler, node: TableNode) => ({
            type: 'element',
            tagName: node.isHeader ? 'th' : 'td',
            properties: {
              className: ['md-table-cell'],
              style: node.align ? `text-align:${node.align}` : undefined,
              'data-align': node.align || 'left',
            },
            children: node.children,
          }),
        },
      } as RehypeOptions<TableNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
