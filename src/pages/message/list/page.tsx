/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */

import type { DidDB, MessageMeta } from "@/utils";
import { addCardRelation, getTemplateById } from "@/utils";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { decryptMessage } from "@zcloak/message";
import { vcVerify } from "@zcloak/verify";
import { useToast } from "@/components";
import { fetchAndSaveMessages, insertTempIfNot, addVC } from "../_utils";
import { AppContext } from "@/context/AppProvider";
import { useCredentials, useDidDB, useLiveQuery } from "@/hooks";
import Cell from "./_cell";

function PageMessages() {
  const { cacheDB, keyring, resolver, didAccounts } = useContext(AppContext);
  const account = didAccounts.current;
  const [checked, setChecked] = useState<string[]>([]);
  const didDB = useDidDB();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const messages = useLiveQuery(
    function getMessages(db: DidDB): Promise<MessageMeta[]> {
      return db.cardMessages.orderBy("createTime").reverse().toArray();
    },
    didDB,
    []
  );

  const credentials = useCredentials();

  useEffect(() => {
    if (messages) {
      messages.forEach((m) => insertTempIfNot(cacheDB, m?.templateId));
    }
  }, [messages, cacheDB]);

  useEffect(() => {
    if (account && didDB) {
      void fetchAndSaveMessages(account, didDB);
    }
  }, [account, didDB]);

  const unImportedMessages = useMemo(() => {
    const _messages: MessageMeta[] = [];

    messages?.forEach((message) => {
      if (
        !credentials?.find((value) => value.boundedMessageId === message.id)
      ) {
        _messages.push(message);
      }
    });

    return _messages;
  }, [credentials, messages]);

  const confirm = async () => {
    if (didDB && account) {
      setBusy(true);
      for (const message of unImportedMessages) {
        if (checked.includes(message.id)) {
          try {
            const decrypted = await decryptMessage(
              message,
              account.instance,
              resolver
            );
            console.log(decrypted);
            if (await vcVerify(decrypted.data)) {
              const credential = await addVC(
                didDB,
                decrypted.data,
                keyring.password,
                message.id
              );

              const template = await getTemplateById(
                cacheDB,
                message?.templateId
              );
              console.log(didDB, credential, template);
              await addCardRelation(didDB, credential?.id, template);
            }
          } catch (error) {
            toast &&
              toast({
                type: "error",
                message: (error as Error).message || "Decrypt error",
              });
          }
        }
      }

      setChecked([]);
      setBusy(false);
      navigate(-1);
    }
  };

  useEffect(() => {
    messages?.forEach((message) => {
      void didDB?.cardMessages.update(message.id, { isRead: true });
    });
  }, [didDB, messages]);

  return (
    <div className="pt-12 pb-20">
      <div className="fixed left-0 top-0 w-full p-4 bg-body">
        <h1 className="leading-loose font-bold text-xl">Message Center</h1>
      </div>
      <div>
        {unImportedMessages.map((message) => (
          <Cell
            checked={checked}
            key={message.id}
            message={message}
            setChecked={setChecked}
          />
        ))}
      </div>
      <div className="fixed left-0 bottom-0 w-full flex items-center p-4 bg-white gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-xs checkbox-primary"
            onChange={(e) => {
              if (e.target.checked) {
                setChecked(unImportedMessages.map((message) => message.id));
              } else {
                setChecked([]);
              }
            }}
          />
          Select All
        </label>
        <button
          className="btn btn-primary flex-1"
          disabled={checked.length === 0}
          onClick={() => !busy && confirm()}
        >
          {busy && <span className="loading loading-spinner"></span>}
          Decrypt and recover
        </button>
      </div>
    </div>
  );
}

export default PageMessages;
