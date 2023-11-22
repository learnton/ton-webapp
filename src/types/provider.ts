// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Account } from "@/utils";
import type { AccountType } from "@/types";

export type DidRole = "attester" | "claimer";

export interface AccountsState {
  account: Account<AccountType> | null;
  allAccounts: Account<AccountType>[];
  accountsOpen: boolean;
  settingOpen: boolean;
  toggleAccounts: () => void;
  toggleSetting: () => void;
}
