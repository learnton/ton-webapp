// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext, useEffect, useMemo, useState } from "react";

import { DidContext } from "@/context/Did";
import { AccountMeta } from "@/types";

export function useAccountMeta(id?: string | null): AccountMeta | undefined {
  const { didAccounts } = useContext(DidContext);
  const allAccounts = didAccounts?.accounts;
  const account = useMemo(
    () => allAccounts?.find((account) => account.instance.id === id),
    [allAccounts, id]
  );
  const [meta, setMeta] = useState<AccountMeta | undefined>(account?.meta);

  useEffect(() => {
    setMeta(account?.meta);
  }, [account]);

  useEffect(() => {
    account?.on("meta_changed", setMeta);

    return () => {
      account?.off("meta_changed", setMeta);
    };
  }, [account]);

  return meta;
}
