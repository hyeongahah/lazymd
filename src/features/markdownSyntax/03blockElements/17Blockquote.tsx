import { Quote } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function BlockquoteButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Blockquote'>
      <Quote size={18} />
    </ToolbarButton>
  );
}
