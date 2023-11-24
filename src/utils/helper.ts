export const reloadToIndex = () => {
  window.location.href = import.meta.env.BASE_URL;
};

export function shortString(str: string, pre: number, after: number): string {
  if (str.length > pre + after) {
    return `${str.slice(0, pre)}...${str.slice(-after)}`;
  }
  return str;
}
