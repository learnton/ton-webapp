// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from "react";

import { HexString } from "@zcloak/crypto/types";
import { DidUrl } from "@zcloak/did-resolver/types";

import { type DidDB, getIdsByCategory, type ZkCredential } from "@/utils";

import { CARD_TYPE } from "../components";
import { useDidDB } from "./useDidDB";
import { useLiveQuery } from "./useLiveQuery";

function getCredentials(didDB: DidDB): Promise<ZkCredential[]> {
  return didDB.zkCredential.orderBy("issuanceDate").reverse().toArray();
}

function getCredential(
  didDB: DidDB,
  id: string
): Promise<ZkCredential | undefined> {
  return didDB.zkCredential.get(id);
}

async function getBulkCredentials(
  didDB: DidDB,
  category?: CARD_TYPE
): Promise<ZkCredential[]> {
  const ids = await getIdsByCategory(didDB, category);

  const vcs = await didDB.zkCredential.bulkGet(ids);

  return vcs.filter((item) => item !== undefined) as ZkCredential[];
}

export function useCredential(id?: string) {
  const didDB = useDidDB();

  return useLiveQuery(getCredential, didDB, id ? [id] : null);
}

export function useCredentials(): ZkCredential[] | undefined {
  const didDB = useDidDB();

  return useLiveQuery(getCredentials, didDB, []);
}

export function useCredentialByCate(
  category?: CARD_TYPE
): ZkCredential[] | undefined {
  const didDB = useDidDB();

  return useLiveQuery(getBulkCredentials, didDB, [category]);
}

export function useCredentialFilter(
  ctype?: HexString,
  attester?: DidUrl,
  digest?: HexString
): ZkCredential[] | undefined {
  const credentials = useCredentials();

  return useMemo(
    () =>
      digest
        ? credentials?.filter((item) => item.digest === digest)
        : credentials?.filter((item) => {
            // TODO v1 to v2 issuer
            if (ctype && attester) {
              return (
                item.ctypeHash === ctype && item.attester.includes(attester)
              );
            } else if (ctype) {
              return item.ctypeHash === ctype;
            } else if (attester) {
              return item.attester.includes(attester);
            } else {
              return true;
            }
          }),
    [attester, credentials, ctype, digest]
  );
}
