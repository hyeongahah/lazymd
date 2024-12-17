import { Link } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function InlineLinkButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Insert Link'>
      <Link size={18} />
    </ToolbarButton>
  );
}
