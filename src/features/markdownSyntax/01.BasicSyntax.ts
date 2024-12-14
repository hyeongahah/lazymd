import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { BasicNode, RehypeOptions } from '@/types/markdown';

export const basicSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 1-6. Headers (h1 to h6)
          heading: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: `h${node.depth}`,
            properties: {
              className: [`heading-${node.depth}`],
            },
            children: node.children,
          }),

          // 7-8. Lists (unordered and ordered)
          list: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: node.ordered ? 'ol' : 'ul',
            properties: {
              className: [node.ordered ? 'ordered-list' : 'unordered-list'],
            },
            children: node.children,
          }),

          // 9. Task Lists
          listItem: (handler: Handler, node: BasicNode) => ({
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

          // 10. Bold
          strong: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: 'strong',
            properties: {
              className: ['bold'],
            },
            children: node.children,
          }),

          // 11. Italic
          emphasis: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: 'em',
            properties: {
              className: ['italic'],
            },
            children: node.children,
          }),

          // 12. Strikethrough
          delete: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: 's',
            properties: {
              className: ['strikethrough'],
            },
            children: node.children,
          }),

          // 13. Inline Code
          inlineCode: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: 'code',
            properties: {
              className: ['inline-code'],
            },
            children: [{ type: 'text', value: node.value || '' }],
          }),
        },
      } as RehypeOptions<BasicNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
