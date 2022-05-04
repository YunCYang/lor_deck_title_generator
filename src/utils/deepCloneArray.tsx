export const deepCloneArray = (arr: any[]): any[] => {
  return arr.map(item => Array.isArray(item) ? deepCloneArray(item) : item);
};
