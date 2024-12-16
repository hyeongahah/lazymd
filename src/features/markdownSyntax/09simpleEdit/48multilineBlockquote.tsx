import { Quote } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function MultilineBlockquoteButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <ToolbarButton onClick={onClick} title='Multi-line Blockquote'>
      <Quote size={18} />
    </ToolbarButton>
  );
}
