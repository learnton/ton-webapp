// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function isUrl(input: string): boolean {
  return /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(input);
}

export function isDomain(input: string): boolean {
  return /^([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(input);
}

export function addHttpsPrefix(input: string): string | undefined {
  if (isUrl(input)) {
    return input;
  } else if (isDomain(input)) {
    if (!input.startsWith('https://') && !input.startsWith('http://')) {
      return input.startsWith('localhost') ? `http://${input}` : `https://${input}`;
    } else {
      return input;
    }
  } else {
    return undefined;
  }
}
