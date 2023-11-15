import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { themeColor } from "@/constant";

WebApp.ready();

const defaultConfig = {
  color: themeColor.primary,
};

export default () => {
  const MainButton = {
    init: (params: object, MainButtonHandle: () => void) => {
      useEffect(() => {
        WebApp.MainButton.setParams(Object.assign(defaultConfig, params));
        WebApp.MainButton.onClick(MainButtonHandle);
        WebApp.MainButton.show();
        return () => {
          WebApp.MainButton.offClick(MainButtonHandle);
          WebApp.MainButton.hide();
        };
      }, []);
    },
    setParams: (params: object) => {
      WebApp.MainButton.setParams(Object.assign(defaultConfig, params));
    },
  };

  const DevMode =
    WebApp.platform === "unknown" && parseFloat(WebApp.version) < 6.1;

  const UserInfo = DevMode
    ? { id: "testIdByDevMode" }
    : WebApp.initDataUnsafe.user;

  return {
    MainButton,
    WebApp,
    UserInfo,
    DevMode,
  };
};
