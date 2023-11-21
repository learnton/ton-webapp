import type { VerifiableCredential } from "@zcloak/vc/types";

import { isHex, stringToU8a, u8aConcat, u8aToHex } from "@polkadot/util";

import { calcRoothash } from "@zcloak/vc";
import { isPrivateVC } from "@zcloak/vc/is";

import { type DidDB, type ZkCredential, scrypt } from "@/utils";

export async function addVC(
  didDB: DidDB,
  vc: VerifiableCredential<boolean> | null | undefined,
  password: string | null,
  boundedMessageId?: string
): Promise<ZkCredential | null> {
  if (!vc) return null;

  if (isHex(vc.credentialSubject)) {
    throw new Error("The vc subject is not an object");
  }

  const { rootHash } = isPrivateVC(vc)
    ? calcRoothash(
        vc.credentialSubject,
        vc.hasher[0],
        vc.version,
        vc.credentialSubjectNonceMap
      )
    : calcRoothash(vc.credentialSubject, vc.hasher[0], vc.version);

  const exists = await didDB.zkCredential
    .filter(
      (credential) =>
        credential.digest === vc.digest && credential.attester === vc.issuer
    )
    .first();

  if (exists) {
    return null;
  }

  const encrypted = scrypt.vcEncrypt(vc, password ?? undefined);
  const id = u8aToHex(u8aConcat(vc.digest, stringToU8a(vc.issuer.toString())));
  const issuers = Array.isArray(vc.issuer) ? vc.issuer : [vc.issuer];

  const credential: ZkCredential = {
    id,
    version: 0,
    source: "ZKID",
    digest: vc.digest,
    rootHash,
    ctypeHash: vc.ctype,
    attester: issuers,
    owner: vc.holder,
    hasher: vc.hasher,
    issuanceDate: vc.issuanceDate,
    expirationDate: vc.expirationDate,
    encoded: u8aToHex(encrypted),
    boundedMessageId,
  };

  await didDB.zkCredential.put(credential);

  return credential;
}
