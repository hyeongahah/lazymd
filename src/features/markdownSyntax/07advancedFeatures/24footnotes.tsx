import { Asterisk } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function FootnotesButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Footnotes'>
      <Asterisk size={18} />
    </ToolbarButton>
  );
}
