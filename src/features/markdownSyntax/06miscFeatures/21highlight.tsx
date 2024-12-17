import { Highlighter } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function HighlightButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Highlight'>
      <Highlighter size={18} />
    </ToolbarButton>
  );
}
