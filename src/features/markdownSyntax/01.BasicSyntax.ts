import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { BasicNode, RehypeOptions, ElementNode } from '@/types/markdown';

export const basicSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      handlers: {
        paragraph: (handler: Handler, node: BasicNode): ElementNode => ({
          type: 'element',
          tagName: 'p',
          properties: {
            className: ['paragraph'],
          },
          children: node.children as ElementNode[],
        }),
        heading: (handler: Handler, node: BasicNode): ElementNode => ({
          type: 'element',
          tagName: `h${node.depth}`,
          properties: {
            className: [`heading-${node.depth}`],
          },
          children: node.children as ElementNode[],
        }),
      },
    } as RehypeOptions<BasicNode>)
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
