import { Table } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function CustomTableButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Custom Table'>
      <Table size={18} />
    </ToolbarButton>
  );
}
