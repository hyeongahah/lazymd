import { useMarkdown } from '@/hooks/useMarkdown';
import { useEffect, useState } from 'react';
import markdownit from 'markdown-it';
import styles from './styles.module.css';

export function MarkdownPreview() {
  const { text } = useMarkdown();
  const [html, setHtml] = useState('');
  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true, // 줄바꿈 지원
  });

  useEffect(() => {
    const processedText = text.replace(/\n\n/g, '\n&nbsp;\n');
    const rendered = md.render(processedText);

    const htmlWithEmptyLines = rendered.replace(
      /<p>&nbsp;<\/p>/g,
      '<p class="empty-line">&nbsp;</p>'
    );

    setHtml(htmlWithEmptyLines);
  }, [text]);

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
