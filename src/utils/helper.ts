import { BaseURL } from "@/constant";

export const reloadToIndex = () => {
  window.location.href = BaseURL;
};

export function isUrl(input: string): boolean {
  return /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(input);
}

export function isDomain(input: string): boolean {
  return /^([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(input);
}

export function shortString(str: string, pre: number, after: number): string {
  if (str.length > pre + after) {
    return `${str.slice(0, pre)}...${str.slice(-after)}`;
  }
  return str;
}
