// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UnsignedTransaction } from '@ethersproject/transactions';

export interface TransactionMeta extends UnsignedTransaction {
  id: string;
  hash: string;
}
