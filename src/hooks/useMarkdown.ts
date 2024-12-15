import { create } from 'zustand';

interface MarkdownState {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export const useMarkdown = create<MarkdownState>((set) => ({
  markdownText: '',
  setMarkdownText: (text: string) => set({ markdownText: text }),
}));
