import { FileCode } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function CodeBlockButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Code Block'>
      <FileCode size={18} />
    </ToolbarButton>
  );
}
