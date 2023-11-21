// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DidUrl } from '@zcloak/did-resolver/types';

export function isDidUrlArray(input: unknown): input is DidUrl[] {
  return Array.isArray(input);
}
