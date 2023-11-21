import type { CacheDB, DidDB, MessageMeta } from "@/utils";
import { get } from "@/api/template";
import { DidAccount } from "@zcloak/wallet-lib";
import { all } from "@/api/message";
export async function insertTempIfNot(db: CacheDB, templateId?: number) {
  if (!templateId) return;

  const count = await db.cacheTemplate.where("id").equals(templateId).count();

  if (count === 0) {
    return get({ id: templateId }).then(({ data }) => {
      data && db.cacheTemplate.put(data);

      return data;
    });
  }
}

async function insertCardIfNot(db: DidDB, message: MessageMeta) {
  const count = await db.cardMessages
    .where({
      id: message.id,
    })
    .count();

  if (count === 0) {
    db.cardMessages.add(message);
  }
}
export function fetchAndSaveMessages(account?: DidAccount, db?: DidDB | null) {
  if (!db) return;
  const receiver = account?.instance.getKeyUrl("keyAgreement");
  if (!receiver) return;
  Promise.all([
    all({
      receiver,
      msgType: "Response_Approve_Attestation",
    }),
    all({ receiver, msgType: "Send_issuedVC" }),
  ]).then(([messages1, messages2]) => {
    messages1.data.forEach((message: any) =>
      insertCardIfNot(db, {
        ...message.rawData,
        templateId: message?.templateId,
      })
    );
    messages2.data.forEach((message: any) =>
      insertCardIfNot(db, {
        ...message.rawData,
        templateId: message?.templateId,
      })
    );
  });
}
