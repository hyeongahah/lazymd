import { ListRestart } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function ListConversionButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='List Type Conversion'>
      <ListRestart size={18} />
    </ToolbarButton>
  );
}
