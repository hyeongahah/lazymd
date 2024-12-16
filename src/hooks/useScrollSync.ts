import { useEffect, useRef } from 'react';

export const useScrollSync = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 스크롤을 최하단으로 이동
    const scrollToBottom = () => {
      element.scrollTop = element.scrollHeight;
    };

    // MutationObserver를 사용하여 컨텐츠 변경 감지
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    // 옵저버 설정
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return elementRef;
};
