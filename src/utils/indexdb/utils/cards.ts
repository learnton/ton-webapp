/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { HexString } from "@zcloak/crypto/types";

import { CARD_TYPE } from "@/components";

import { CacheTemplate } from "../cache-template";
import { DidDB } from "../db";

export async function addCardRelation(
  didDB: DidDB,
  id?: HexString,
  template?: CacheTemplate
) {
  console.log("addCardRelation", id, template);
  if (id && template) {
    const count = await didDB.cardTemplateRelation.where({ id }).count();

    if (count === 0) {
      await didDB.cardTemplateRelation.put({
        id,
        templateId: template.id,
        template_id: template._id,
        category: template.category,
      });
    }
  }
}

export async function getIdsByCategory(didDB: DidDB, category?: CARD_TYPE) {
  if (typeof category !== "number") return [];

  const data = await didDB.cardTemplateRelation.where({ category }).toArray();

  return data.map((item) => item.id);
}
