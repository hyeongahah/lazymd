import { Minus } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function HorizontalRuleButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Horizontal Rule'>
      <Minus size={18} />
    </ToolbarButton>
  );
}
