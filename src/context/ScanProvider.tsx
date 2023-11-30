import React, { createContext, useEffect, useState, useMemo } from "react";
import { isDidUrlArray } from "@/utils";
import { isVpWithTemplate } from "@/pages/card/_components/QrcodePresentation";
import { VerifiablePresentation } from "@zcloak/vc/types";
import { isHex, isNumber } from "@polkadot/util";
import moment from "moment";
import { ClaimContent, ActionModal } from "@/components";
import CredentialCard from "@/pages/card/_components/CredentialCard";
import { QrResultTypes, QrResult } from "@/pages/card/scan/_utils/types";

type ScanResult = [QrResultTypes, QrResult[QrResultTypes]];
export type ScanState = {
  value: ScanResult;
  set: (value: ScanResult) => void;
};

export const ScanContext = createContext<ScanState>({} as unknown as ScanState);

function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scanResult, setScanResult] = useState<ScanResult>(
    [] as unknown as ScanResult
  );
  const [vp, setVp] = useState<VerifiablePresentation>();
  const [templateId, setTemplateId] = useState<number>();
  const [challengeResult, setChallengeResult] = useState<React.ReactNode>();

  // TODO v1 to v2 issuer
  const attester = useMemo(() => {
    return isDidUrlArray(vp?.verifiableCredential[0].issuer)
      ? vp?.verifiableCredential[0].issuer[0]
      : vp?.verifiableCredential[0].issuer;
  }, [vp?.verifiableCredential]);

  useEffect(() => {
    const handleScanResult = (scanResult: ScanResult) => {
      const [type, result] = scanResult;
      if (type === "vp") {
        let _result;

        if (isVpWithTemplate(result)) {
          _result = result.vp;
          setTemplateId(result.templateId);
        } else {
          _result = result as VerifiablePresentation;
        }

        if (!_result.proof.challenge) {
          setChallengeResult(
            <div className="text-xs text-warning">No challenge found</div>
          );
        } else if (isHex(_result.proof.challenge)) {
          setChallengeResult(
            <div className="text-xs text-warning">
              Verifiable Presentation challenge is: ${_result.proof.challenge}
            </div>
          );
        } else if (isNumber(Number(_result.proof.challenge))) {
          if (Date.now() <= Number(_result.proof.challenge) + 60 * 1000) {
            setChallengeResult(
              <div className="text-xs text-success">
                Verifiable Presentation time is:{" "}
                {moment(Number(_result.proof.challenge)).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </div>
            );
          } else {
            setChallengeResult(
              <div className="text-xs text-error">
                Verifiable Presentation is expired:{" "}
                {moment(Number(_result.proof.challenge)).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </div>
            );
          }
        } else {
          setChallengeResult(
            <div className="text-xs text-primary">
              Verifiable Presentation challenge is: ${_result.proof.challenge}
            </div>
          );
        }

        setVp(_result);
      } else if (type === "keys") {
        window.location.href = `${
          import.meta.env.BASE_URL
        }/account/import?state=${JSON.stringify(result)}`;
      }
    };

    scanResult && handleScanResult(scanResult);
  }, [scanResult]);

  return (
    <ScanContext.Provider
      value={{
        value: scanResult,
        set: setScanResult,
      }}
    >
      {children}
      <ActionModal onClose={() => setVp(undefined)} open={!!vp}>
        {challengeResult}
        {vp?.verifiableCredential.map((vc, index) => {
          return (
            <div className="flex mt-4 gap-2" key={index}>
              {/* TODO v1 to v2 issuer */}
              <CredentialCard
                attester={attester}
                ctypeHash={vp?.verifiableCredential?.[0].ctype}
                rootHash={vp?.verifiableCredential?.[0].digest}
                templateId={templateId}
              />
              <ClaimContent contents={vc.credentialSubject} ctype={vc.ctype} />
            </div>
          );
        })}
      </ActionModal>
    </ScanContext.Provider>
  );
}

export default ScanProvider;
