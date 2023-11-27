import { isHex } from "@polkadot/util";
import React, { useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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
  showDetails?: boolean;
  to?: string;
  handleQr?: (id: string) => void;
}

function CredentialCard({ attester, ctypeHash, id, templateId }: Props) {
  const { keyring } = useContext(AppContext);

  const navigate = useNavigate();
  const [template] = useTemplate(templateId);
  const [vcTemplate] = useVcTemplate(id);
  const credential = useCredential(id);
  const vc = useDecryptedCredential(credential, keyring.password);

  const handleQr = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();

      id && navigate(`/card/${id}/presentation`);
    },
    [navigate, id]
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
        handleQr={handleQr}
        id={id}
        onClick={() => navigate(`/card/${id}`)}
        template={vcTemplate || template}
        vc={vpVc}
      />
    </div>
  );
}

const MemoComponent = React.memo(CredentialCard);
export default MemoComponent;
