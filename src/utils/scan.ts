import type { DidKeys$Json } from "@zcloak/did/keys/types";
import type { QrResult, QrResultTypes } from "@/types";
import { isVpWithTemplate } from "@/types";
import { isJsonObject } from "@polkadot/util";

import { isVP } from "@zcloak/vc/is";

import { isDomain, isUrl } from "./helper";

type addPartsParam = {
  index: number;
  length: number;
  value: string;
};

export const extraResult = function (
  data: string,
  onDone: (result: [QrResultTypes, QrResult[QrResultTypes]]) => void,
  onProgress: (progress: number) => void,
  addParts?: (part: addPartsParam) => string[]
): void {
  try {
    const json = JSON.parse(data) as Record<string, unknown>;

    if (
      isJsonObject(json) &&
      Object.prototype.hasOwnProperty.call(json, "didUrl") &&
      Object.prototype.hasOwnProperty.call(json, "version") &&
      Object.prototype.hasOwnProperty.call(json, "identifierKey") &&
      Object.prototype.hasOwnProperty.call(json, "keys") &&
      Object.prototype.hasOwnProperty.call(json, "authentication") &&
      Object.prototype.hasOwnProperty.call(json, "assertionMethod") &&
      Object.prototype.hasOwnProperty.call(json, "keyAgreement") &&
      Object.prototype.hasOwnProperty.call(json, "capabilityInvocation") &&
      Object.prototype.hasOwnProperty.call(json, "capabilityDelegation")
    ) {
      onProgress(1);
      onDone(["keys", json as unknown as DidKeys$Json]);
    } else if (isVP(json) || isVpWithTemplate(json)) {
      onProgress(1);
      onDone(["vp", json]);
    } else if (
      Object.prototype.hasOwnProperty.call(json, "length") &&
      Object.prototype.hasOwnProperty.call(json, "index") &&
      Object.prototype.hasOwnProperty.call(json, "value")
    ) {
      if (addParts) {
        const parts = addParts(json as addPartsParam);

        onProgress(parts.join("").length / (json.length as number));

        if (parts.join("").length === json.length) {
          extraResult(parts.join(""), onDone, onProgress);
        }
      }
    }
  } catch {
    if (isDomain(data) || isUrl(data)) {
      onProgress(1);
      onDone(["url", data]);
    } else {
      onDone(["raw", data]);
    }
  }
};
