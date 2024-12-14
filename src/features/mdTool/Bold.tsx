import { Bold as BoldIcon } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function Bold() {
  return (
    <ToolbarButton onClick={() => {}} title='Bold'>
      <BoldIcon size={18} />
    </ToolbarButton>
  );
}
