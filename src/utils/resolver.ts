// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  DidDocument,
  DidDocumentWithProof,
  DidUrl,
} from "@zcloak/did-resolver/types";

import type { CacheDB } from "@/utils";

import { DidResolver } from "@zcloak/did-resolver";
import {
  DidNotFoundError,
  ServerResponseError,
} from "@zcloak/did-resolver/errors";

import { getDidDocument, createDid } from "@/api/did";

abstract class BaseResolver extends DidResolver {
  public server: string;
  protected cacheDB: CacheDB;

  constructor(cacheDB: CacheDB, endpoint: string) {
    super();
    this.server = endpoint;
    this.cacheDB = cacheDB;
  }

  public override async resolve(didUrl: string): Promise<DidDocument> {
    const { did } = this.parseDid(didUrl);

    const res = await getDidDocument({ did });

    if (res.code !== 200) {
      throw new ServerResponseError(res.msg);
    }

    if (res.code === 200 && !res.data) {
      throw new DidNotFoundError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return res.data?.rawData;
  }
}

export class ZkDidResolver extends BaseResolver {
  #cache: Record<DidUrl, Promise<DidDocument>> = {};

  public get knownDids(): DidUrl[] {
    const set = new Set<DidUrl>(Object.keys(this.#cache) as DidUrl[]);

    return Array.from(set);
  }

  public override resolve(didUrl: string): Promise<DidDocument> {
    const { did } = this.parseDid(didUrl);

    return super.resolve(did);
  }

  async submitDid(did: DidDocumentWithProof) {
    const res = await createDid(did);

    if (res?.code !== 200) {
      throw new Error(res?.msg || "createDid error");
    }
  }
}
