import useTwaSdk from "@/hooks/useTwaSdk";
import { DidContext } from "@/context/Did";
import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default () => {
  const { did } = useContext(DidContext);
  const location = useLocation();
  const TwaSdk = useTwaSdk();
  const user = TwaSdk.UserInfo;
  const checkAuth = () => {
    if (user?.id && did) {
      return true;
    } else if (TwaSdk.DevMode && did) {
      console.log("runing in dev mode by version=", TwaSdk.WebApp.version);
      return true;
    } else {
      return false;
    }
  };

  const [isAuth, setIsAuth] = useState(checkAuth());

  useEffect(() => {
    setIsAuth(checkAuth());

    console.log("isAuth:", isAuth);
  }, [did, user, location]);

  return isAuth;
};
