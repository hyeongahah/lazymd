import { FormatOptions } from './types';

export function applyFormat(
  text: string,
  setText: (text: string) => void,
  options: FormatOptions
) {
  const textarea = document.querySelector('textarea');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = text.substring(start, end);

  if (start === end && options.alertMessage) {
    alert(options.alertMessage);
    return;
  }

  // 이미 해당 서식이 적용되어 있는지 확인
  const beforeText = text.substring(
    Math.max(0, start - options.prefix.length),
    start
  );
  const afterText = text.substring(
    end,
    Math.min(text.length, end + options.suffix.length)
  );

  const hasFormat =
    beforeText === options.prefix && afterText === options.suffix;

  let newText;
  if (hasFormat) {
    // 서식 제거
    newText =
      text.substring(0, start - options.prefix.length) +
      selectedText +
      text.substring(end + options.suffix.length);

    setText(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start - options.prefix.length,
        end - options.prefix.length
      );
    }, 0);
  } else {
    // 서식 적용
    newText =
      text.substring(0, start) +
      options.prefix +
      selectedText +
      options.suffix +
      text.substring(end);

    setText(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + options.prefix.length,
        end + options.prefix.length
      );
    }, 0);
  }
}
