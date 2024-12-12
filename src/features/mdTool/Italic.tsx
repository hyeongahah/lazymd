import React, { useCallback } from 'react';
import { Italic as ItalicIcon } from 'lucide-react';
import { applyFormat } from '@/components/Util/formatUtils';
import { FormatProps } from '@/components/Util/types';

export const Italic = ({ markdownText, setMarkdownText }: FormatProps) => {
  const handleItalic = useCallback(() => {
    applyFormat(markdownText, setMarkdownText, {
      prefix: '*',
      suffix: '*',
      alertMessage: '이탤릭체를 적용할 텍스트를 선택해주세요.',
    });
  }, [markdownText]);

  return <ItalicIcon size={18} onClick={handleItalic} />;
};
