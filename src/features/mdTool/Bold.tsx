import React, { useCallback } from 'react';
import { Bold as BoldIcon } from 'lucide-react';
import { applyFormat } from '@/components/Util/formatUtils';
import { FormatProps } from '@/components/Util/types';

export const Bold = ({ markdownText, setMarkdownText }: FormatProps) => {
  const handleBold = useCallback(() => {
    applyFormat(markdownText, setMarkdownText, {
      prefix: '**',
      suffix: '**',
      alertMessage: '볼드체를 적용할 텍스트를 선택해주세요.',
    });
  }, [markdownText]);

  return <BoldIcon size={18} onClick={handleBold} />;
};
