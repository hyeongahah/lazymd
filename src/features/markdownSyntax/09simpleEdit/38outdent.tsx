import { Outdent } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function OutdentButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Outdent'>
      <Outdent size={18} />
    </ToolbarButton>
  );
}
