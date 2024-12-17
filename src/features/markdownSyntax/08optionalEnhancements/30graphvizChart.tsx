import { Network } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function GraphvizChartButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Graphviz Chart'>
      <Network size={18} />
    </ToolbarButton>
  );
}
