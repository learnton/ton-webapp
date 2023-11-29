// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerifiablePresentation } from "@zcloak/vc/types";

import { isJsonObject } from "@polkadot/util";
import { useCallback, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { VerifiablePresentationBuilder } from "@zcloak/vc";

import CredentialCard from "../../_components/CredentialCard";
import QrcodePresentation from "../../_components/QrcodePresentation";
import { useCredential, useDecryptedCredential, useVcTemplate } from "@/hooks";
import { AppContext } from "@/context/AppProvider";

import Selective from "../../_components/Selective";

function Presentation() {
  const { keyring, didAccounts } = useContext(AppContext);
  const account = didAccounts?.current;
  const { id } = useParams();
  const credential = useCredential(id);
  const vc = useDecryptedCredential(credential, keyring.password);
  const [selective, setSelective] = useState<string[]>([]);
  const [vp, setVp] = useState<VerifiablePresentation>();
  const [template] = useVcTemplate(id);

  const handleClick = useCallback(() => {
    if (vc && account?.instance) {
      const vpBuilder = new VerifiablePresentationBuilder(account.instance);
      vpBuilder.addVC(vc, "VP_SelectiveDisclosure", selective);

      const challenge = `${Date.now()}`;
      void vpBuilder.build(undefined, challenge).then(setVp);
    } else {
      console.warn("vc=", vc, "account=", account);
    }
  }, [account, selective, vc]);

  return (
    <div className="flex flex-col h-[100vh] py-4">
      <div className="flex-1 overflow-auto">
        <div className="mb-4 font-rubik text-[#555f79]">
          Please Selective Disclosure.
        </div>
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
      <button className="btn btn-block btn-primary" onClick={handleClick}>
        Generate QR Code
      </button>

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
