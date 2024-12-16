import { TableProperties } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function TableFormattingButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Table Formatting'>
      <TableProperties size={18} />
    </ToolbarButton>
  );
}
