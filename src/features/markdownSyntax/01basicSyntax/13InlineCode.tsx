import { Code } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function InlineCodeButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Inline Code'>
      <Code size={18} />
    </ToolbarButton>
  );
}
