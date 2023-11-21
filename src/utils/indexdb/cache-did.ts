// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument, DidUrl } from '@zcloak/did-resolver/types';

export interface CacheDid {
  did: DidUrl;
  document: DidDocument;
}
