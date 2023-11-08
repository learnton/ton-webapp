import { useEffect } from "react";
import { redirect, useLocation } from "react-router-dom";

const AuthRouter = (props) => {
  const location = useLocation();
  //   const { pathname } = useLocation();
  //   const route = getKeyName(pathname)

  //   if (!route?.auth) return props.children

  const token = localStorage.getItem("token") || null;

  useEffect(() => {
    console.log(token);
    if (!token) {
      redirect("/login");
    } else if (location.pathname == "/login") {
      redirect("/");
    } else {
      // 如果是其他路由就跳到其他的路由
      redirect(location.pathname);
    }
  }, [token, location.pathname]);

  return props.children;
};

export default AuthRouter;
