// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerifiableCredential } from "@zcloak/vc/types";

import { useMemo } from "react";

import { cardBgConfig, OperationButtons } from "@/components";
import { isDidUrlArray } from "@/utils";

import CardWithBg from "./CardWithBg";

type Props = {
  credential: VerifiableCredential<boolean>;
  alias?: string;
  templateId?: number;
  setAlias: (alias: string) => void;
  bg: string;
  setBg: (bg: string) => void;
  onReject: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const CredentialEdit = ({
  alias,
  bg,
  credential,
  loading,
  onConfirm,
  onReject,
  setBg,
  templateId,
}: Props) => {
  // TODO v1 to v2 issuer
  const attester = useMemo(() => {
    return isDidUrlArray(credential.issuer)
      ? credential.issuer[0]
      : credential.issuer;
  }, [credential.issuer]);

  return (
    <div>
      <div className="font-rubik font-medium text-lg text-center mb-4">
        Import Credential
      </div>
      <CardWithBg
        alias={alias}
        attester={attester}
        bg={bg}
        bgConfig={cardBgConfig}
        setBg={setBg}
        templateId={templateId}
      />
      <div className="flex my-2 mt-4 gap-2 items-center">
        <OperationButtons
          cancel={onReject}
          cancelText="Cancel"
          confirm={onConfirm}
          confirmText="Confirm"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CredentialEdit;
