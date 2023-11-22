// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseStore } from "@zcloak/ui-store";

import React, { createContext, useEffect, useState } from "react";

import { DID_SERVICE } from "@/api/axiosInstance";
import { ZkDidResolver, AuthDB, CacheDB, DidDB, CredentialCard } from "@/utils";

import { AppState } from "@/types";
import { getCTypes } from "@/api/did";
// TODO refactor by wallet-bli
import { WalletKeyring, DidAccounts, DidAccount } from "@zcloak/wallet-lib";
import { useTwaSdk } from "@/hooks";

let authDB: AuthDB;
let cacheDB: CacheDB;
const allDidDB = new Map<any, any>();
let resolver: ZkDidResolver;
let keyring: WalletKeyring;
let accounts: DidAccounts;
let credentialCard: CredentialCard;

async function initInstance(
  store: BaseStore,
  session: BaseStore,
  UserInfo: any
): Promise<DidAccounts> {
  authDB = new AuthDB();
  cacheDB = new CacheDB();
  resolver = new ZkDidResolver(cacheDB, DID_SERVICE);

  credentialCard = new CredentialCard(store);
  await credentialCard.isReady;

  keyring = new WalletKeyring(store, session);
  await keyring.isReady;

  return new DidAccounts(String(UserInfo?.id), keyring, store);
}

export const AppContext = createContext({} as AppState);

function AppProvider({
  children,
  session,
  store,
}: {
  children: React.ReactNode;
  store: BaseStore;
  session: BaseStore;
}) {
  const [ready, setReady] = useState(false);
  const { UserInfo } = useTwaSdk();
  const [didAccounts, setDidAccounts] = useState<DidAccounts | null>(null);

  useEffect(() => {
    if (UserInfo?.id) {
      initInstance(store, session, UserInfo).then((_didAccounts) => {
        void _didAccounts.isReady.then((_d) => {
          _d.accounts.forEach((account) => {
            allDidDB.set(account.instance.id, new DidDB(account.instance.id));
          });
          setReady(true);
          setDidAccounts(_d);
        });
      });
    }
  }, [session, store, UserInfo?.id]);

  useEffect(() => {
    if (ready) {
      getCTypes().then((res) => {
        if (res.code === 200) {
          res.data?.forEach((ctype: any) => {
            cacheDB.cacheCType.put(ctype.rawData);
          });
        }
      });
    }
  }, [ready]);

  return ready ? (
    <AppContext.Provider
      value={{
        store,
        session,
        authDB,
        cacheDB,
        allDidDB,
        resolver,
        keyring,
        accounts,
        didAccounts,
        did: accounts.current,
        credentialCard,
      }}
    >
      {children}
    </AppContext.Provider>
  ) : null;
}

export default AppProvider;
