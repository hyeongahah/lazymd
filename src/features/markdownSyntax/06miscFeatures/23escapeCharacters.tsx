import { Slash } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function EscapeCharactersButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Escape Characters'>
      <Slash size={18} />
    </ToolbarButton>
  );
}
