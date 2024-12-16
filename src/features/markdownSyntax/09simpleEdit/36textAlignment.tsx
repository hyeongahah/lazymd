import { AlignCenter } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function TextAlignmentButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Text Alignment'>
      <AlignCenter size={18} />
    </ToolbarButton>
  );
}
