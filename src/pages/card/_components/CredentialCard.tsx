import { isHex } from "@polkadot/util";
import React, { useCallback, useContext, useMemo } from "react";

import { isDidUrl } from "@zcloak/did";

import {
  useCredential,
  useDecryptedCredential,
  useTemplate,
  useVcTemplate,
} from "@/hooks";
import { AppContext } from "@/context/AppProvider";
import { BaseCard } from "@/components";

interface Props {
  id?: string;
  templateId?: number;
  encoded?: string;
  ctypeHash?: string;
  attester?: string;
  rootHash?: string;
  linkToDetail?: boolean;
  to?: string;
  showProof?: boolean;
}

function CredentialCard({
  attester,
  ctypeHash,
  id,
  templateId,
  showProof,
  linkToDetail,
}: Props) {
  const { keyring } = useContext(AppContext);

  const [template] = useTemplate(templateId);
  const [vcTemplate] = useVcTemplate(id);
  const credential = useCredential(id);
  const vc = useDecryptedCredential(credential, keyring.password);

  const handleQr = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();

      id &&
        (window.location.href = `${
          import.meta.env.BASE_URL
        }/card/${id}/presentation`.replace("//", "/"));
    },
    [id]
  );

  const vpVc = useMemo(() => {
    const _vc = Object.assign({}, vc);

    if (isHex(ctypeHash)) {
      _vc.ctype = ctypeHash;
    }

    if (isDidUrl(attester)) {
      _vc.issuer = attester;
    }

    return _vc;
  }, [vc, ctypeHash, attester]);

  return (
    <div className="mb-3">
      <BaseCard
        handleQr={showProof ? handleQr : undefined}
        id={id}
        onClick={() =>
          linkToDetail &&
          (window.location.href = `${
            import.meta.env.BASE_URL
          }/card/${id}`.replace("//", "/"))
        }
        template={vcTemplate || template}
        vc={vpVc}
      />
    </div>
  );
}

const MemoComponent = React.memo(CredentialCard);
export default MemoComponent;
