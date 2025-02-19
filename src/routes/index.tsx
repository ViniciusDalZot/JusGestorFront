import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Cases from "../pages/Cases";
import Admin from "../pages/Admin";
import Logout from "../components/Layout";
import Layout from "../components/Layout";
import Schedules from "../pages/Schedules/index.tsx";
import Customers from "../pages/Customers";
import Notifications from "../pages/Notifications";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "intimacoes",
        element: <Notifications />,
      },
      {
        path: "processos",
        element: <Cases />,
      },
      {
        path: "agenda",
        element: <Schedules />,
      },
      {
        path: "clientes",
        element: <Customers />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
    ],
  },
])

export default router;