import { RotateCw } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function RedoButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Redo (Ctrl+Y)'>
      <RotateCw size={18} />
    </ToolbarButton>
  );
}
