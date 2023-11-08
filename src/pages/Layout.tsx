// import React from "react";
import { Outlet } from "react-router-dom";

export default function () {
  return (
    <div className="xl:w-[1200px] m-auto">
      <h1>Layout</h1>
      <Outlet />
    </div>
  );
}
