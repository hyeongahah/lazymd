import { ListTree } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function NestedListButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Nested List'>
      <ListTree size={18} />
    </ToolbarButton>
  );
}
