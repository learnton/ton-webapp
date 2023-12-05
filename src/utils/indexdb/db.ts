// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuthorizeSite } from "./authorize-site";
import type { CacheCType } from "./cache-ctype";
import type { CacheDid } from "./cache-did";
import type { ProofHistory, ShowHistory } from "./credential-history";
import type { ExplorerFavorite } from "./explorer-favorite";
import type { ExplorerHistory } from "./explorer-history";
import type { MessageMeta } from "./message-meta";
import type { ZkCredential } from "./zk-credential";

import Dexie, { Table } from "dexie";

import { CacheTemplate } from "./cache-template";
import { CardTemplateRelation } from "./card-template";
import { TransactionMeta } from "./transaction";

const prefix = "";

export class AuthDB extends Dexie {
  public authorize!: Table<AuthorizeSite>;

  constructor() {
    super(`${prefix}Authorize_Site`);
    this.version(1).stores({
      authorize: "++id, updateTime, website, createTime",
    });
  }
}

export class CacheDB extends Dexie {
  public cacheDid!: Table<CacheDid>;
  public cacheCType!: Table<CacheCType>;
  public cacheTemplate!: Table<CacheTemplate>;
  public explorerHistorys!: Table<ExplorerHistory>;
  public explorerFavorites!: Table<ExplorerFavorite>;

  constructor() {
    super(`${prefix}zkid:wallet:cache`);
    this.version(2).stores({
      cacheDid: "&did, *document",
      cacheCType:
        "&$id, $schema, publisher, signature, title, description, type, *properties, *required",
      cacheTemplate:
        "&_id, id, desc, title, issuer, public, duration, background, logo, ctypeHash, creator, category, color, applications, trending, createdTime",
      explorerHistorys: "&url, origin, title, icon",
      explorerFavorites: "&origin, url, title, icon",
    });
  }
}

export class DidDB extends Dexie {
  public credential!: Table<Credential>;
  public zkCredential!: Table<ZkCredential>;
  public showHistory!: Table<ShowHistory>;
  public proofHistory!: Table<ProofHistory>;
  public messages!: Table<MessageMeta>;
  public cardMessages!: Table<MessageMeta>;
  public cardTemplateRelation!: Table<CardTemplateRelation>;
  public transactionMeta!: Table<TransactionMeta>;

  constructor(name: string) {
    super(`${prefix}credential-db-${name}`);
    this.version(5)
      .stores({
        credential: "&rootHash, updateTime",
        zkCredential:
          "&id, digest, rootHash, ctypeHash, attester, owner, *hasher, issuanceDate, expirationDate, source, version, encoded, boundedMessageId, issuers",
        proofHistory: "++id,rootHash, createTime",
        showHistory: "++id, rootHash, createTime",
        messages:
          "&id, reply, createTime, version, msgType, sender, receiver, ctype, encryptedMsg, isRead",
        cardMessages:
          "&id, reply, createTime, version, msgType, sender, receiver, ctype, encryptedMsg, isRead, templateId",
        cardTemplateRelation: "&id, templateId, category, template_id, title",
        transactionMeta:
          "&id, hash, to, data, value, nonce, gasLimit, gasPrice, chainId",
      })
      .upgrade((tx) => {
        return tx
          .table("zkCredential")
          .toCollection()
          .modify((item: ZkCredential) => {
            if (!Array.isArray(item.attester)) {
              item.attester = [item.attester];
            }
          });
      });
  }
}
