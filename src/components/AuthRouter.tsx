import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthWhitelist } from "@/constant";

import WebApp from "@twa-dev/sdk";
WebApp.BackButton.onClick(() => {
  window.history.back();
});

const AuthRouter = (props: { children: any }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || null;
  useEffect(() => {
    if (!token) {
      if (!AuthWhitelist.includes(location.pathname)) {
        console.warn("token is null", location.pathname);
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
    if (location.pathname !== "/") {
      WebApp.BackButton.show();
    } else {
      WebApp.BackButton.hide();
    }
  }, [token, location.pathname, navigate]);

  return props.children;
};

export default AuthRouter;
