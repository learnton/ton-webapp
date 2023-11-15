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
      WebApp.MainButton.setParams(Object.assign(defaultConfig, params));
      WebApp.MainButton.onClick(MainButtonHandle);
      WebApp.MainButton.show();
    },
    setParams: (params: object) => {
      WebApp.MainButton.setParams(Object.assign(defaultConfig, params));
    },
    destroy: (MainButtonHandle: () => void) => {
      WebApp.MainButton.offClick(MainButtonHandle);
      WebApp.MainButton.hide();
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
