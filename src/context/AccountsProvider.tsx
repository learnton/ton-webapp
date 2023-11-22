// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountsState, AccountType } from "@/types";

import { createContext, useContext, useEffect, useState } from "react";

import { DidDB, Account } from "@/utils";

import { useToggle } from "../hooks";
import { AppContext } from "./AppProvider";

export const AccountsContext = createContext({} as AccountsState);

function AccountsProvider({ children }: { children: React.ReactNode }) {
  const { accounts, allDidDB } = useContext(AppContext);
  const [account, setAccount] = useState<Account<AccountType> | null>(
    accounts.current
  );
  const [allAccounts, setAllAccounts] = useState<Account<AccountType>[]>(
    accounts.accounts
  );
  const [accountsOpen, toggleAccounts] = useToggle();
  const [settingOpen, toggleSetting] = useToggle();

  useEffect(() => {
    const currentChanged = () => {
      setAccount(accounts.current);
    };

    accounts.on("current_changed", currentChanged);

    return () => {
      accounts.off("current_changed", currentChanged);
    };
  }, [accounts]);

  useEffect(() => {
    const onAdd = (account: Account<AccountType>) => {
      if (account.type === "zkid") {
        const did = (account as Account<"zkid">).instance;

        allDidDB.set(did.id, new DidDB(did.id));
      }

      setAllAccounts(accounts.accounts);
    };

    const onRemove = (id: string) => {
      allDidDB.delete(id);
      setAllAccounts(accounts.accounts);
    };

    accounts.on("add", onAdd);
    accounts.on("remove", onRemove);

    return () => {
      accounts.off("add", onAdd);
      accounts.off("remove", onRemove);
    };
  }, [accounts, allDidDB]);

  return (
    <AccountsContext.Provider
      value={{
        account,
        allAccounts,
        accountsOpen,
        settingOpen,
        toggleAccounts,
        toggleSetting,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export default AccountsProvider;
