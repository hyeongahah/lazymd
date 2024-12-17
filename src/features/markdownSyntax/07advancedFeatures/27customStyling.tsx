import { Paintbrush } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function CustomStylingButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Custom Styling'>
      <Paintbrush size={18} />
    </ToolbarButton>
  );
}
