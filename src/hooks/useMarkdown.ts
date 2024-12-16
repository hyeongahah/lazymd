import { create } from 'zustand';

interface MarkdownState {
  markdownText: string;
  text: string;
  setMarkdownText: (text: string) => void;
}

export const useMarkdown = create<MarkdownState>((set) => ({
  markdownText: '',
  text: '',
  setMarkdownText: (text: string) => set({ markdownText: text }),
}));
