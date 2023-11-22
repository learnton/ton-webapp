import { CacheTemplate } from "../cache-template";
import { CacheDB, DidDB } from "../db";

export async function getTemplateById(
  cacheDB: CacheDB,
  templateId?: number
): Promise<CacheTemplate | undefined> {
  if (!templateId) return Promise.resolve(undefined);

  const data = await cacheDB.cacheTemplate
    .where("id")
    .equals(templateId)
    .toArray();

  return data?.[0];
}

export function getTemplateByMongoId(
  cacheDB: CacheDB,
  _id?: string
): Promise<CacheTemplate | undefined> {
  if (!_id) return Promise.resolve(undefined);

  return cacheDB.cacheTemplate.get(_id);
}

export async function getVcTemplate(
  cacheDB: CacheDB,
  didDB: DidDB,
  id: string
) {
  const vtr = await didDB.cardTemplateRelation.get(id);

  return getTemplateByMongoId(cacheDB, vtr?.template_id);
}
