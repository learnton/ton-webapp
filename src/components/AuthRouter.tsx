import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthRouter = (props: { children: any }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || null;

  useEffect(() => {
    console.log(token);
    if (!token) {
      console.warn("token is null");
      navigate("/login");
    } else if (location.pathname == "/login") {
      navigate("/");
    } else {
      navigate(location.pathname);
    }
  }, [token, location.pathname, navigate]);

  return props.children;
};

export default AuthRouter;
