import { CheckSquare } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function CheckboxButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Checkbox'>
      <CheckSquare size={18} />
    </ToolbarButton>
  );
}
