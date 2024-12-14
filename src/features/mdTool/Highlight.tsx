import { Highlighter } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Highlight() {
  return (
    <ToolbarButton onClick={() => {}} title='Highlight'>
      <Highlighter size={18} />
    </ToolbarButton>
  );
}
