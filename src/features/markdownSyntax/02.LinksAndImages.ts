import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import {
  LinkNode,
  ImageNode,
  ReferenceNode,
  RehypeOptions,
} from '@/types/markdown';
import { visit } from 'unist-util-visit';

interface ReferenceMap extends Map<string, ReferenceNode> {
  get(key: string): ReferenceNode | undefined;
}

export const linksAndImages = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree) => {
      const references: ReferenceMap = new Map();

      // 먼저 모든 참조 정의를 수집
      visit(tree, 'definition', (node: ReferenceNode) => {
        references.set(node.identifier, {
          type: 'definition',
          url: node.url,
          title: node.title,
          identifier: node.identifier,
        });
      });

      // 참조 링크와 이미지 처리
      visit(
        tree,
        ['linkReference', 'imageReference'],
        (node: LinkNode | ImageNode) => {
          const reference = references.get(node.identifier || '');
          if (reference) {
            node.type = node.type === 'linkReference' ? 'link' : 'image';
            node.url = reference.url;
            node.title = reference.title;
          }
        }
      );

      return tree;
    })
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
