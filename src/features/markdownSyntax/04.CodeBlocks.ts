import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import { Handler } from 'mdast-util-to-hast';
import { CodeNode, RehypeOptions } from '@/types/markdown';

export const codeBlocks = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 21. Fenced Code Block
          // 22. Language-Specific Code Block
          code: (handler: Handler, node: CodeNode) => {
            const codeContent = node.value || '';
            const language = node.lang || 'text';
            let highlightedCode;

            try {
              if (language && Prism.languages[language]) {
                highlightedCode = Prism.highlight(
                  codeContent,
                  Prism.languages[language],
                  language
                );
              } else {
                highlightedCode = codeContent;
              }
            } catch (error) {
              highlightedCode = codeContent;
            }

            return {
              type: 'element',
              tagName: 'pre',
              properties: {
                className: [`language-${language}`, 'md-code-block'],
              },
              children: [
                {
                  type: 'element',
                  tagName: 'code',
                  properties: {
                    className: [`language-${language}`],
                  },
                  children: [{ type: 'text', value: highlightedCode }],
                },
              ],
            };
          },
        },
      } as RehypeOptions<CodeNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
