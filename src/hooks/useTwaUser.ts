import WebApp from "@twa-dev/sdk";
import { WebAppUser } from "@twa-dev/types";

export default () => {
  WebApp.ready();
  return WebApp.initDataUnsafe.user
    ? (WebApp.initDataUnsafe.user as WebAppUser)
    : {};
};
