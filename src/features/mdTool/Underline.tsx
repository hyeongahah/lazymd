import { Underline as UnderlineIcon } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Underline() {
  return (
    <ToolbarButton onClick={() => {}} title='Underline'>
      <UnderlineIcon size={18} />
    </ToolbarButton>
  );
}
