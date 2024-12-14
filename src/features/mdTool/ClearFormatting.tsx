import { useMarkdown } from '@/hooks/useMarkdown';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function ClearFormatting() {
  const { text, setText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    // 마크다운 서식 제거
    const cleanText = selectedText
      .replace(/[*_~`]/g, '') // 기본 서식 제거
      .replace(/#{1,6}\s/g, '') // 제목 서식 제거
      .replace(/<[^>]*>/g, '') // HTML 태그 제거
      .replace(/==/g, ''); // 형광펜 서식 제거

    const newText = text.substring(0, start) + cleanText + text.substring(end);

    setText(newText);
  };

  return (
    <ToolbarButton onClick={handleClick} title='Clear Formatting'>
      <span style={{ fontFamily: 'monospace' }}>T</span>
    </ToolbarButton>
  );
}
