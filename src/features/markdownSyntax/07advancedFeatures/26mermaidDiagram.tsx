import { GitGraph } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function MermaidDiagramButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Mermaid Diagram'>
      <GitGraph size={18} />
    </ToolbarButton>
  );
}
