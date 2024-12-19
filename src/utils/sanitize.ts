/**
 * HTML 살균 처리 관련 유틸리티 함수들을 모아둔 모듈
 * @module sanitizeUtils
 */

/**
 * 허용된 HTML 태그 목록
 * @constant {string[]}
 */
const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'ul',
  'ol',
  'li',
  'code',
  'pre',
  'blockquote',
  'em',
  'strong',
  'del',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'img',
  'br',
  'hr',
];

/**
 * 허용된 HTML 속성 목록
 * @constant {string[]}
 */
const ALLOWED_ATTRIBUTES = ['href', 'src', 'alt', 'title', 'class'];

/**
 * HTML 문자열에서 위험한 태그와 속성을 제거
 * XSS 공격 방지를 위한 HTML 살균 처리
 * @param {string} html - 살균할 HTML 문자열
 * @returns {string} 살균된 HTML 문자열
 */
export const sanitizeHtml = (html: string): string => {
  // 스크립트 태그 제거
  html = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // 이벤트 핸들러 속성 제거
  html = html.replace(/\s*on\w+="[^"]*"/g, '');

  // 허용되지 않은 태그 제거
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  html = html.replace(tagPattern, (match, tag) => {
    if (ALLOWED_TAGS.includes(tag.toLowerCase())) {
      // 허용된 속성만 유지
      return match.replace(/\s+([a-z\-]+)="[^"]*"/gi, (attrMatch, attr) => {
        if (ALLOWED_ATTRIBUTES.includes(attr.toLowerCase())) {
          return attrMatch;
        }
        return '';
      });
    }
    return '';
  });

  return html;
};
