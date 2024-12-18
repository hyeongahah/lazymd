import { Trash2 } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 전체 삭제 처리 핸들러
export const handleClearAll = (
  textarea: HTMLTextAreaElement,
  setMarkdownText: (text: string) => void
) => {
  // 현재 커서 위치 저장
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // 전체 텍스트 삭제
  setMarkdownText('');

  // 커서를 처음 위치로 이동
  textarea.setSelectionRange(0, 0);
  textarea.focus();
};

export function ClearAllButton() {
  const { setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      if (window.confirm('모든 내용을 삭제하시겠습니까?')) {
        handleClearAll(textarea, setMarkdownText);
      }
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='전체 삭제'>
      <Trash2 size={18} />
    </ToolbarButton>
  );
}
