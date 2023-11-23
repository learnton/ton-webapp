// import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="p-4 bg-body min-h-[100vh]">
      <Outlet />
    </div>
  );
}
