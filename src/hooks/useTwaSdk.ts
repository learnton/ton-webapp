import WebApp from "@twa-dev/sdk";
import { themeColor } from "@/constant";

WebApp.ready();

const defaultConfig = {
  color: themeColor.primary,
};

export default () => {
  const MainButton: {
    MainButtonHandle?: () => void;
    init: (params: object, MainButtonHandle: () => void) => void;
    setParams: (params: object) => void;
    destroy: () => void;
  } = {
    MainButtonHandle: undefined,
    init(params: object, MainButtonHandle: () => void) {
      WebApp.MainButton.setParams(Object.assign(defaultConfig, params));
      WebApp.MainButton.onClick(MainButtonHandle);
      WebApp.MainButton.show();
      this.MainButtonHandle = MainButtonHandle;
    },
    setParams(params: object) {
      WebApp.MainButton.setParams(Object.assign(defaultConfig, params));
    },
    destroy() {
      this?.MainButtonHandle &&
        WebApp.MainButton.offClick(this.MainButtonHandle);
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
