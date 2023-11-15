import { useEffect, useContext } from "react";
import IdentityIcon from "@/components/IdentityIcon";
import { DidContext } from "@/context/Did";
import { Address } from "@/components";
import useTwaSdk from "@/hooks/useTwaSdk";
import useDidHelper from "@/hooks/useDidHelper";

export default function Complete(props: {
  mnemonic: string;
  password: string;
  ready?: () => void;
}) {
  const { UserInfo } = useTwaSdk();
  const { didAccounts, did } = useContext(DidContext);

  const { generate } = useDidHelper();

  useEffect(() => {
    if (UserInfo?.id && didAccounts && !didAccounts.current) {
      generate(props).then(
        () => typeof props.ready === "function" && props.ready()
      );
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
      <div className="text-center py-10">
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
