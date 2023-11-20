import HomePage from "./page";
import Profile from "./profile/page";
import Message from "../message/list/page";
import Keys from "./keys/page";

const routers = [
  {
    path: "account",
    element: <HomePage />,
  },
  {
    path: "account/profile",
    element: <Profile />,
  },
  {
    path: "account/message",
    element: <Message />,
  },
  {
    path: "account/keys",
    element: <Keys />,
  },
];

export default routers;
