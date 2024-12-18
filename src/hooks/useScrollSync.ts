import { RefObject, useEffect, UIEvent } from 'react';

const useScrollSync = (ref: RefObject<HTMLDivElement | null>) => {
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    // 스크롤 동기화 구현
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
  }, [ref]);

  return handleScroll;
};

export default useScrollSync;
