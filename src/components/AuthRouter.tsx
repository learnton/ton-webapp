import { useEffect } from "react";
import { useLocation, useNavigate, useMatches } from "react-router-dom";
import { AuthWhitelist } from "@/constant";
import useAuth from "@/hooks/useAuth";
import WebApp from "@twa-dev/sdk";

WebApp.BackButton.onClick(() => {
  window.history.back();
});

const AuthRouter = (props: { children: any }) => {
  const matches = useMatches();
  const isAuth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      if (!AuthWhitelist.includes(location.pathname)) {
        console.log("not auth", location.pathname);
        navigate("/login", {
          replace: true,
        });
      }
    } else if (location.pathname == "/login") {
      navigate("/", {
        replace: true,
      });
    }

    // back button
    console.log("matches=", matches);
    if (matches.length > 1 && location.pathname !== "/") {
      WebApp.BackButton.show();
    } else {
      if (!isAuth && location.pathname === "/login") {
        WebApp.BackButton.hide();
      } else {
        WebApp.BackButton.show();
      }
    }
  }, [isAuth, location.pathname, navigate]);

  return props.children;
};

export default AuthRouter;
