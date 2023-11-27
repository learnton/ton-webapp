// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerifiablePresentation } from "@zcloak/vc/types";

import { isJsonObject } from "@polkadot/util";
import { useCallback, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { Did } from "@zcloak/did";
import { VerifiablePresentationBuilder } from "@zcloak/vc";

import CredentialCard from "../../_components/CredentialCard";
import QrcodePresentation from "../../_components/QrcodePresentation";
import { useCredential, useDecryptedCredential, useVcTemplate } from "@/hooks";
import { AppContext } from "@/context/AppProvider";
import { DidContext } from "@/context/Did";

import Selective from "./Selective";

function Presentation() {
  const { keyring } = useContext(AppContext);
  const { didAccounts } = useContext(DidContext);
  const account = didAccounts?.current;
  const { id } = useParams();
  const credential = useCredential(id);
  const vc = useDecryptedCredential(credential, keyring.password);
  const [selective, setSelective] = useState<string[]>([]);
  const [vp, setVp] = useState<VerifiablePresentation>();
  const [template] = useVcTemplate(id);

  const handleClick = useCallback(() => {
    if (vc && account?.instance instanceof Did) {
      const vpBuilder = new VerifiablePresentationBuilder(account.instance);

      vpBuilder.addVC(vc, "VP_SelectiveDisclosure", selective);

      const challenge = `${Date.now()}`;

      void vpBuilder.build(undefined, challenge).then(setVp);
    }
  }, [account, selective, vc]);

  return (
    <div className="bg-[#f0f0f5]">
      <div>
        <div className="p-2">
          <div className="mb-2">Please Selective Disclosure.</div>
          <CredentialCard
            attester={credential?.attester?.[0]}
            ctypeHash={credential?.ctypeHash}
            encoded={credential?.encoded}
            id={credential?.id}
            rootHash={credential?.rootHash}
          />
          {vc && isJsonObject(vc.credentialSubject) && (
            <Selective
              onChange={setSelective}
              subject={vc.credentialSubject}
              value={selective}
            />
          )}
        </div>
      </div>
      <div>
        <button className="btn btn-block" onClick={handleClick}>
          Generate QR Code
        </button>
      </div>
      <QrcodePresentation
        isParts
        onClose={() => setVp(undefined)}
        open={!!vp}
        presentation={vp}
        templateId={template?.id}
      />
    </div>
  );
}

export default Presentation;
