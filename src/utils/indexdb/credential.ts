// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';

export type CredentialVersion = 0 | 1;
export type CredentialSource = 'KILT Peregrine' | 'KILT Spiritnet';

export interface Credential {
  owner: string;
  rootHash: HexString;
  attester: string;
  ctypeHash: HexString;
  updateTime: number;
  // fetch the attested status source
  source: CredentialSource;
  // credential version
  version: CredentialVersion;
  // the encrypt credential
  encoded: string;
}
