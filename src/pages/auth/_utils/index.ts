import { useTwaSdk } from "@/hooks";
import { DidAccount } from "@zcloak/wallet-lib";
import { bind } from "@/api/auth";
import { AppContext } from "@/context/AppProvider";
import { useContext } from "react";

export const useBind = () => {
  const { resolver } = useContext(AppContext);
  const { UserInfo } = useTwaSdk();

  const bindDid = async (did: DidAccount) => {
    if (UserInfo.id && did) {
      const publish = await did.instance.getPublish();
      void resolver.submitDid(publish).finally(() => {
        void bind({
          onChainAddress: String(UserInfo.id),
          didUrl: did.instance.id as string,
        });
      });
    } else {
      return await Promise.reject("did bind: params error");
    }
  };

  return bindDid;
};
