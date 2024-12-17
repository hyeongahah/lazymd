import { Calculator } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function BlockMathButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Block Math'>
      <Calculator size={18} />
    </ToolbarButton>
  );
}
