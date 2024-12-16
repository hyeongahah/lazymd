import { Link } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function InternalDocLinkButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Internal Document Link'>
      <Link size={18} />
    </ToolbarButton>
  );
}
