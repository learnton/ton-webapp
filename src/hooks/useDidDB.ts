// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext, useMemo } from "react";

import { DidDB } from "@/utils";

import { AppContext } from "@/context/AppProvider";
export function useDidDB(): DidDB | null | undefined {
  const { allDidDB, currentDid } = useContext(AppContext);
  const did = currentDid();

  return useMemo(() => {
    return did ? allDidDB.get(did.instance.id) : null;
  }, [did, allDidDB]);
}
