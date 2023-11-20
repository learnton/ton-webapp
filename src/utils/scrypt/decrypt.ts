// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, u8aFixLength } from '@polkadot/util';

import { naclDecrypt, scryptEncode, scryptFromU8a } from '@zcloak/crypto';

import { NONCE_LENGTH, SCRYPT_LENGTH } from './defualts';

export function decrypt(encrypted: Uint8Array, passphrase?: string): Uint8Array {
  let decoded: Uint8Array | null = encrypted;

  if (passphrase) {
    const { params, salt } = scryptFromU8a(encrypted);
    const { password } = scryptEncode(passphrase, salt, params);

    encrypted = encrypted.subarray(SCRYPT_LENGTH);

    decoded = naclDecrypt(
      encrypted.subarray(NONCE_LENGTH),
      encrypted.subarray(0, NONCE_LENGTH),
      u8aFixLength(password, 256, true)
    );
  }

  assert(decoded, 'Unable to decrypt using the supplied passphrase');

  return decoded;
}
