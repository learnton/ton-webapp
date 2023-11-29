import { isJsonObject, isNumber } from "@polkadot/util";
import { WarpVcWithTemplate } from "@/types";
import { isVC } from "@zcloak/vc/is";

export function isWrapVc(input: unknown): input is WarpVcWithTemplate {
  return (
    isJsonObject(input) &&
    isNumber(input?.templateId) &&
    isVC(input?.credential)
  );
}
