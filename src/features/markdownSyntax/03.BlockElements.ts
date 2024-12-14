import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { BasicNode, RehypeOptions } from '@/types/markdown';

export const blockElements = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 19-20. Blockquotes (Single Level and Nested)
          blockquote: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: 'blockquote',
            properties: {
              className: ['md-blockquote'],
            },
            children: node.children?.map((child) => {
              if (child.type === 'blockquote') {
                return {
                  ...child,
                  properties: {
                    ...child.properties,
                    className: ['md-blockquote-nested'],
                  },
                };
              }
              return child;
            }),
          }),
        },
      } as RehypeOptions<BasicNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
