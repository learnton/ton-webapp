import { useEffect, useContext } from "react";
// import { login } from "@/api/sample";
import { useNavigate } from "react-router-dom";
import IdentityIcon from "@/components/IdentityIcon";
import { requestPhaseText } from "@/utils";
import { utils } from "@zcloak/wallet-lib";
import { DidContext } from "@/context/Did";
import { PHASE_KEY } from "@/constant";
import TonWeb from "tonweb";
import { Address } from "@/components";

export default function Login() {
  const navigate = useNavigate();
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
    <div className="flex flex-col justify-center p-10 h-[100vh] gap-8">
      <div className="text-[#9CA3AF]">
        <h1 className="font-bold text-[#111827] text-xl mb-4">
          Welcome to Product Name
        </h1>
        We've prepared your digital identity. Check out its features, use our
        trusted digital cards, and enjoy smooth validations and enhanced
        privacy, all with your data under your control.
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

      <div className="flex flex-col gap-4">
        <button
          className="btn btn-primary font-normal text-xs"
          onClick={() => navigate("/regist/wallet")}
        >
          Fast Registration with TON Wallet
        </button>
        <button
          className="link link-hover link-primary font-normal text-sm"
          onClick={() => navigate("/regist/password")}
        >
          Register with password
        </button>
      </div>
      <div className="divider">OR</div>
      <div className="text-center leading-loose">
        Have an account with us already?
        <button className="link" onClick={() => navigate("/restore")}>
          Restore Account
        </button>
      </div>
    </div>
  );
}
