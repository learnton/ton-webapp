import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/global.css";
import { ToastProvider } from "@/components";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserSession, BrowserStore } from "@zcloak/ui-store";
import AppProvider from "./context/AppProvider";
import rootRoute from "./pages/routes";
import { initCrypto } from "@zcloak/crypto";

const router = createBrowserRouter(rootRoute, {
  basename: import.meta.env.BASE_URL,
});

const session = new BrowserSession();
const store = new BrowserStore();

initCrypto().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <TonConnectUIProvider
        manifestUrl={import.meta.env.VITE_APP_MANIFEST_PATH}
        actionsConfiguration={{
          twaReturnUrl: import.meta.env.VITE_APP_TWA_URL,
        }}
      >
        <AppProvider session={session} store={store}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AppProvider>
      </TonConnectUIProvider>
    </React.StrictMode>
  );
});
