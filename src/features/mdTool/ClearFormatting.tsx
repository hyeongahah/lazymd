import { Type } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function ClearFormatting() {
  return (
    <ToolbarButton onClick={() => {}} title='Clear Formatting'>
      <Type size={18} />
    </ToolbarButton>
  );
}
