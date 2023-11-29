import HomePage from "./page";
import Profile from "./profile/page";
import Message from "../message/list/page";
import Keys from "./keys/page";
import RecoverySeedPhrase from "./recovery-seed-phrase/page";
import ImportAccount from "./import/page";

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
  {
    path: "account/import",
    element: <ImportAccount />,
  },
];

export default routers;
