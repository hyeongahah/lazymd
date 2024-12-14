import { Italic as ItalicIcon } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Italic() {
  return (
    <ToolbarButton onClick={() => {}} title='Italic'>
      <ItalicIcon size={18} />
    </ToolbarButton>
  );
}
