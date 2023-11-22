// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CacheCType, CacheDB } from "@/utils";

import { useContext } from "react";

import { AppContext } from "@/context/AppProvider";
import { useLiveQuery } from "./useLiveQuery";

function allCacheCTypes(cacheDB: CacheDB): Promise<CacheCType[]> {
  return cacheDB.cacheCType.toArray();
}

function getCacheCType(
  cacheDB: CacheDB,
  id?: string | null
): Promise<CacheCType | undefined> {
  if (id) {
    return cacheDB.cacheCType.get(id);
  }

  return Promise.resolve(undefined);
}

export function useCtypes() {
  const { cacheDB } = useContext(AppContext);
  const serverCTypes = useLiveQuery(allCacheCTypes, cacheDB);

  return serverCTypes;
}

export function useCtype(id?: string | null): CacheCType | undefined {
  const { cacheDB } = useContext(AppContext);

  return useLiveQuery(getCacheCType, cacheDB, id ? [id] : undefined);
}
