// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HashType } from '@zcloak/vc/types';

import { HexString } from '@zcloak/crypto/types';
import { DidUrl } from '@zcloak/did-resolver/types';

export type ZkCredentialVersion = 0;
export type ZkCredentialSource = 'ZKID';

export interface ZkCredential {
  id: HexString;
  digest: HexString;
  rootHash: HexString;
  ctypeHash: HexString;
  attester: DidUrl[];
  owner: DidUrl;
  hasher: [HashType, HashType];
  issuanceDate: number;
  expirationDate?: number;
  source: ZkCredentialSource;
  version: ZkCredentialVersion;
  encoded: HexString;
  boundedMessageId?: string;
}
