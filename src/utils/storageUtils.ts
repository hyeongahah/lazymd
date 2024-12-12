export const loadFromStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error loading from storage: ${error}`);
    return null;
  }
};

export const saveToStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error saving to storage: ${error}`);
    return false;
  }
};
