import { Underline } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function UnderlineButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Underline'>
      <Underline size={18} />
    </ToolbarButton>
  );
}
