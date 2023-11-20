import { AuthRouter } from "@/components";

import NoFound from "./no-found/page";
import accountRoutes from "./account";
import authRoutes from "./auth";
import messageRoutes from "./message";

const rootRouter = [
  {
    path: "/",
    element: <AuthRouter />,
    children: [...accountRoutes, ...authRoutes, ...messageRoutes],
  },
  {
    path: "*",
    element: <NoFound />,
  },
];

// const checkRoute = (routes: RouteObject[]) => {
//   return routes.map((route) => {
//     if (route.element) {
//       route.element = <AuthRouter>{route.element}</AuthRouter>;
//     }
//     if (Array.isArray(route.children)) {
//       route.children = checkRoute(route.children);
//     }

//     return route;
//   });
// };

export default rootRouter;
