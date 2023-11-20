// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, numberToU8a, stringToU8a, u8aConcat, u8aFixLength, u8aToNumber, u8aToString } from '@polkadot/util';

import { mnemonicValidate } from '@zcloak/crypto';

import { decrypt } from './decrypt';
import { DEFAULT_MNEMONIC_ENCRYPT_VERSION, VERSION_BYTE_LENGTH } from './defualts';
import { encrypt } from './encrypt';

export function mnemonicEncrypt(mnemonic: string, passphrase?: string): Uint8Array {
  let data: string;

  if (mnemonicValidate(mnemonic)) {
    data = mnemonic;
  } else {
    throw new Error('not a valid mnemonic');
  }

  const encoded = u8aConcat(
    u8aFixLength(numberToU8a(DEFAULT_MNEMONIC_ENCRYPT_VERSION), VERSION_BYTE_LENGTH * 8),
    stringToU8a(data)
  );

  return encrypt(encoded, passphrase);
}

export function mnemonicDecrypt(encrypted: Uint8Array, passphrase?: string): string {
  const decoded = decrypt(encrypted, passphrase);

  const versionU8a = decoded.subarray(0, VERSION_BYTE_LENGTH);
  const contentU8a = decoded.subarray(VERSION_BYTE_LENGTH);

  const version = u8aToNumber(versionU8a);

  if (![0].includes(version)) {
    throw new Error('Wrong version number');
  }

  const mnemonic = u8aToString(contentU8a);

  assert(mnemonicValidate(mnemonic), 'Not a mnemonic, parse error');

  return mnemonic;
}
