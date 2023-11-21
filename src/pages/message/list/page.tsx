// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDB, MessageMeta } from "@/utils";
import { addCardRelation, getTemplateById } from "@/utils";

import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Did } from "@zcloak/did";
import { decryptMessage } from "@zcloak/message";
import { vcVerify } from "@zcloak/verify";

import { fetchAndSaveMessages, insertTempIfNot, addVC } from "../_utils";

import {
  AccountName,
  AccountsContext,
  AppContext,
  categoryMap,
  CTypeName,
  useCredentials,
  useDidDB,
  useLiveQuery,
} from "@zkid-wallet/react";

function getMessages(db: DidDB): Promise<MessageMeta[]> {
  return db.cardMessages.orderBy("createTime").reverse().toArray();
}

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
    <div
      alignItems="center"
      bgcolor="background.paper"
      direction="row"
      px={1.5}
      py={2}
      spacing={0.5}
      sx={{ borderRadius: "10px" }}
    >
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
        sx={{ fontSize: "1.25rem" }}
      />
      <div flex="1">
        <div alignItems="center" direction="row" justifyContent="space-between">
          <CTypeName cTypeHash={message.ctype} />
          <span color="text3.primary">
            {moment(message.createTime).format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
        {typeof template?.category === "number" && (
          <Chip
            label={categoryMap[template?.category]}
            size="small"
            sx={({ palette }) => ({
              borderRadius: "4px",
              borderColor: palette.primary.main,
              color: palette.primary.main,
            })}
            variant="outlined"
          />
        )}
        <span color="text3.primary" mt={1}>
          Attester: <AccountName showVid value={message.sender} />
        </span>
      </div>
    </div>
  );
}

function PageMessages() {
  const { cacheDB, keyring, resolver } = useContext(AppContext);
  const { account } = useContext(AccountsContext);
  const [checked, setChecked] = useState<string[]>([]);
  const didDB = useDidDB();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const messages = useLiveQuery(getMessages, didDB, []);

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
    <div bgcolor="background.default">
      <div>
        <div spacing={2}>
          <div>
            Select All
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
      </div>
      <div bgcolor="background.paper">
        <button
          className="btn"
          disabled={checked.length === 0}
          onClick={confirm}
        >
          {busy && <span className="loading loading-spinner"></span>}
          Decrypt and recover
        </button>
      </div>
    </div>
  );
}

export default PageMessages;
