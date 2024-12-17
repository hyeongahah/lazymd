import { Strikethrough } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function StrikethroughButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Strikethrough'>
      <Strikethrough size={18} />
    </ToolbarButton>
  );
}
