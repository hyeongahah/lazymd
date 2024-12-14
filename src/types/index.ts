import { ReactNode } from 'react';

export interface ToolbarButtonProps {
  onClick: () => void;
  children: ReactNode;
  title?: string;
}
