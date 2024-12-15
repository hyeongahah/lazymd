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
          paragraph: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: 'p',
            properties: {
              className: ['paragraph'],
            },
            children: node.children,
          }),
          heading: (handler: Handler, node: BasicNode) => ({
            type: 'element',
            tagName: `h${node.depth}`,
            properties: {
              className: [`heading-${node.depth}`],
            },
            children: node.children,
          }),
        },
      } as RehypeOptions<BasicNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
