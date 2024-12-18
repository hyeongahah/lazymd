import { parseInlineStyles } from '@/utils/parseUtils';

export const parseBlockquote = (text: string): string => {
  const blockquoteMatch = text.match(/^>\s?(.*)$/);
  if (!blockquoteMatch) return text;

  const content = parseInlineStyles(blockquoteMatch[1]);
  return `<blockquote>${content}</blockquote>`;
};
