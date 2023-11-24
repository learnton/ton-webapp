import type { VerifiableCredential } from "@zcloak/vc/types";

export interface CardBgInterface {
  bg: string;
  rootHash: string;
  alias?: string;
}

export interface WarpVcWithTemplate {
  templateId?: number;
  credential: VerifiableCredential<boolean>;
}
