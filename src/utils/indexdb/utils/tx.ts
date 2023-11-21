// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UnsignedTransaction } from '@ethersproject/transactions';

import { DidDB } from '../db';

export async function addTx(didDB?: DidDB | null, hash?: string, tx?: UnsignedTransaction) {
  if (!didDB || !hash || !tx) return;

  const id = `${hash}-${tx.to}`;

  await didDB.transactionMeta.put({ ...tx, hash, id });
}
