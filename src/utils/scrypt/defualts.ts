// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MnemonicEncryptVersion, VCEncryptVersion } from './types';

export const DEFAULT_VC_ENCRYPT_VERSION: VCEncryptVersion = 0;

export const DEFAULT_MNEMONIC_ENCRYPT_VERSION: MnemonicEncryptVersion = 0;

export const VERSION_BYTE_LENGTH = 4;

export const VC_TYPE_BYTE_LENGTH = 4;

export const SCRYPT_LENGTH = 32 + 3 * 4;

export const NONCE_LENGTH = 24;
