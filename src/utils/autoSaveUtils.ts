const AUTO_SAVE_KEY = 'markdown_autosave';
const DEBOUNCE_DELAY = 5000;

let autoSaveTimer: NodeJS.Timeout;

export const autoSave = (content: string) => {
  // 이전 타이머 취소
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }

  // 새로운 타이머 설정
  autoSaveTimer = setTimeout(() => {
    localStorage.setItem(AUTO_SAVE_KEY, content);
  }, DEBOUNCE_DELAY);
};

export const loadAutoSavedContent = (): string => {
  const savedContent = localStorage.getItem(AUTO_SAVE_KEY);
  return savedContent || '';
};

export const clearAutoSavedContent = () => {
  localStorage.removeItem(AUTO_SAVE_KEY);
};
