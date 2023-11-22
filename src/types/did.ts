import type { Did } from "@zcloak/did";
export type AccountType = "zkid" | "nostr";

export type AccountInstance<T extends AccountType> = T extends "zkid"
  ? Did
  : null;

export type AccountMeta = {
  import: boolean;
  alias?: string;
  deriveIndex?: number;
};
