import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { Handler } from 'mdast-util-to-hast';
import { DynamicNode, RehypeOptions } from '@/types/markdown';

export const dynamicFeatures = async (content: string): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 48. Dynamic Data Injection Support
          // 49. Rendered Dynamic Highlights
          // 50. Renderer-Supported Calculations
          text: (handler: Handler, node: DynamicNode) => {
            let processedText = node.value || '';

            processedText = processedText.replace(
              /\{\{([^}]+)\}\}/g,
              (_, key) => `<span class="dynamic-data" data-key="${key}"></span>`
            );

            processedText = processedText.replace(
              /==(.*?)==/g,
              '<mark class="dynamic-highlight">$1</mark>'
            );

            processedText = processedText.replace(
              /\{\{calc:(.*?)\}\}/g,
              '<span class="dynamic-calc" data-expr="$1"></span>'
            );

            return {
              type: 'raw',
              value: processedText,
            };
          },
        },
      } as RehypeOptions<DynamicNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
};
