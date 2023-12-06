// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import assert from "assert";
import { BaseTempProps } from "@/components";

import { getPublish } from "@zcloak/ctype";
import { BaseCType, CType } from "@zcloak/ctype/types";
import { Did } from "@zcloak/did";
import { DidUrl } from "@zcloak/did-resolver/types";
import { batchEncryptMessage, encryptMessage } from "@zcloak/message";
import { Message, MessageData, MessageType } from "@zcloak/message/types";
import { VerifiableCredentialBuilder } from "@zcloak/vc";
import { RawCredential, VerifiableCredential } from "@zcloak/vc/types";

import { resolver } from "./resolver";

export const signCTpye = async (
  base?: BaseCType | null,
  publisher?: Did | null
): Promise<CType> => {
  assert(publisher, "No publisher did provided");
  assert(base, "No BaseType provided");

  const ctype = getPublish(base, publisher);

  return Promise.resolve(ctype);
};

export const signAndBuildVc = async (
  rawCredential: RawCredential,
  template?: BaseTempProps,
  ctype?: CType,
  sender?: Did | null
): Promise<VerifiableCredential<false>> => {
  assert(sender, "No sender did provided");

  assert(ctype, "ctype not found");

  assert(template, "template not found");

  const expireTime =
    template.duration === -1 ? null : Date.now() + template.duration;

  const builder = VerifiableCredentialBuilder.fromRawCredential(
    rawCredential,
    ctype
  ).setExpirationDate(expireTime);

  const vc = builder.build(sender);

  return Promise.resolve(vc as unknown as VerifiableCredential<false>);
};

export const batchSignAndBuildVc = async (
  rawCredentials: RawCredential[],
  template?: BaseTempProps,
  ctype?: CType,
  sender?: Did | null
): Promise<VerifiableCredential<boolean>[]> => {
  assert(sender, "No sender did provided");

  assert(ctype, "ctype not found");

  assert(template, "template not found");

  const expireTime =
    template.duration === -1 ? null : Date.now() + template.duration;

  const builders = rawCredentials.map((raw) => {
    return VerifiableCredentialBuilder.fromRawCredential(
      raw,
      ctype
    ).setExpirationDate(expireTime);
  });

  const vcs = await VerifiableCredentialBuilder.batchBuild(builders, sender);

  return vcs;
};

export const encrypt = async function <T extends MessageType>(
  type: T,
  data?: MessageData[T] | null,
  sender?: Did | null,
  receiver?: Did | null,
  reply?: string
): Promise<Message<T>> {
  assert(data, "No data provided");
  assert(sender, "No sender did provided");
  assert(receiver, "No receiver did provided");

  const encrypted = await encryptMessage<T>(
    type,
    data,
    sender,
    receiver.getKeyUrl("keyAgreement"),
    reply,
    resolver
  );

  return encrypted;
};

export const batchEncrypt = async function (
  data: VerifiableCredential<boolean>[],
  receivers: DidUrl[],
  sender?: Did | null,
  reply?: string
): Promise<Message<"Send_issuedVC">[]> {
  assert(sender, "No sender did provided");

  const encrypted = await batchEncryptMessage(data, sender, receivers, reply);

  return encrypted;
};
