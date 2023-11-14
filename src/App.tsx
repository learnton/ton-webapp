// import { useState } from 'react'
import { useRoutes } from "react-router-dom";
import AuthRouter from "./components/AuthRouter";
import rootRouter from "./pages/routes";
import ToastProvider from "./context/Toast";
import DidProvider from "./context/Did";

function App() {
  const element = useRoutes(rootRouter as any);
  return (
    <ToastProvider>
      <DidProvider>
        <AuthRouter>{element}</AuthRouter>
      </DidProvider>
    </ToastProvider>
  );
}

export default App;
