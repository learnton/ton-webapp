// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseStore } from "@zcloak/ui-store";

import type { Account, Accounts, AppKeyring, ZkDidResolver } from "@/utils";
import type { CredentialCard } from "@/utils";
import type { AccountType } from "@/types";
import type { AuthDB, CacheDB, DidDB } from "@/utils";

export type DidRole = "attester" | "claimer";

export interface AppState {
  store: BaseStore;
  session: BaseStore;
  authDB: AuthDB;
  cacheDB: CacheDB;
  allDidDB: Map<string, DidDB>;
  resolver: ZkDidResolver;
  keyring: AppKeyring;
  accounts: Accounts;
  credentialCard: CredentialCard;
}

export interface AccountsState {
  account: Account<AccountType> | null;
  allAccounts: Account<AccountType>[];
  accountsOpen: boolean;
  settingOpen: boolean;
  toggleAccounts: () => void;
  toggleSetting: () => void;
}
