import { useMarkdown } from '@/hooks/useMarkdown';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { basicSyntax } from '@/features/markdownSyntax';

export function MarkdownPreview() {
  const { markdownText } = useMarkdown();
  const [html, setHtml] = useState('');

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        const content = await basicSyntax(markdownText);
        setHtml(content);
        /* 나중에 추가할 파서들
        const withLinks = await linksAndImages(content);
        const withBlocks = await blockElements(withLinks);
        const withCode = await codeBlocks(withBlocks);
        const withTables = await tables(withCode);
        const withMisc = await miscFeatures(withTables);
        const withAdvanced = await advancedFeatures(withMisc);
        const withOptional = await optionalEnhancements(withAdvanced);
        setHtml(withOptional);
        */
      } catch (error) {
        console.error('Markdown rendering error:', error);
        setHtml('<p>Error rendering markdown</p>');
      }
    };
    renderMarkdown();
  }, [markdownText]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewToolbar}>
        <span>미리보기</span>
      </div>
      <div
        className={styles.preview}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
