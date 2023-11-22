import WebAppSDK from "@twa-dev/sdk";
import type { WebApp, WebAppUser } from "@twa-dev/types";
import { themeColor } from "@/constant";

WebAppSDK.ready();

const defaultConfig = {
  color: themeColor.primary,
};

type useTwa = {
  MainButton: {
    MainButtonHandle?: (() => void) | undefined;
    init: (params: object, MainButtonHandle: () => void) => void;
    setParams: (params: object) => void;
    destroy: () => void;
  };
  WebApp: WebApp;
  UserInfo: WebAppUser;
  DevMode: boolean;
};

export const useTwaSdk: () => useTwa = () => {
  const MainButton: {
    MainButtonHandle?: () => void;
    init: (params: object, MainButtonHandle: () => void) => void;
    setParams: (params: object) => void;
    destroy: () => void;
  } = {
    MainButtonHandle: undefined,
    init(params: object, MainButtonHandle: () => void) {
      WebAppSDK.MainButton.setParams(Object.assign(defaultConfig, params));
      WebAppSDK.MainButton.onClick(MainButtonHandle);
      WebAppSDK.MainButton.show();
      this.MainButtonHandle = MainButtonHandle;
    },
    setParams(params: object) {
      WebAppSDK.MainButton.setParams(Object.assign(defaultConfig, params));
    },
    destroy() {
      this?.MainButtonHandle &&
        WebAppSDK.MainButton.offClick(this.MainButtonHandle);
      WebAppSDK.MainButton.hide();
    },
  };

  const DevMode =
    WebAppSDK.platform === "unknown" && parseFloat(WebAppSDK.version) < 6.1;

  const UserInfo = (
    DevMode ? { id: "testIdByDevMode" } : WebAppSDK.initDataUnsafe.user
  ) as WebAppUser;

  return {
    MainButton,
    WebApp: WebAppSDK,
    UserInfo,
    DevMode,
  };
};
