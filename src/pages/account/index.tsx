import HomePage from "./page";
import Profile from "./profile/page";
import Message from "../message/list/page";
import Keys from "./keys/page";
import RecoverySeedPhrase from "./recovery-seed-phrase/page";

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
  {
    path: "account/recovery-seed-phrase",
    element: <RecoverySeedPhrase />,
  },
];

export default routers;
