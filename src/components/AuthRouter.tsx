import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthWhitelist, HOMEPAGE_URL } from "@/constant";
import { useAuth } from "@/hooks";
import WebApp from "@twa-dev/sdk";
import { login } from "@/api/auth";
import { useToast } from "@/components";
import Layout from "@/pages/layouts/Layout";

WebApp.BackButton.onClick(() => {
  window.history.back();
});

export default function AuthRouter() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const isAuth = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth === false) {
      if (!AuthWhitelist.includes(pathname)) {
        console.log("not auth", pathname);
        return navigate("/login", {
          replace: true,
        });
      }
    } else if (isAuth === true) {
      const Token = localStorage.getItem("token");
      if (!Token) {
        console.log("no token", pathname, isAuth);
        setLoading(true);
        void login().then((res) => {
          setLoading(false);
          console.log("login", res);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (res?.data?.authToken) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            localStorage.setItem("token", res.data.authToken);
          } else {
            toast &&
              toast({
                type: "error",
                message: "err: get token fail!",
              });
          }
          // navigate(HOMEPAGE_URL, {
          //   replace: true,
          // });
        });
      }
      if (pathname == "/login") {
        navigate(HOMEPAGE_URL, {
          replace: true,
        });
      }
    }

    // homepage
    if (pathname === "/") {
      navigate(HOMEPAGE_URL, {
        replace: true,
      });
    }

    // back button
    if (pathname === HOMEPAGE_URL) {
      WebApp.BackButton.hide();
    } else {
      if (isAuth === false && pathname === "/login") {
        WebApp.BackButton.hide();
      } else {
        WebApp.BackButton.show();
      }
    }
  }, [isAuth, pathname, navigate, toast]);

  return <Layout loading={loading}></Layout>;
}
