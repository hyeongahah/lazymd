import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { BasicNode, ElementNode } from '@/types/markdown';

export const basicSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      handlers: {
        paragraph: ((h, node: BasicNode) => ({
          type: 'element',
          tagName: 'p',
          properties: {
            className: ['paragraph'],
          },
          children: node.children as ElementNode[],
        })) as Handler,
        heading: ((h, node: BasicNode) => ({
          type: 'element',
          tagName: `h${node.depth}`,
          properties: {
            className: [`heading-${node.depth}`],
          },
          children: node.children as ElementNode[],
        })) as Handler,
      },
    })
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
