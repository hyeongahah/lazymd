import { useCallback } from 'react';
import { syncScroll } from '@/utils/markdownUtils';

export const useScrollSync = () => {
  const handleScroll = useCallback(
    (
      textarea: HTMLTextAreaElement,
      preview: HTMLElement,
      lineNumbers: HTMLElement
    ) => {
      syncScroll(textarea, preview, lineNumbers);
    },
    []
  );

  return { handleScroll };
};
