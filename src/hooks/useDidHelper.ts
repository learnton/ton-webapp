import { useTwaSdk } from "@/hooks";
import { AppContext } from "@/context/AppProvider";
import { useContext } from "react";
import { checkPasswordSecurityLevel } from "@/utils";
import { useToast } from "@/components";
import { DidAccount } from "@zcloak/wallet-lib";

export const useDidHelper = () => {
  const toast = useToast();
  const { UserInfo } = useTwaSdk();
  const { didAccounts } = useContext(AppContext);

  const generate = async (params: { mnemonic: string; password: string }) => {
    if (!didAccounts || !UserInfo?.id || !params.mnemonic || !params.password) {
      console.warn("generate did fail", didAccounts, UserInfo, params);
      return null;
    }

    if (!didAccounts?.current) {
      const did: DidAccount = await didAccounts.generate(
        params.mnemonic,
        params.password
      );

      didAccounts.setCurrent(did.instance.id);
      return did;
    }
  };

  const checkConfirmPassword = (
    password: string,
    confirmPassword: string,
    callback?: (confirm: boolean) => void
  ) => {
    if (checkPasswordSecurityLevel(password) < 3) {
      toast &&
        toast({
          message:
            "Password length must be greater than 8 characters, and must contains letters and symbols",
          type: "warning",
        });
      callback && callback(false);
    } else if (password !== confirmPassword) {
      toast &&
        toast({
          message: "The two passwords entered do not match",
          type: "warning",
        });

      callback && callback(false);
    } else {
      callback && callback(true);
    }
  };

  return {
    generate,
    checkConfirmPassword,
  };
};
