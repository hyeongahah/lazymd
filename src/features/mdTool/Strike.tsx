import { Strikethrough } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Strike() {
  return (
    <ToolbarButton onClick={() => {}} title='Strike'>
      <Strikethrough size={18} />
    </ToolbarButton>
  );
}
