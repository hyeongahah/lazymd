import { Code2 } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function CodeBlockButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Code Block'>
      <Code2 size={18} />
    </ToolbarButton>
  );
}
