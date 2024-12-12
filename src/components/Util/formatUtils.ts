import styles from '@/app/page.module.css';

interface FormatOptions {
  prefix: string;
  suffix: string;
  alertMessage: string;
}

export const applyFormat = (
  markdownText: string,
  setMarkdownText: (text: string) => void,
  options: FormatOptions
) => {
  const textarea = document.querySelector(
    `.${styles.editor}`
  ) as HTMLTextAreaElement;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (start === end) {
    alert(options.alertMessage);
    return;
  }

  const beforeText = markdownText.substring(
    Math.max(0, start - options.prefix.length),
    start
  );
  const afterText = markdownText.substring(
    end,
    Math.min(markdownText.length, end + options.suffix.length)
  );
  const selectedText = markdownText.substring(start, end);

  const isFormatted =
    beforeText === options.prefix && afterText === options.suffix;

  let newText;
  if (isFormatted) {
    // 포맷 제거
    newText =
      markdownText.substring(0, start - options.prefix.length) +
      selectedText +
      markdownText.substring(end + options.suffix.length);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start - options.prefix.length,
        end - options.prefix.length
      );
    }, 0);
  } else {
    // 포맷 적용
    newText =
      markdownText.substring(0, start) +
      `${options.prefix}${selectedText}${options.suffix}` +
      markdownText.substring(end);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + options.prefix.length,
        end + options.prefix.length
      );
    }, 0);
  }

  setMarkdownText(newText);
};
