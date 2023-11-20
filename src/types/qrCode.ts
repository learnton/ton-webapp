import type { DidKeys$Json } from "@zcloak/did/keys/types";
import type { VerifiablePresentation } from "@zcloak/vc/types";
import { isJsonObject } from "@polkadot/util";
import { isVP } from "@zcloak/vc/is";

export interface VpWithTemplate {
  vp: VerifiablePresentation;
  templateId: number;
}

export function isVpWithTemplate(input: unknown): input is VpWithTemplate {
  return isJsonObject(input)
    ? isVP(input?.vp) && Number.isInteger(input?.templateId)
    : false;
}

export interface QrResult {
  raw: string;
  url: string;
  vp: VerifiablePresentation | VpWithTemplate;
  keys: DidKeys$Json;
  parts: string[];
}

export type QrResultTypes = keyof QrResult;

export interface QrHandleResult {
  (type: QrResultTypes, result: QrResult[QrResultTypes]): void;
}

export interface QrScannerProps {
  onClose: () => void;
  onResult: QrHandleResult;
}
