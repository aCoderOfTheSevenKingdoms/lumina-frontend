import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Public from "../features/auth/components/Public";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            <Dashboard/>
        </Protected>
    },
    {
        path: "/login",
        element: <Public>
            <Login/>
        </Public>
    },
    {
        path: "/register",
        element: <Public>
            <Register/>
        </Public>
    },
    {
        path: "/dashboard",
        element: <Navigate to="/" replace />
    }
])
