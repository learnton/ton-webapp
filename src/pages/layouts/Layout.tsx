// import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="max-w-[1200px] m-auto p-10">
      <Outlet />
    </div>
  );
}
