import { useTwaSdk } from "@/hooks";
import { DidAccount } from "@zcloak/wallet-lib";
import { bind } from "@/api/auth";

export const useBind = () => {
  const { UserInfo } = useTwaSdk();
  const bindDid = (did: DidAccount) => {
    if (UserInfo.id && did) {
      return bind({
        onChainAddress: String(UserInfo.id),
        didUrl: did.instance.id as string,
      });
    } else {
      return Promise.reject("did bind: params error");
    }
  };

  return bindDid;
};
