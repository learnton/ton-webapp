// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HexString } from '@zcloak/crypto/types';

import { CacheTemplate } from '../cache-template';
import { CacheDB, DidDB } from '../db';

export async function getTemplateById(cacheDB: CacheDB, templateId?: number): Promise<CacheTemplate | undefined> {
  if (!templateId) return Promise.resolve(undefined);

  const data = await cacheDB.cacheTemplate.where('id').equals(templateId).toArray();

  return data?.[0];
}

export function getTemplateByMongoId(cacheDB: CacheDB, _id?: string): Promise<CacheTemplate | undefined> {
  if (!_id) return Promise.resolve(undefined);

  return cacheDB.cacheTemplate.get(_id);
}

export async function getVcTemplate(cacheDB: CacheDB, didDB: DidDB, id: HexString | string) {
  const vtr = await didDB.cardTemplateRelation.get(id);

  return getTemplateByMongoId(cacheDB, vtr?.template_id);
}
