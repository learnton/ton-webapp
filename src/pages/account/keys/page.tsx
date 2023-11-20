import { useContext, useState, useMemo } from "react";
import { DidContext } from "@/context/Did";
import { isU8a, u8aToHex } from "@polkadot/util";
import { DidUrl } from "@zcloak/did-resolver/types";
import type { HexString } from "@zcloak/crypto/types";
import { shortString } from "@/utils";
import { Link } from "react-router-dom";

export default function AccountKeys() {
  const { did } = useContext(DidContext);

  const toHex = (publicKey: Uint8Array | HexString | undefined | DidUrl) =>
    publicKey
      ? isU8a(publicKey)
        ? u8aToHex(publicKey)
        : publicKey
      : undefined;

  const authenticationKey = useMemo(() => {
    try {
      const didUrl = did?.instance.getKeyUrl("authentication");
      if (!didUrl) return null;
      return toHex(did?.instance.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);
  const assertionMethodKey = useMemo(() => {
    try {
      const didUrl = did?.instance.getKeyUrl("assertionMethod");

      if (!didUrl) return null;

      return toHex(did?.instance.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);
  const keyAgreementKey = useMemo(() => {
    try {
      const didUrl = did?.instance.getKeyUrl("keyAgreement");

      if (!didUrl) return null;

      return toHex(did?.instance.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);
  const capabilityDelegationKey = useMemo(() => {
    try {
      const didUrl = did?.instance.getKeyUrl("capabilityDelegation");

      if (!didUrl) return null;

      return toHex(did?.instance.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);
  const capabilityInvocationKey = useMemo(() => {
    try {
      const didUrl = did?.instance.getKeyUrl("capabilityInvocation");

      if (!didUrl) return null;

      return toHex(did?.instance.get(didUrl).publicKey);
    } catch {
      return null;
    }
  }, [did]);

  const [keys] = useState({
    Authentication: authenticationKey,
    "Assertion Method": assertionMethodKey,
    "Key Agreement": keyAgreementKey,
    "Capability Delegation": capabilityDelegationKey,
    "Capability Invocation": capabilityInvocationKey,
  });

  return (
    <>
      <h1 className="leading-loose font-bold text-xl">My Keys</h1>
      <div className="text-[#9CA3AF] flex flex-col gap-4">
        <p>
          Here are your account&apos;s private keys. Download your keysfile now
          for future account recovery.
        </p>
      </div>
      <ul className="bg-white px-4 py-2 rounded-xl my-10">
        {Object.entries(keys).map(([key, value]) => (
          <li
            key={key}
            className="flex items-center border-b border-[#F3F4F6] py-3 last:border-b-0"
          >
            <span className="text-[#9CA3AF] flex-1 text-ellipsis">{key}:</span>
            <span>{value ? shortString(value, 8, 4) : "--"}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/account/recovery-seed-phrase"
        className="btn btn-primary btn-block"
      >
        View my seed phrase
      </Link>
    </>
  );
}
