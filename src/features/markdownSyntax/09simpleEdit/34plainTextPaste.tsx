import { ClipboardPaste } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';

export function PlainTextPasteButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Paste as Plain Text'>
      <ClipboardPaste size={18} />
    </ToolbarButton>
  );
}
