import { ArrowUpRight } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function SuperscriptButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Superscript'>
      <ArrowUpRight size={18} />
    </ToolbarButton>
  );
}
