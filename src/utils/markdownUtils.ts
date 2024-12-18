import { parseMarkdown } from './parseUtils';

export { parseMarkdown };

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
