import { useMarkdown } from '@/hooks/useMarkdown';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Underline() {
  const { text, setText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    const newText =
      text.substring(0, start) + `<u>${selectedText}</u>` + text.substring(end);

    setText(newText);
  };

  return (
    <ToolbarButton onClick={handleClick} title='Underline'>
      <span style={{ textDecoration: 'underline' }}>U</span>
    </ToolbarButton>
  );
}
