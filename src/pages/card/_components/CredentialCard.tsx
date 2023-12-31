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
import { useNavigate } from "react-router-dom";

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
  const vc = useDecryptedCredential(credential, keyring.password || undefined);
  const navigate = useNavigate();
  const handleQr = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();

      id && navigate(`/card/${id}/presentation`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        onClick={() => linkToDetail && navigate(`/card/${id}`)}
        template={vcTemplate || template}
        vc={vpVc}
      />
    </div>
  );
}

const MemoComponent = React.memo(CredentialCard);
export default MemoComponent;
