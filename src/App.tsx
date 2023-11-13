// import { useState } from 'react'
import { useRoutes } from "react-router-dom";
import AuthRouter from "./components/AuthRouter";
import rootRouter from "./pages/routes";
import ToastProvider from "./context/Toast";

function App() {
  const element = useRoutes(rootRouter as any);
  return (
    <ToastProvider>
      <AuthRouter>{element}</AuthRouter>
    </ToastProvider>
  );
}

export default App;
