import { RotateCw } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Redo() {
  return (
    <ToolbarButton onClick={() => {}} title='Redo'>
      <RotateCw size={18} />
    </ToolbarButton>
  );
}
