import { create } from 'zustand';

interface MarkdownState {
  markdownText: string;
  text: string;
  setMarkdownText: (text: string | ((prev: string) => string)) => void;
}

export const useMarkdown = create<MarkdownState>((set) => ({
  markdownText: '',
  text: '',
  setMarkdownText: (text: string | ((prev: string) => string)) =>
    set((state) => ({
      markdownText:
        typeof text === 'function' ? text(state.markdownText) : text,
    })),
}));
