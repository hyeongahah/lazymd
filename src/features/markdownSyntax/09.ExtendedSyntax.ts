import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Handler } from 'mdast-util-to-hast';
import { ExtendedNode, RehypeOptions } from '@/types/markdown';

export const extendedSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 30-31. Autolinks (Email and URL)
          autolink: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'a',
            properties: {
              href: node.url,
              className: ['md-autolink'],
            },
            children: [{ type: 'text', value: node.url || '' }],
          }),

          // 32. Inline Math
          math: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['math', 'inline'],
            },
            children: [{ type: 'text', value: node.value || '' }],
          }),

          // 33. Block Math
          mathBlock: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['math', 'display'],
            },
            children: [{ type: 'text', value: node.value || '' }],
          }),

          // 34. Highlighted Text
          mark: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'mark',
            properties: {
              className: ['md-highlight'],
            },
            children: node.children,
          }),

          // 35. Footnote
          footnote: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'sup',
            properties: {
              className: ['md-footnote'],
              id: `footnote-${node.identifier}`,
            },
            children: node.children,
          }),

          // 36-39. Extended Features (Definition List, Named Anchor, Mermaid.js, Graphviz)
          definition: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'dl',
            properties: {
              className: ['md-definition'],
            },
            children: node.children,
          }),
        },
      } as RehypeOptions<ExtendedNode>
    )
    .use(rehypeKatex)
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
