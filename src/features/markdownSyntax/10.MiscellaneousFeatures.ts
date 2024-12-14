import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { MiscNode, RehypeOptions } from '@/types/markdown';

export const miscellaneousFeatures = async (
  content: string
): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 40. Completed Checkbox
          // 41. Incomplete Checkbox
          // 42. To-Do List
          listItem: (handler: Handler, node: MiscNode) => ({
            type: 'element',
            tagName: 'li',
            properties: {
              className: [node.checked !== undefined ? 'task-list-item' : ''],
            },
            children: [
              node.checked !== undefined
                ? {
                    type: 'element',
                    tagName: 'input',
                    properties: {
                      type: 'checkbox',
                      checked: node.checked,
                      disabled: true,
                    },
                    children: [],
                  }
                : null,
              ...(node.children || []),
            ].filter(Boolean),
          }),

          // 43. Highlighted Code Block
          code: (handler: Handler, node: MiscNode) => ({
            type: 'element',
            tagName: 'pre',
            properties: {
              className: ['highlighted-code'],
            },
            children: [
              {
                type: 'element',
                tagName: 'code',
                properties: {},
                children: [{ type: 'text', value: node.value || '' }],
              },
            ],
          }),

          // 44-47. HTML Elements (details, mark, inline style, custom CSS)
          html: (handler: Handler, node: MiscNode) => ({
            type: 'raw',
            value: node.value || '',
          }),
        },
      } as RehypeOptions<MiscNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
