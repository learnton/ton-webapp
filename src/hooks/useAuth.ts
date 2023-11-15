import useTwaSdk from "@/hooks/useTwaSdk";
import { DidContext } from "@/context/Did";
import { useContext, useState, useEffect } from "react";

export default () => {
  const [isAuth, setIsAuth] = useState(false);
  const { didAccounts } = useContext(DidContext);

  const TwaSdk = useTwaSdk();
  const user = TwaSdk.UserInfo;
  useEffect(() => {
    if (user?.id && didAccounts?.current) {
      setIsAuth(true);
    } else if (TwaSdk.DevMode && didAccounts?.current) {
      console.log("runing in dev mode by version=", TwaSdk.WebApp.version);
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [didAccounts, user]);

  return isAuth;
};
