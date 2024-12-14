import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { ExtendedNode, RehypeOptions } from '@/types/markdown';

export const renderingExtensions = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 53-54. Component Rendering
          component: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['md-component'],
              'data-component': node.value,
              'data-props': JSON.stringify(node.data?.props || {}),
            },
            children: node.children,
          }),

          // 55-57. Plugin Extensions
          plugin: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['md-plugin'],
              'data-plugin': node.value,
              'data-options': JSON.stringify(node.data?.options || {}),
            },
            children: node.children,
          }),

          // 58-60. Custom Extensions
          custom: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: node.data?.tagName || 'div',
            properties: {
              className: ['md-custom'],
              ...node.data?.properties,
            },
            children: node.children,
          }),
        },
      } as RehypeOptions<ExtendedNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
