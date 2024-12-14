import { useMarkdown } from '@/hooks/useMarkdown';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Undo() {
  const { text, setText } = useMarkdown();

  const handleClick = () => {
    document.execCommand('undo');
  };

  return (
    <ToolbarButton onClick={handleClick} title='실행 취소'>
      ↩
    </ToolbarButton>
  );
}
