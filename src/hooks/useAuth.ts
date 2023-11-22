import { useTwaSdk } from "@/hooks";
import { AppContext } from "@/context/AppProvider";
import { useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

export const useAuth = () => {
  const { didAccounts } = useContext(AppContext);
  const location = useLocation();
  const { UserInfo, DevMode, WebApp } = useTwaSdk();

  const checkAuth = useCallback(() => {
    if (didAccounts === null) {
      return null;
    } else if (UserInfo?.id && didAccounts.current) {
      return true;
    } else if (DevMode && didAccounts.current) {
      console.log("runing in dev mode by version=", WebApp.version);
      return true;
    } else {
      return false;
    }
  }, [UserInfo, DevMode, WebApp, didAccounts]);

  const [isAuth, setIsAuth] = useState(checkAuth());

  useEffect(() => {
    setIsAuth(checkAuth());
  }, [didAccounts, location, checkAuth]);

  return isAuth;
};
