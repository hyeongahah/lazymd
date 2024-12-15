import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import {
  MiscNode,
  RehypeOptions,
  HtmlNode,
  ListItemNode,
} from '@/types/markdown';
import { visit } from 'unist-util-visit';

interface DetailNode extends HtmlNode {
  value: string;
}

export const miscellaneousFeatures = async (
  content: string
): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree) => {
      // 44. Details 태그 처리
      visit(tree, 'html', (node: DetailNode) => {
        if (node.value.startsWith('<details')) {
          node.value = node.value.replace(
            /<details>([\s\S]*?)<\/details>/g,
            (_, content) => `
              <details class="md-details">
                ${content}
              </details>
            `
          );
        }
      });
      return tree;
    })
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 40-42. Checkboxes and To-Do Lists
          listItem: (handler: Handler, node: MiscNode) => ({
            type: 'element',
            tagName: 'li',
            properties: {
              className: [node.checked !== undefined ? 'task-list-item' : ''],
            },
            children: [
              node.checked !== undefined
                ? {
                    type: 'element',
                    tagName: 'input',
                    properties: {
                      type: 'checkbox',
                      checked: node.checked,
                      disabled: true,
                    },
                    children: [],
                  }
                : null,
              ...(node.children || []),
            ].filter(Boolean),
          }),

          // 43. Highlighted Code Block
          code: (handler: Handler, node: MiscNode) => ({
            type: 'element',
            tagName: 'pre',
            properties: {
              className: ['highlighted-code'],
            },
            children: [
              {
                type: 'element',
                tagName: 'code',
                properties: {
                  className: [`language-${node.lang || 'text'}`],
                },
                children: [{ type: 'text', value: node.value || '' }],
              },
            ],
          }),

          // 44-47. HTML Elements
          html: (handler: Handler, node: MiscNode) => {
            let html = node.value || '';

            // 45. Mark 태그
            html = html.replace(
              /<mark>(.*?)<\/mark>/g,
              '<mark class="md-highlight">$1</mark>'
            );

            // 46. Inline Style
            html = html.replace(
              /style="([^"]*)"/g,
              (_, styles) => `style="${styles}" class="md-styled"`
            );

            // 47. Custom CSS
            if (html.includes('class="')) {
              html = html.replace(
                /class="([^"]*)"/g,
                (_, classes) => `class="${classes} md-custom"`
              );
            }

            return {
              type: 'element',
              tagName: 'div',
              properties: {
                className: ['html-content'],
                dangerouslySetInnerHTML: { __html: html },
              },
              children: [],
            };
          },
        },
      } as RehypeOptions<MiscNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
