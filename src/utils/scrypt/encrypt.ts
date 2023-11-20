// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aConcat } from '@polkadot/util';

import { naclEncrypt, scryptEncode, scryptToU8a } from '@zcloak/crypto';

export function encrypt(bytes: Uint8Array, passphrase?: string): Uint8Array {
  if (!passphrase) return bytes;

  const { params, password, salt } = scryptEncode(passphrase);
  const { encrypted, nonce } = naclEncrypt(bytes, password.subarray(0, 32));

  return u8aConcat(scryptToU8a(salt, params), nonce, encrypted);
}
