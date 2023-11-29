// import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout({ loading }: { loading: boolean }) {
  return (
    <div className="px-4 bg-body min-h-[100vh]">
      {loading && (
        <div className="flex justify-center items-center w-full h-full fixed z-50 left-0 top-0">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}
      <Outlet />
    </div>
  );
}
