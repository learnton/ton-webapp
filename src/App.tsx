// import { useState } from 'react'
import { useRoutes } from "react-router-dom";
import AuthRouter from "./components/AutoRoute";
import rootRouter from "./pages/routes";

function App() {
  const element = useRoutes(rootRouter as any);
  console.log(rootRouter);
  return (
    <>
      <AuthRouter>{element}</AuthRouter>
    </>
  );
}

export default App;
