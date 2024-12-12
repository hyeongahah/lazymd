import MarkdownIt from 'markdown-it';

export const createMarkdownIt = () => {
  const md = MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });

  const defaultRender =
    md.renderer.rules.text ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.text = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    if (token.content === '') {
      return '<br/>';
    }
    return defaultRender(tokens, idx, options, env, self);
  };

  md.renderer.rules.softbreak = function () {
    return '<br/>';
  };

  md.renderer.rules.hardbreak = function () {
    return '<br/>';
  };

  md.renderer.rules.paragraph_open = function () {
    return '<p>';
  };

  md.renderer.rules.paragraph_close = function () {
    return '</p>';
  };

  return md;
};

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
