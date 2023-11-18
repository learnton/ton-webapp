import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { AuthWhitelist, HOMEPAGE_URL } from "@/constant";
import useAuth from "@/hooks/useAuth";
import WebApp from "@twa-dev/sdk";

WebApp.BackButton.onClick(() => {
  window.history.back();
});

export default function AuthRouter() {
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
    } else if (pathname == "/login") {
      navigate(HOMEPAGE_URL, {
        replace: true,
      });
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
      <Outlet />
    </div>
  );
}
