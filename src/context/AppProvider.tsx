/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseStore } from "@zcloak/ui-store";

import React, { createContext, useEffect, useState } from "react";

import { DID_SERVICE } from "@/api/axiosInstance";
import { ZkDidResolver, AuthDB, CacheDB, DidDB, CredentialCard } from "@/utils";

import { getCTypes } from "@/api/did";
// TODO refactor by wallet-bli
import { WalletKeyring, DidAccounts, DidAccount } from "@zcloak/wallet-lib";

export interface AppState {
  store: BaseStore;
  session: BaseStore;
  authDB: AuthDB;
  cacheDB: CacheDB;
  allDidDB: Map<string, DidDB>;
  resolver: ZkDidResolver;
  keyring: WalletKeyring;
  credentialCard: CredentialCard;
  currentDid: () => DidAccount | null | undefined;
  didAccounts: DidAccounts;
}

let authDB: AuthDB;
let cacheDB: CacheDB;
const allDidDB = new Map<string, DidDB>();
let resolver: ZkDidResolver;
let keyring: WalletKeyring;
let credentialCard: CredentialCard;
let didAccounts: DidAccounts;

async function initInstance(
  store: BaseStore,
  session: BaseStore
): Promise<void> {
  authDB = new AuthDB();
  cacheDB = new CacheDB();
  resolver = new ZkDidResolver(cacheDB, DID_SERVICE);

  credentialCard = new CredentialCard(store);
  await credentialCard.isReady;

  keyring = new WalletKeyring(store, session);
  await keyring.isReady;

  didAccounts = await new DidAccounts(`TonWebApp`, keyring, store).isReady;
}

export const AppContext = createContext<AppState>({} as AppState);

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

  useEffect(() => {
    if (session && store) {
      void initInstance(store, session).then(() => {
        console.log("initInstance", session, store);
        didAccounts.accounts.forEach((account) => {
          allDidDB.set(account.instance.id, new DidDB(account.instance.id));
        });
        setReady(true);
      });
    }
  }, [session, store]);

  useEffect(() => {
    if (ready) {
      void getCTypes().then((res) => {
        if (res.code === 200 && Array.isArray(res.data)) {
          res.data?.forEach((ctype: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            void cacheDB?.cacheCType.put(ctype.rawData);
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
        // accounts,
        didAccounts,
        currentDid: () => didAccounts?.current,
        credentialCard,
      }}
    >
      {children}
    </AppContext.Provider>
  ) : null;
}

export default AppProvider;
