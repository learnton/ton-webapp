// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerifiableCredential } from '@zcloak/vc/types';

import { assert, numberToU8a, stringToU8a, u8aConcat, u8aFixLength, u8aToNumber, u8aToString } from '@polkadot/util';

import { isVC } from '@zcloak/vc/is';

import { decrypt } from './decrypt';
import { DEFAULT_VC_ENCRYPT_VERSION, VC_TYPE_BYTE_LENGTH, VERSION_BYTE_LENGTH } from './defualts';
import { encrypt } from './encrypt';
import { VCEncryptEnum } from './types';

export function vcEncrypt(vc: VerifiableCredential<boolean>, passphrase?: string): Uint8Array {
  let data: string;
  let type: VCEncryptEnum;

  if (isVC(vc)) {
    data = JSON.stringify(vc);
    type = VCEncryptEnum.zkid;
  } else {
    throw new Error('input `vc` not an credential');
  }

  const encoded = u8aConcat(
    u8aFixLength(numberToU8a(DEFAULT_VC_ENCRYPT_VERSION), VERSION_BYTE_LENGTH * 8),
    u8aFixLength(numberToU8a(type), VC_TYPE_BYTE_LENGTH * 8),
    stringToU8a(data)
  );

  return encrypt(encoded, passphrase);
}

export function vcDecrypt(encrypted: Uint8Array, passphrase?: string): VerifiableCredential<boolean> {
  const decoded = decrypt(encrypted, passphrase);

  const versionU8a = decoded.subarray(0, VERSION_BYTE_LENGTH);
  const typeU8a = decoded.subarray(VERSION_BYTE_LENGTH, VERSION_BYTE_LENGTH + VC_TYPE_BYTE_LENGTH);
  const contentU8a = decoded.subarray(VERSION_BYTE_LENGTH + VC_TYPE_BYTE_LENGTH);

  const version = u8aToNumber(versionU8a);
  const type = u8aToNumber(typeU8a);

  if (![0].includes(version)) {
    throw new Error('Wrong version number');
  }

  const content = JSON.parse(u8aToString(contentU8a));

  if (VCEncryptEnum.zkid) {
    assert(isVC(content), 'Not a zkid credential, parse error');

    return content;
  }

  throw new Error(`Wrong content type with: ${type}`);
}
