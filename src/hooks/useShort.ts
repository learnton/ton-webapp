// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';

import { HexString } from '@zcloak/crypto/types';
import { DidUrl } from '@zcloak/did-resolver/types';

export function useShort() {
  const shortHash = useCallback((value?: HexString | string) => {
    if (value) return `${value.slice(0, 5)}...${value.slice(-5)}`;

    return undefined;
  }, []);

  const shortDid = useCallback((value?: DidUrl) => {
    if (value) return `${value.slice(0, 11)}...${value.slice(-4)}`;

    return undefined;
  }, []);

  return { shortHash, shortDid };
}
