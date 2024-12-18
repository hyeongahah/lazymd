import { RefObject, UIEvent } from 'react';

const useScrollSync = (ref: RefObject<HTMLDivElement | null>) => {
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const sourceElement = event.currentTarget;
    const targetElement = ref.current;

    if (!targetElement) return;

    // 스크롤 위치의 상대적 비율 계산
    const scrollPercentage =
      sourceElement.scrollTop /
      (sourceElement.scrollHeight - sourceElement.clientHeight);

    // 타겟 엘리먼트의 스크롤 위치 설정
    targetElement.scrollTop =
      scrollPercentage *
      (targetElement.scrollHeight - targetElement.clientHeight);
  };

  return handleScroll;
};

export default useScrollSync;
