import type { DidKeys$Json } from "@zcloak/did/keys/types";
import type { QrResult, QrResultTypes } from "@/types";
import { isVpWithTemplate } from "@/types";
import { isJsonObject } from "@polkadot/util";

import { isVP } from "@zcloak/vc/is";

import { isDomain, isUrl } from "./helper";

export const extraResult = function (
  data: string,
  onDone: (result: [QrResultTypes, QrResult[QrResultTypes]]) => void,
  onProgress: (progress: number) => void,
  addParts?: (part: {
    index: number;
    length: number;
    value: string;
  }) => string[]
): void {
  try {
    const json = JSON.parse(data);

    if (
      isJsonObject(json) &&
      json.hasOwnProperty("didUrl") &&
      json.hasOwnProperty("version") &&
      json.hasOwnProperty("identifierKey") &&
      json.hasOwnProperty("keys") &&
      json.hasOwnProperty("authentication") &&
      json.hasOwnProperty("assertionMethod") &&
      json.hasOwnProperty("keyAgreement") &&
      json.hasOwnProperty("capabilityInvocation") &&
      json.hasOwnProperty("capabilityDelegation")
    ) {
      onProgress(1);
      onDone(["keys", json as DidKeys$Json]);
    } else if (isVP(json) || isVpWithTemplate(json)) {
      onProgress(1);
      onDone(["vp", json]);
    } else if (
      json.hasOwnProperty("length") &&
      json.hasOwnProperty("index") &&
      json.hasOwnProperty("value")
    ) {
      if (addParts) {
        const parts = addParts(json);

        onProgress(parts.join("").length / json.length);

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
