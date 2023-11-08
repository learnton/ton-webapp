import Layout from "./Layout";
import NoMatch from "./NoMatch";

import login from "./login";

const rootRouter = [
  {
    path: "/",
    name: "首页",
    key: "/",
    auth: true,
    element: <Layout />,
    children: [],
  },
  ...login,
  {
    path: "*",
    name: "No Match",
    key: "*",
    element: <NoMatch />,
  },
];

export default rootRouter;
