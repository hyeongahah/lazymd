import { ArrowDownRight } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function SubscriptButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Subscript'>
      <ArrowDownRight size={18} />
    </ToolbarButton>
  );
}
