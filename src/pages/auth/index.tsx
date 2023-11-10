import { RouteObject } from "@/types/router";
import Login from "./login/page";
import Register from "./register/page";
import RestoreAccount from "./restore-account/page";

const routers: RouteObject[] = [
  {
    path: "login",
    element: <Login />,
    index: true,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "restore",
    element: <RestoreAccount />,
  },
];

export default routers;
