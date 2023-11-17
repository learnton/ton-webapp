import Layout from "./layouts/Layout";
import NoFound from "./no-found/page";
import HomePage from "./account/page";
import authRoutes from "./auth";
import { AuthRouter } from "@/components";
import { RouteObject } from "@/types";

const rootRouter = [
  {
    path: "/",
    name: "首页",
    element: <Layout />,
    children: [
      {
        path: "/",
        name: "HomePage",
        element: <HomePage />,
      },
    ],
  },
  ...authRoutes,
  {
    path: "*",
    name: "No Match",
    element: <NoFound />,
  },
];

const checkRoute = (routes: RouteObject[]) => {
  return routes.map((route) => {
    if (route.element) {
      route.element = <AuthRouter>{route.element}</AuthRouter>;
    }
    if (Array.isArray(route.children)) {
      route.children = checkRoute(route.children);
    }

    return route;
  });
};

export default checkRoute(rootRouter);
