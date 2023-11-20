// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decrypt } from './decrypt';
import { encrypt } from './encrypt';
import { mnemonicDecrypt, mnemonicEncrypt } from './mnemonic';
import { vcDecrypt, vcEncrypt } from './vc';

export const scrypt = {
  vcDecrypt,
  vcEncrypt,
  mnemonicDecrypt,
  mnemonicEncrypt,
  decrypt,
  encrypt
};
