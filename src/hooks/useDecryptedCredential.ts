import type { VerifiableCredential } from "@zcloak/vc/types";
import { scrypt, ZkCredential } from "@/utils";

import { hexToU8a } from "@polkadot/util";
import { useEffect, useState } from "react";

import { isVC } from "@zcloak/vc/is";

export function useDecryptedCredential(
  credential?: ZkCredential,
  password?: string
): VerifiableCredential<boolean> | undefined {
  const [decrypted, setDecrypted] = useState<
    VerifiableCredential<boolean> | undefined
  >();

  useEffect(() => {
    if (credential && password) {
      try {
        const result = scrypt.vcDecrypt(hexToU8a(credential.encoded), password);

        if (isVC(result)) {
          setDecrypted(result);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [credential, password]);

  return decrypted;
}
