// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerifiableCredential } from "@zcloak/vc/types";

import { useMemo } from "react";

import { cardBgConfig, OperationButtons } from "@/components";
import { isDidUrlArray } from "@/utils";

import CardWithBg from "./CardWithBg";

const CredentialEdit: React.FC<{
  credential: VerifiableCredential<boolean>;
  alias?: string;
  templateId?: number;
  setAlias: (alias: string) => void;
  bg: string;
  setBg: (bg: string) => void;
  onReject: () => void;
  onConfirm: () => void;
  loading: boolean;
}> = ({
  alias,
  bg,
  credential,
  loading,
  onConfirm,
  onReject,
  setBg,
  templateId,
}) => {
  // TODO v1 to v2 issuer
  const attester = useMemo(() => {
    return isDidUrlArray(credential.issuer)
      ? credential.issuer[0]
      : credential.issuer;
  }, [credential.issuer]);

  return (
    <div>
      <div className="text-lg font-rubik font-medium text-center mb-4">
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
      <div className="my-2 flex items-center gap-2 mt-4">
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
