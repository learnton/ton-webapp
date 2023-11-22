// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from "@zcloak/crypto/types";

interface Base {
  id?: number;
  rootHash: HexString;
  website?: string;
  createTime: number;
  updateTime: number;
}

export type ShowHistory = {
  show: string;
} & Base;

export type ProofHistory = {
  programName?: string;
  programHash: string;
  Fields: string;
  expectResult: string;
  proofCid?: string;
} & Base;

export type HistoryInterface = ProofHistory | ShowHistory;
