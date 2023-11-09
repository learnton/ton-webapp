import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
      console.warn("token is null");
      navigate("/login");
    } else if (location.pathname == "/login") {
      navigate("/");
    } else {
      navigate(location.pathname);
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
