import { Palette } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function FontColorButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Font Color'>
      <Palette size={18} />
    </ToolbarButton>
  );
}
