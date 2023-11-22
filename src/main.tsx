import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/global.css";
import { ToastProvider } from "@/components";
import DidProvider from "./context/Did";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserSession, BrowserStore } from "@zcloak/ui-store";
import AppProvider from "./context/AppProvider";
import AccountsProvider from "./context/AccountsProvider";
import rootRoute from "./pages/routes";

const router = createBrowserRouter(rootRoute, {
  basename: import.meta.env.BASE_URL,
});

const session = new BrowserSession();
const store = new BrowserStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl={import.meta.env.VITE_APP_MANIFEST_PATH}
      actionsConfiguration={{
        twaReturnUrl: import.meta.env.VITE_APP_TWA_URL,
      }}
    >
      <AppProvider session={session} store={store}>
        <AccountsProvider>
          <ToastProvider>
            <DidProvider>
              <RouterProvider router={router} />
            </DidProvider>
          </ToastProvider>
        </AccountsProvider>
      </AppProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
