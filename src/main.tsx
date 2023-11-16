import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import ToastProvider from "./context/Toast";
import DidProvider from "./context/Did";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { baseURL } from "@/constant";
import rootRoute from "./pages/routes";
const router = createBrowserRouter(rootRoute, {
  basename: baseURL,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <DidProvider>
        <RouterProvider router={router} />
      </DidProvider>
    </ToastProvider>
  </React.StrictMode>
);
