import { RouterType } from "@/types/router";
import HomePage from "./page";
import ContactPage from "./contact/page";

const routers: RouterType[] = [
  {
    path: "/",
    Component: HomePage,
    children: [
      {
        path: "contacts/:contactId",
        Component: ContactPage,
      },
    ],
  },
];

export default routers;
