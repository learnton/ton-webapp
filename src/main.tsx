import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import ToastProvider from "./context/Toast";
import DidProvider from "./context/Did";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { baseURL } from "@/constant";
import rootRoute from "./pages/routes";
const router = createBrowserRouter(rootRoute, {
  basename: baseURL,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://learnton.github.io/ton-webapp/tonconnect-manifest.json">
      <ToastProvider>
        <DidProvider>
          <RouterProvider router={router} />
        </DidProvider>
      </ToastProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
