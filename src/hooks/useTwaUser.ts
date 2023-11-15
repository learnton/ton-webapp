import WebApp from "@twa-dev/sdk";
import { WebAppUser } from "@twa-dev/types";

export default () => {
  return (WebApp.initDataUnsafe.user || {}) as WebAppUser;
};
