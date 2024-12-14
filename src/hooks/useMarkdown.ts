import { create } from 'zustand';

interface MarkdownState {
  text: string;
  setText: (text: string) => void;
}

export const useMarkdown = create<MarkdownState>((set) => ({
  text: '',
  setText: (text: string) => set({ text }),
}));
