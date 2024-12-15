interface AllowedAttributes {
  a: string[];
  img: string[];
  '*': string[];
  [key: string]: string[];
}

const ALLOWED_TAGS = [
  'div',
  'span',
  'p',
  'br',
  'hr',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'em',
  'strong',
  'i',
  'b',
  'u',
  'strike',
  'sup',
  'sub',
  'blockquote',
  'pre',
  'code',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'img',
  'a',
  'mark',
  'details',
  'summary',
];

const ALLOWED_ATTRS: AllowedAttributes = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  '*': ['class', 'id', 'style'],
};

export function sanitizeHtml(html: string): string {
  // 스크립트 태그 제거
  html = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // 허용되지 않은 태그 제거
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  html = html.replace(tagPattern, (match, tag) => {
    return ALLOWED_TAGS.includes(tag.toLowerCase()) ? match : '';
  });

  // 허용되지 않은 속성 제거
  const attrPattern = /\s([a-zA-Z\-]+)(?:="([^"]+)")?/g;
  html = html.replace(
    /<([a-z][a-z0-9]*)\b([^>]*)>/gi,
    (match: string, tag: string, attrs: string) => {
      const allowedForTag =
        ALLOWED_ATTRS[tag.toLowerCase()] || ALLOWED_ATTRS['*'] || [];
      const cleanAttrs = attrs.replace(
        attrPattern,
        (_: string, attr: string, value: string) => {
          return allowedForTag.includes(attr.toLowerCase())
            ? ` ${attr}="${value}"`
            : '';
        }
      );
      return `<${tag}${cleanAttrs}>`;
    }
  );

  return html;
}
