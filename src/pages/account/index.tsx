import HomePage from "./page";
import Profile from "./profile/page";
import Scan from "./scan/page";
import Message from "./message/page";
import Manage from "./manage/page";
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
    path: "account/scan",
    element: <Scan />,
  },
  {
    path: "account/message",
    element: <Message />,
  },
  {
    path: "account/manage",
    element: <Manage />,
  },
  {
    path: "account/keys",
    element: <Keys />,
  },
];

export default routers;
