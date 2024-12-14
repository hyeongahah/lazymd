import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { LinkNode, ImageNode, RehypeOptions } from '@/types/markdown';

export const linksAndImages = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 14-16. Links (Inline, Reference, URL)
          link: (handler: Handler, node: LinkNode) => ({
            type: 'element',
            tagName: 'a',
            properties: {
              href: node.url,
              title: node.title,
              className: ['md-link'],
              target: node.url?.startsWith('http') ? '_blank' : undefined,
              rel: node.url?.startsWith('http')
                ? 'noopener noreferrer'
                : undefined,
            },
            children: node.children,
          }),

          // 17-18. Images (Inline, Reference)
          image: (handler: Handler, node: ImageNode) => ({
            type: 'element',
            tagName: 'img',
            properties: {
              src: node.url,
              alt: node.alt,
              title: node.title,
              className: ['md-image'],
              loading: 'lazy',
            },
            children: [],
          }),
        },
      } as RehypeOptions<LinkNode | ImageNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
