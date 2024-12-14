import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import { Handler } from 'mdast-util-to-hast';
import { YamlNode, RehypeOptions } from '@/types/markdown';

interface ProcessedResult {
  html: string;
  metadata?: Record<string, unknown>;
}

export const yamlMetadata = async (
  content: string
): Promise<ProcessedResult> => {
  let extractedMetadata: Record<string, unknown> | undefined;

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(
      remarkRehype as any,
      {
        allowDangerousHtml: true,
        handlers: {
          // 51. YAML Frontmatter
          // 52. Frontmatter Metadata Parsing
          yaml: (handler: Handler, node: YamlNode) => {
            try {
              extractedMetadata = JSON.parse(node.value);
            } catch (error) {
              console.error('YAML parsing error:', error);
            }
            return {
              type: 'element',
              tagName: 'div',
              properties: {
                className: ['yaml-metadata'],
                style: 'display: none;',
              },
              children: [{ type: 'text', value: node.value }],
            };
          },
        },
      } as RehypeOptions<YamlNode>
    )
    .use(rehypeStringify);

  const result = await processor.process(content);

  return {
    html: result.toString(),
    metadata: extractedMetadata,
  };
};
