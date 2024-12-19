/**
 * 마크다운 변환 관련 유틸리티 함수들을 모아둔 모듈
 * @module markdownUtils
 */

import { marked } from 'marked';
import { sanitizeHtml } from './sanitize';
import { parseMarkdown } from './parseUtils';

/**
 * 마크다운 파서 설정 옵션
 * @constant {Object}
 */
const markedOptions = {
  gfm: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: true,
  xhtml: true,
};

/**
 * 마크다운 텍스트를 HTML로 변환
 * @param {string} markdown - 변환할 마크다운 텍스트
 * @returns {string} 변환된 HTML 문자열
 */
export async function convertMarkdownToHtml(markdown: string): Promise<string> {
  try {
    const html = await marked(markdown, markedOptions);
    return sanitizeHtml(html);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return '';
  }
}

/**
 * 마크다운 텍스트에서 헤더 추출
 * @param {string} markdown - 마크다운 텍스트
 * @returns {Array<{level: number, text: string, id: string}>} 헤더 정보 배열
 */
export const extractHeaders = (
  markdown: string
): Array<{ level: number; text: string; id: string }> => {
  const headers: Array<{ level: number; text: string; id: string }> = [];
  const lines = markdown.split('\n');

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      headers.push({ level, text, id });
    }
  });

  return headers;
};

/**
 * 마크다운 텍스트에서 체크박스 상태 토글
 * @param {string} markdown - 마크다운 텍스트
 * @param {number} lineIndex - 토글할 체크박스가 있는 줄 번호
 * @returns {string} 체크박스 상태가 토글된 마크다운 텍스트
 */
export const toggleCheckbox = (markdown: string, lineIndex: number): string => {
  const lines = markdown.split('\n');
  const line = lines[lineIndex];

  if (line && line.match(/^(\s*)-\s+\[([ x])\]/)) {
    lines[lineIndex] = line.replace(
      /^(\s*-\s+\[)([ x])(\].*)$/,
      (_, start, check, end) => `${start}${check === ' ' ? 'x' : ' '}${end}`
    );
  }

  return lines.join('\n');
};

/**
 * 에디터와 프리뷰의 스크롤을 동기화
 * textarea의 스크롤 위치에 따라 프리뷰와 라인 넘버의 스크롤 위치를 조정
 * @param {HTMLTextAreaElement} textarea - 마크다운 에디터 요소
 * @param {HTMLElement} preview - 프리뷰 요소
 * @param {HTMLElement} lineNumbers - 라인 넘버 요소
 */
export const syncScroll = (
  textarea: HTMLTextAreaElement,
  preview: HTMLElement,
  lineNumbers: HTMLElement
) => {
  lineNumbers.scrollTop = textarea.scrollTop;

  const scrollRatio =
    textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
  preview.scrollTop =
    scrollRatio * (preview.scrollHeight - preview.clientHeight);
};
