import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { visit } from 'unist-util-visit';
import { Handler } from 'mdast-util-to-hast';
import {
  ExtendedNode,
  RehypeOptions,
  TextNode,
  CodeNode,
} from '@/types/markdown';
import mermaid from 'mermaid';
import { Viz } from '@viz-js/viz';

interface ExtendedTextNode extends TextNode {
  value: string;
}

interface FootnoteNode extends ExtendedNode {
  identifier: string;
  label?: string;
}

interface DefinitionNode extends ExtendedNode {
  term: string;
  definition: string;
}

export const extendedSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(() => (tree) => {
      visit(tree, 'text', (node: ExtendedTextNode) => {
        if (node.value) {
          // 이메일 자동 링크
          node.value = node.value.replace(
            /<([^@>]+@[^>]+)>/g,
            (_, email) =>
              `<a href="mailto:${email}" class="autolink">${email}</a>`
          );
          // URL 자동 링크
          node.value = node.value.replace(
            /<(https?:\/\/[^>]+)>/g,
            (_, url) =>
              `<a href="${url}" class="autolink" target="_blank" rel="noopener noreferrer">${url}</a>`
          );
        }
      });
      return tree;
    })
    .use(() => (tree) => {
      visit(tree, 'text', (node: ExtendedTextNode) => {
        if (node.value) {
          node.value = node.value.replace(
            /==(.*?)==/g,
            '<mark class="highlighted-text">$1</mark>'
          );
        }
      });
      return tree;
    })
    .use(() => (tree) => {
      visit(tree, 'code', (node: ExtendedNode) => {
        if (node.lang === 'mermaid') {
          node.type = 'element';
          node.tagName = 'div';
          node.properties = {
            className: ['mermaid'],
            'data-diagram': node.value,
            'data-processed': 'false',
          };
          node.children = [];
        }
        if (node.lang === 'graphviz') {
          node.type = 'element';
          node.tagName = 'div';
          node.properties = {
            className: ['graphviz'],
            'data-dot': node.value,
            'data-processed': 'false',
          };
          node.children = [];
        }
      });
      return tree;
    })
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 32. Inline Math
          math: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['math', 'math-inline'],
              'data-katex': node.value,
              'data-display': 'inline',
            },
            children: [{ type: 'text', value: node.value || '' }],
          }),

          // 33. Block Math
          mathBlock: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['math', 'math-display'],
              'data-katex': node.value,
              'data-display': 'block',
            },
            children: [{ type: 'text', value: node.value || '' }],
          }),

          // 35. Footnote
          footnote: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'sup',
            properties: { className: ['footnote'] },
            children: node.children,
          }),

          // 36. Definition List
          definition: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'dl',
            properties: { className: ['definition'] },
            children: node.children,
          }),

          // 37. Named Anchor
          anchor: (
            handler: Handler,
            node: ExtendedNode & { identifier: string }
          ) => ({
            type: 'element',
            tagName: 'a',
            properties: {
              id: node.identifier,
              className: ['anchor'],
            },
            children: node.children,
          }),

          // 38. Mermaid.js Diagram
          mermaid: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['mermaid'],
              'data-diagram': node.value,
            },
            children: [{ type: 'text', value: node.value || '' }],
          }),

          // 39. Graphviz Chart
          graphviz: (handler: Handler, node: ExtendedNode) => ({
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['graphviz'],
              'data-dot': node.value,
            },
            children: [{ type: 'text', value: node.value || '' }],
          }),
        },
      } as RehypeOptions<ExtendedNode>
    )
    .use(rehypeKatex)
    .use(rehypeStringify)
    .use(() => (tree) => {
      // 35. Footnotes
      const footnotes = new Map<string, string>();

      visit(tree, 'footnoteDefinition', (node: FootnoteNode) => {
        footnotes.set(node.identifier, node.label || '');
      });

      visit(tree, 'footnoteReference', (node: FootnoteNode) => {
        const footnoteText = footnotes.get(node.identifier);
        if (footnoteText) {
          node.type = 'element';
          node.tagName = 'sup';
          node.properties = {
            className: ['footnote'],
            id: `footnote-ref-${node.identifier}`,
          };
          node.children = [{ type: 'text', value: `[${footnoteText}]` }];
        }
      });

      // 36. Definition Lists
      visit(tree, 'definition', (node: DefinitionNode) => {
        node.type = 'element';
        node.tagName = 'dl';
        node.properties = { className: ['definition-list'] };
        node.children = [
          {
            type: 'element',
            tagName: 'dt',
            children: [{ type: 'text', value: node.term }],
          },
          {
            type: 'element',
            tagName: 'dd',
            children: [{ type: 'text', value: node.definition }],
          },
        ];
      });

      // 37. Named Anchors
      visit(tree, 'heading', (node: ExtendedNode) => {
        const id = node.children?.[0]?.value
          ?.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

        if (id) {
          node.properties = {
            ...node.properties,
            id,
            className: ['anchor-heading'],
          };
        }
      });

      return tree;
    })
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
