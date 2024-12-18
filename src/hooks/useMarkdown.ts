import { create } from 'zustand';

interface MarkdownState {
  markdownText: string;
  setMarkdownText: (text: string | ((prev: string) => string)) => void;
}

export const useMarkdown = create<MarkdownState>((set) => ({
  markdownText: '',
  setMarkdownText: (text: string | ((prev: string) => string)) =>
    set((state) => ({
      markdownText:
        typeof text === 'function' ? text(state.markdownText) : text,
    })),
}));
