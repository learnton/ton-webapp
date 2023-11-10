import Layout from "./layouts/Layout";
import NoFound from "./no-found/page";
import Dashboard from "./home/page";
import authRoutes from "./auth";
import Contact from "./contact";

const rootRouter = [
  {
    path: "/",
    name: "首页",
    key: "/",
    auth: true,
    element: <Layout />,
    children: [
      {
        path: "/",
        name: "Dashboard",
        key: "dashboard",
        element: <Dashboard />,
        index: true,
      },
      ...Contact,
    ],
  },
  ...authRoutes,
  {
    path: "*",
    name: "No Match",
    key: "*",
    element: <NoFound />,
  },
];

export default rootRouter;
