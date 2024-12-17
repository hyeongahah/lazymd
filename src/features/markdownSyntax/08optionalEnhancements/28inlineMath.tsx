import { Binary } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function InlineMathButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Inline Math'>
      <Binary size={18} />
    </ToolbarButton>
  );
}
