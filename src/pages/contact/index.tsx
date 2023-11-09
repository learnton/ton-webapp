import { RouteObject } from "@/types/router";
import List from "./list/page";
import Detail from "./detail/page";

const routers: RouteObject[] = [
  {
    path: "contacts",
    element: <List />,
    index: true,
  },
  {
    path: "contacts/:contactId",
    element: <Detail />,
  },
];

export default routers;
