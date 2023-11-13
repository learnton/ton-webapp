import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { themeColor } from "@/constant";

const defaultConfig = {
  color: themeColor.primary,
};

export const MainButton = {
  init: (params: object, MainButtonHandle: () => any) => {
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
