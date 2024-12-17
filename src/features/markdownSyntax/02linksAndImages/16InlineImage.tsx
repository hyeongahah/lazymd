import { Image } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

export function InlineImageButton() {
  return (
    <ToolbarButton onClick={() => {}} title='Insert Image'>
      <Image size={18} />
    </ToolbarButton>
  );
}
