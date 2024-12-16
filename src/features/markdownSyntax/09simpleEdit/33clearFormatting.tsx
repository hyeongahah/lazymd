import { FileX } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function ClearFormattingButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Clear Formatting'>
      <FileX size={18} />
    </ToolbarButton>
  );
}
