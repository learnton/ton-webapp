import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export const MainButton = {
  init: (params: object, MainButtonHandle: () => any) => {
    useEffect(() => {
      WebApp.MainButton.setParams(params);
      WebApp.MainButton.onClick(MainButtonHandle);
      WebApp.MainButton.show();
      return () => {
        WebApp.MainButton.offClick(MainButtonHandle);
        WebApp.MainButton.hide();
      };
    }, []);
  },
  setParams: (params: object) => {
    WebApp.MainButton.setParams(params);
  },
};
