import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkMermaid from 'remark-mermaid';

export const extendedSyntax = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkMermaid)
    .use(() => (tree: Node) => {
      // 30-31. Autolinks
      visit(tree, 'text', (node: Node) => {
        if (node.value) {
          // 이메일 자동 링크
          node.value = node.value.replace(
            /<([^@>]+@[^>]+)>/g,
            (_, email) => `<a href="mailto:${email}">${email}</a>`
          );
          // URL 자동 링크
          node.value = node.value.replace(
            /<(https?:\/\/[^>]+)>/g,
            (_, url) => `<a href="${url}">${url}</a>`
          );
        }
      });

      // 34. Highlighted Text
      visit(tree, 'text', (node: Node) => {
        if (node.value) {
          node.value = node.value.replace(/==([^=]+)==/g, '<mark>$1</mark>');
        }
      });

      return tree;
    })
    .use(remarkRehype, {
      allowDangerousHtml: true,
      handlers: {
        // 32. Inline Math
        math: (h: any, node: Node) => ({
          type: 'element',
          tagName: 'span',
          properties: { className: ['math', 'inline'] },
          children: [{ type: 'text', value: node.value || '' }],
        }),

        // 33. Block Math
        mathBlock: (h: any, node: Node) => ({
          type: 'element',
          tagName: 'div',
          properties: { className: ['math', 'display'] },
          children: [{ type: 'text', value: node.value || '' }],
        }),

        // 35. Footnote
        footnote: (h: any, node: Node) => ({
          type: 'element',
          tagName: 'sup',
          properties: { className: ['footnote'] },
          children: node.children,
        }),

        // 36. Definition List
        definition: (h: any, node: Node) => ({
          type: 'element',
          tagName: 'dl',
          properties: { className: ['definition'] },
          children: node.children,
        }),

        // 37. Named Anchor
        anchor: (h: any, node: Node) => ({
          type: 'element',
          tagName: 'a',
          properties: {
            id: node.identifier,
            className: ['anchor'],
          },
          children: node.children,
        }),

        // 38. Mermaid.js Diagram
        mermaid: (h: any, node: Node) => ({
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['mermaid'],
          },
          children: [{ type: 'text', value: node.value || '' }],
        }),

        // 39. Graphviz Chart
        graphviz: (h: any, node: Node) => ({
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['graphviz'],
          },
          children: [{ type: 'text', value: node.value || '' }],
        }),
      },
    })
    .use(rehypeKatex)
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};

const visit = (
  tree: Node,
  type: string,
  visitor: (node: Node) => void
): void => {
  const nodes: Node[] = [tree];
  while (nodes.length) {
    const node = nodes.shift();
    if (node && node.type === type) {
      visitor(node);
    }
    if (node && node.children) {
      nodes.push(...node.children);
    }
  }
};
