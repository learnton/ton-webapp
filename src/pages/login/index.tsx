import { RouterType } from "@/types/router";
import Login from "./page";

const routers: RouterType[] = [
  {
    path: "login",
    element: <Login />,
  },
];

export default routers;
