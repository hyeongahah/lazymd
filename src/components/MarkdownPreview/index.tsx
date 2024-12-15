import { useMarkdown } from '@/hooks/useMarkdown';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import katex from 'katex';
import mermaid from 'mermaid';
import * as Viz from '@viz-js/viz';
import { basicSyntax } from '@/features/markdownSyntax/01.BasicSyntax';
import { linksAndImages } from '@/features/markdownSyntax/02.LinksAndImages';
import { blockElements } from '@/features/markdownSyntax/03.BlockElements';
import { codeBlocks } from '@/features/markdownSyntax/04.CodeBlocks';
import { horizontalRules } from '@/features/markdownSyntax/05.HorizontalRules';
import { markdownTable } from '@/features/markdownSyntax/06.Tables';
import { escapeCharacters } from '@/features/markdownSyntax/07.EscapeCharacters';
import { htmlSupport } from '@/features/markdownSyntax/08.HtmlSupport';
import { extendedSyntax } from '@/features/markdownSyntax/09.ExtendedSyntax';
import { miscellaneousFeatures } from '@/features/markdownSyntax/10.MiscellaneousFeatures';
import { dynamicFeatures } from '@/features/markdownSyntax/11.DynamicFeatures';
import { yamlMetadata } from '@/features/markdownSyntax/12.YamlMetadata';
import { renderingExtensions } from '@/features/markdownSyntax/13.RenderingExtensions';

export function MarkdownPreview() {
  const { markdownText } = useMarkdown();
  const [html, setHtml] = useState('');

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        const parsedBasic = await basicSyntax(markdownText);
        const parsedLinks = await linksAndImages(parsedBasic);
        const parsedBlocks = await blockElements(parsedLinks);
        const parsedCode = await codeBlocks(parsedBlocks);
        const parsedHr = await horizontalRules(parsedCode);
        const parsedTables = await markdownTable(parsedHr);
        const parsedEscape = await escapeCharacters(parsedTables);
        const parsedHtml = await htmlSupport(parsedEscape);
        const parsedExtended = await extendedSyntax(parsedHtml);
        const parsedMisc = await miscellaneousFeatures(parsedExtended);
        const parsedDynamic = await dynamicFeatures(parsedMisc);
        const { html: parsedYaml } = await yamlMetadata(parsedDynamic);
        const finalHtml = await renderingExtensions(parsedYaml);
        setHtml(finalHtml);
      } catch (error) {
        console.error('Markdown rendering error:', error);
        setHtml('<p>Error rendering markdown</p>');
      }
    };
    renderMarkdown();
  }, [markdownText]);

  useEffect(() => {
    // KaTeX 수식 렌더링
    const renderMath = () => {
      const mathElements = document.querySelectorAll('[data-katex]');
      mathElements.forEach((element) => {
        const tex = element.getAttribute('data-katex') || '';
        const display = element.getAttribute('data-display') === 'block';
        katex.render(tex, element as HTMLElement, {
          displayMode: display,
          throwOnError: false,
        });
      });
    };

    renderMath();
  }, [html]);

  useEffect(() => {
    // Mermaid 초기화
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
    });

    // Mermaid 다이어그램 렌더링
    const renderMermaid = async () => {
      const elements = document.querySelectorAll(
        '.mermaid[data-processed="false"]'
      );
      elements.forEach(async (element) => {
        const diagram = element.getAttribute('data-diagram');
        if (diagram) {
          try {
            const result = await mermaid.render('mermaid-diagram', diagram);
            const svg = typeof result === 'string' ? result : result.svg;
            element.innerHTML = svg;
            element.setAttribute('data-processed', 'true');
          } catch (error) {
            console.error('Mermaid rendering error:', error);
          }
        }
      });
    };

    // Graphviz 차트 렌더링
    const renderGraphviz = async () => {
      const viz = await Viz.instance();
      const elements = document.querySelectorAll(
        '.graphviz[data-processed="false"]'
      );
      elements.forEach(async (element) => {
        const dot = element.getAttribute('data-dot');
        if (dot) {
          try {
            const result = await viz.render(dot);
            const svg = result.toString();
            element.innerHTML = svg;
            element.setAttribute('data-processed', 'true');
          } catch (error) {
            console.error('Graphviz rendering error:', error);
          }
        }
      });
    };

    renderMermaid();
    renderGraphviz();
  }, [html]);

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
