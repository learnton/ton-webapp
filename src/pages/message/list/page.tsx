// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDB, MessageMeta } from "@/utils";
import { addCardRelation, getTemplateById } from "@/utils";
import { DidContext } from "@/context/Did";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Did } from "@zcloak/did";
import { decryptMessage } from "@zcloak/message";
import { vcVerify } from "@zcloak/verify";

import { fetchAndSaveMessages, insertTempIfNot, addVC } from "../_utils";
import { AppContext } from "@/context/AppProvider";
import { AccountName, categoryMap, CTypeName, CARD_TYPE } from "@/components";
import { useCredentials, useDidDB, useLiveQuery } from "@/hooks";

function Cell({
  checked,
  message,
  setChecked,
}: {
  message: MessageMeta;
  checked: string[];
  setChecked: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const isChecked = checked.includes(message.id);
  const { cacheDB } = useContext(AppContext);
  const template = useLiveQuery(
    getTemplateById,
    cacheDB,
    message?.templateId ? [message?.templateId] : null
  );

  return (
    <div className="flex items-center px-2 py-4 gap-2 rounded">
      <input
        type="checkbox"
        className="checkbox"
        checked={isChecked}
        onChange={(e) => {
          if (e.target.checked) {
            setChecked((value) => [...value, message.id]);
          } else {
            setChecked((value) =>
              value.filter((value) => value !== message.id)
            );
          }
        }}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <CTypeName cTypeHash={message.ctype} />
          <span color="text3.primary">
            {moment(message.createTime).format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
        {typeof template?.category === "number" && (
          <span className="badge">
            {categoryMap[template?.category as CARD_TYPE]}
          </span>
        )}
        <span color="text3.primary" className="mt-2">
          Attester: <AccountName showVid value={message.sender} />
        </span>
      </div>
    </div>
  );
}

function PageMessages() {
  const { cacheDB, keyring, resolver } = useContext(AppContext);
  const { did: account } = useContext(DidContext);
  const [checked, setChecked] = useState<string[]>([]);
  const didDB = useDidDB();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

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
    if (account) {
      fetchAndSaveMessages(account, didDB);
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
    if (didDB && account?.instance instanceof Did) {
      setBusy(true);

      for (const message of unImportedMessages) {
        if (checked.includes(message.id)) {
          try {
            const decrypted = await decryptMessage(
              message,
              account.instance,
              resolver
            );

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

              await addCardRelation(didDB, credential?.id, template);
            }
          } catch (error) {
            console.error(error);
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
      didDB?.cardMessages.update(message.id, { isRead: true });
    });
  }, [didDB, messages]);

  return (
    <>
      <div>
        <div>
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setChecked(unImportedMessages.map((message) => message.id));
              } else {
                setChecked([]);
              }
            }}
          />
          Select All
        </div>
        {unImportedMessages.map((message) => (
          <Cell
            checked={checked}
            key={message.id}
            message={message}
            setChecked={setChecked}
          />
        ))}
      </div>
      <div>
        <button
          className="btn"
          disabled={checked.length === 0}
          onClick={confirm}
        >
          {busy && <span className="loading loading-spinner"></span>}
          Decrypt and recover
        </button>
      </div>
    </>
  );
}

export default PageMessages;
