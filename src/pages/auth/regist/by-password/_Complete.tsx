import { useEffect, useContext } from "react";

import IdentityIcon from "@/components/IdentityIcon";
import { requestPhaseText } from "@/utils";
import { utils } from "@zcloak/wallet-lib";
import { DidContext } from "@/context/Did";
import { PHASE_KEY } from "@/constant";
import TonWeb from "tonweb";
import { Address } from "@/components";

export default function Complete() {
  const userId = "test";
  const { didAccounts, did } = useContext(DidContext);

  const generate = async () => {
    if (!didAccounts || !userId) return;

    if (!didAccounts?.current) {
      const wPreKey = crypto.getRandomValues(new Uint8Array(32));
      const message = requestPhaseText(wPreKey);
      // const sig = await signMessageAsync({ message });

      const mnemonic = utils.mnemonic.mnemonicGenerate(24);

      const did = await didAccounts.generate(mnemonic, message);

      didAccounts.setCurrent(did.instance.id);
      localStorage.setItem(
        `${userId}_${PHASE_KEY}`,
        TonWeb.utils.bytesToHex(wPreKey)
      );
    }
  };

  useEffect(() => {
    if (userId && didAccounts && !didAccounts.current) {
      generate();
    }
  }, [userId, didAccounts]);

  return (
    <>
      <h1 className="leading-loose font-bold text-xl">
        Your account is now ready!
      </h1>
      <div className="text-[#9CA3AF] flex flex-col gap-4">
        <p>
          We've prepared your digital identity. Check out its features, use our
          trusted digital cards, and enjoy smooth validations and enhanced
          privacy, all with your data under your control.
        </p>
      </div>
      <div className="text-center">
        <IdentityIcon
          value={did?.instance.id}
          className="w-20 h-20 m-auto mask mask-circle bg-[#eee] mb-4"
        />

        <div className="text-base">
          <Address value={did?.instance.id} />
        </div>
      </div>
    </>
  );
}
