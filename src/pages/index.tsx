import { AuthRouter } from "@/components";

import NoFound from "./no-found/page";
import accountRoutes from "./account";
import authRoutes from "./auth";
import messageRoutes from "./message";
import cardRoutes from "./card";

const rootRouter = [
  {
    path: "/",
    element: <AuthRouter />,
    children: [
      ...accountRoutes,
      ...authRoutes,
      ...messageRoutes,
      ...cardRoutes,
    ],
  },
  {
    path: "*",
    element: <NoFound />,
  },
];

export default rootRouter;
