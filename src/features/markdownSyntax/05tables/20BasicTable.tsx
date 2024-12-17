import { Table } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function BasicTableButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Insert Table'>
      <Table size={18} />
    </ToolbarButton>
  );
}
