import { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { AuthWhitelist, HOMEPAGE_URL } from "@/constant";
import { useAuth } from "@/hooks";
import WebApp from "@twa-dev/sdk";
import { login } from "@/api/auth";
import { useToast } from "@/components";

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
        navigate("/login", {
          replace: true,
        });
      }
    } else if (isAuth === true) {
      const Token = localStorage.getItem("token");
      if (!Token) {
        console.log("no token", pathname, isAuth);
        setLoading(true);
        login().then((res) => {
          setLoading(false);
          console.log("login", res);
          if (res?.data?.authToken) {
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
  }, [isAuth, pathname, navigate]);

  return (
    <div className="p-4 bg-[#F9FAFB] min-h-[100vh]">
      {loading && (
        <div className="flex justify-center items-center w-full h-full fixed z-50 left-0 top-0">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}
      <Outlet />
    </div>
  );
}
