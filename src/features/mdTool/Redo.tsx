import { useMarkdown } from '@/hooks/useMarkdown';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Redo() {
  const { text, setText } = useMarkdown();

  const handleClick = () => {
    document.execCommand('redo');
  };

  return (
    <ToolbarButton onClick={handleClick} title='다시 실행'>
      ↪
    </ToolbarButton>
  );
}
