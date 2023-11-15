import { useEffect, useContext } from "react";
import IdentityIcon from "@/components/IdentityIcon";
import { DidContext } from "@/context/Did";
import { Address } from "@/components";
import useTwaSdk from "@/hooks/useTwaSdk";

export default function Complete(props: {
  mnemonic: string;
  password: string;
  ready?: () => void;
}) {
  const { UserInfo } = useTwaSdk();
  const { didAccounts, did } = useContext(DidContext);

  const generate = async () => {
    if (!didAccounts || !UserInfo?.id || !props.mnemonic || !props.password) {
      return console.warn("generate by password fail");
    }

    if (!didAccounts?.current) {
      const did = await didAccounts.generate(props.mnemonic, props.password);

      didAccounts.setCurrent(did.instance.id);
    }
  };

  useEffect(() => {
    if (UserInfo?.id && didAccounts && !didAccounts.current) {
      generate().then(() => typeof props.ready === "function" && props.ready());
    } else {
      console.warn("params lost", UserInfo?.id, props);
    }
  }, [UserInfo?.id, didAccounts, props]);

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
      <div className="text-center py-4">
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
