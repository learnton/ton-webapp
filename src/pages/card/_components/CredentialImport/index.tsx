// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerifiableCredential } from "@zcloak/vc/types";

import { isHex, stringToU8a, u8aConcat, u8aToHex } from "@polkadot/util";
import { useCallback, useContext, useEffect, useState } from "react";

import { isSameUri } from "@zcloak/did/utils";
import { calcRoothash } from "@zcloak/vc";
import { isPrivateVC, isVC } from "@zcloak/vc/is";
import { vcVerify } from "@zcloak/verify";

import { isWrapVc } from "./util";
import { WarpVcWithTemplate } from "@/types";
import { AppContext } from "@/context/AppProvider";
import { useDidDB, useShort, useTemplate, useToggle } from "@/hooks";
import { useToast, cardBgConfig, ActionModal } from "@/components";
import {
  scrypt,
  addCardRelation,
  type DidDB,
  type ZkCredential,
} from "@/utils";

import CredentialEdit from "./CredentialEdit";
import ImportVcFile from "./ImportVcFile";

// eslint-disable-next-line react-refresh/only-export-components
export async function addVC(
  didDB: DidDB,
  vc: VerifiableCredential<boolean> | null | undefined,
  password: string | null,
  boundedMessageId?: string
): Promise<ZkCredential | null> {
  if (!vc) return null;

  if (isHex(vc.credentialSubject)) {
    throw new Error("The vc subject is not an object");
  }

  const { rootHash } = isPrivateVC(vc)
    ? calcRoothash(
        vc.credentialSubject,
        vc.hasher[0],
        vc.version,
        vc.credentialSubjectNonceMap
      )
    : calcRoothash(vc.credentialSubject, vc.hasher[0], vc.version);

  const exists = await didDB.zkCredential
    .filter(
      (credential) =>
        credential.digest === vc.digest && credential.attester === vc.issuer
    )
    .first();

  if (exists) {
    return null;
  }

  const encrypted = scrypt.vcEncrypt(vc, password ?? undefined);
  const id = u8aToHex(u8aConcat(vc.digest, stringToU8a(vc.issuer.toString())));
  const issuers = Array.isArray(vc.issuer) ? vc.issuer : [vc.issuer];

  const credential: ZkCredential = {
    id,
    version: 0,
    source: "ZKID",
    digest: vc.digest,
    rootHash,
    ctypeHash: vc.ctype,
    attester: issuers,
    owner: vc.holder,
    hasher: vc.hasher,
    issuanceDate: vc.issuanceDate,
    expirationDate: vc.expirationDate,
    encoded: u8aToHex(encrypted),
    boundedMessageId,
  };

  await didDB.zkCredential.put(credential);

  return credential;
}

const ImportVc = ({
  onClose,
  open,
}: {
  onReject?: () => void;
  onConfirm?: () => void;
  open: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();

  const { credentialCard, keyring, didAccounts } = useContext(AppContext);
  const account = didAccounts.current;
  const didDB = useDidDB();
  const [file, setFile] = useState<File>();
  const [credential, setCredential] = useState<
    VerifiableCredential<boolean> | undefined
  >();
  const [templateId, setTemplateId] = useState<number>();
  const [alias, setAlias] = useState<string>();
  const [bg, setBg] = useState<string>(
    cardBgConfig.filter((item) => item.default)[0].bg
  );
  const [loading, toggleLoading] = useToggle();

  const [template] = useTemplate(templateId);

  const { shortHash } = useShort();

  const onConfirm = useCallback(async () => {
    if (!credential) return;
    if (!alias) return;
    if (!didDB) return;

    toggleLoading();

    const id = u8aToHex(
      u8aConcat(credential.digest, stringToU8a(credential.issuer.toString()))
    );

    await credentialCard.store({ rootHash: id, alias, bg });

    await addVC(didDB, credential, keyring.password).catch((err) => {
      toast &&
        toast({
          type: "error",
          message: (err as Error).message,
        });
    });

    await addCardRelation(didDB, id, template);

    toggleLoading();
    onClose();
  }, [
    credential,
    alias,
    didDB,
    toggleLoading,
    credentialCard,
    bg,
    keyring.password,
    template,
    onClose,
    toast,
  ]);

  const onReject = useCallback(() => {
    onClose();
  }, [onClose]);

  async function handleJsonFile(
    file: File
  ): Promise<VerifiableCredential<boolean> | WarpVcWithTemplate> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = function (e: ProgressEvent<FileReader>) {
        e.target &&
          e.target.result &&
          resolve(
            JSON.parse(e.target.result as string) as
              | VerifiableCredential<boolean>
              | WarpVcWithTemplate
          );
      };
    });
  }

  useEffect(() => {
    void (async (): Promise<unknown> => {
      if (!file || !account) return;
      const data = await handleJsonFile(file);
      const notifyError = (message: string) => {
        toast &&
          toast({
            type: "error",
            message,
          });
      };
      let vc: VerifiableCredential<boolean>;

      // check warp vc with template
      if (isWrapVc(data)) {
        vc = data.credential;

        setTemplateId(data.templateId);
      } else {
        vc = data;
      }

      if (!account.instance) {
        return notifyError("Please use did account.");
      }

      if (!isVC(vc)) {
        return notifyError("Not a valid credential file.");
      }

      // check the [[VC]] is verified

      if (!(await vcVerify(vc))) {
        return notifyError("verify not pass");
      }

      if (!isSameUri(account.instance.id, vc.holder)) {
        return notifyError("Not your credential.");
      }

      setCredential(vc);
      setAlias(shortHash(vc.digest));
    })();
  }, [file, account, shortHash, toast]);

  return (
    <ActionModal onClose={onClose} open={open}>
      <div className="py-4">
        {!credential ? (
          <ImportVcFile setFile={setFile} />
        ) : (
          <CredentialEdit
            alias={alias}
            bg={bg}
            credential={credential}
            loading={loading}
            onConfirm={() => void onConfirm()}
            onReject={onReject}
            setAlias={setAlias}
            setBg={setBg}
            templateId={templateId}
          />
        )}
      </div>
    </ActionModal>
  );
};

export default ImportVc;
