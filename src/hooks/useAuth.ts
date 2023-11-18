import useTwaSdk from "@/hooks/useTwaSdk";
import { DidContext } from "@/context/Did";
import { useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

export default () => {
  const { did, didAccounts } = useContext(DidContext);
  const location = useLocation();
  const TwaSdk = useTwaSdk();
  const user = TwaSdk.UserInfo;
  const checkAuth = useCallback(() => {
    if (didAccounts === null) {
      return null;
    } else if (user?.id && did) {
      return true;
    } else if (TwaSdk.DevMode && did) {
      console.log("runing in dev mode by version=", TwaSdk.WebApp.version);
      return true;
    } else {
      return false;
    }
  }, [TwaSdk.DevMode, TwaSdk.WebApp.version, did, didAccounts, user?.id]);

  const [isAuth, setIsAuth] = useState(checkAuth());

  useEffect(() => {
    setIsAuth(checkAuth());
  }, [did, location, checkAuth]);

  return isAuth;
};
