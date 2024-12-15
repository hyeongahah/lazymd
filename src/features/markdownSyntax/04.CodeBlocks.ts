import { unified } from 'unified';
import { Handler } from 'mdast-util-to-hast';
import { BasicNode } from '@/types/markdown';

export const codeBlocks = async (content: string): Promise<string> => {
  return content;
};
