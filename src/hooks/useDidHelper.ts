import useTwaSdk from "@/hooks/useTwaSdk";
import { DidContext } from "@/context/Did";
import { useContext } from "react";
import { checkPasswordSecurityLevel } from "@/utils";
import useToast from "@/hooks/useToast";

export default () => {
  const toast = useToast();
  const { UserInfo } = useTwaSdk();
  const { didAccounts } = useContext(DidContext);

  const generate = async (params: { mnemonic: string; password: string }) => {
    if (!didAccounts || !UserInfo?.id || !params.mnemonic || !params.password) {
      console.warn("generate did fail");
      return null;
    }

    if (!didAccounts?.current) {
      const did = await didAccounts.generate(params.mnemonic, params.password);

      didAccounts.setCurrent(did.instance.id);
      return did;
    }
  };

  const checkConfirmPassword = async (
    password: string,
    confirmPassword: string,
    callback?: (confirm: boolean) => void
  ) => {
    if (checkPasswordSecurityLevel(password) < 3) {
      toast &&
        toast({
          value:
            "Password length must be greater than 8 characters, and must contains letters and symbols",
          type: "warning",
        });
      callback && callback(false);
    } else if (password !== confirmPassword) {
      toast &&
        toast({
          value: "The two passwords entered do not match",
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
