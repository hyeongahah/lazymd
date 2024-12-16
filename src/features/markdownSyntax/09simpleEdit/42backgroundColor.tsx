import { Droplet } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function BackgroundColorButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Background Color'>
      <Droplet size={18} />
    </ToolbarButton>
  );
}
