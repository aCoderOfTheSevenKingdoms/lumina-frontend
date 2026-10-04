import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";

function App() {

  const auth = useAuth();

  /**
   * Hydration: On page reload fresh user data is fetched. 
  */ 
  useEffect(() => {
    auth.handleGetMe();
  }, []);

  return (
    <RouterProvider router={router} />
  )
}

export default App
