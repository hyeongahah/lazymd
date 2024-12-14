import { RotateCcw } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Undo() {
  return (
    <ToolbarButton onClick={() => {}} title='Undo'>
      <RotateCcw size={18} />
    </ToolbarButton>
  );
}
