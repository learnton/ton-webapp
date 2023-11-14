import { RouteObject } from "@/types/router";
import Login from "./login/page";
import RegistByPassword from "./regist/by-password/page";
import RegistByWallet from "./regist/by-wallet/page";
import RestoreAccount from "./restore-account/page";

const routers: RouteObject[] = [
  {
    path: "login",
    element: <Login />,
    index: true,
  },
  {
    path: "regist/password",
    element: <RegistByPassword />,
  },
  {
    path: "regist/wallet",
    element: <RegistByWallet />,
  },
  {
    path: "restore",
    element: <RestoreAccount />,
  },
];

export default routers;
