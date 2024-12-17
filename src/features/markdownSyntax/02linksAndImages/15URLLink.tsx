import { Link2 } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function URLLinkButton() {
  return (
    <ToolbarButton onClick={() => {}} title='URL Link'>
      <Link2 size={18} />
    </ToolbarButton>
  );
}
