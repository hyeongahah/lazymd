import { FileCode2 } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function LanguageCodeBlockButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Language Code Block'>
      <FileCode2 size={18} />
    </ToolbarButton>
  );
}
