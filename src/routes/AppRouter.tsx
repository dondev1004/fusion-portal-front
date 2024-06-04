import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import {
  AdminDashboard,
  DomainsDashboard,
  ExtensionsDashboard,
  UsersDashboard,
} from "../pages/admin";
import SignIn from "../pages/auth/signIn";
import SignUp from "../pages/auth/signUp";
import Verify from "../pages/auth/verify";
import { CustomerDashboard } from "../pages/customer";

import ProtectedRoute from "./ProtectedRoute";

const AppRouter: React.FC = () => {
  const routesForPublic = [
    {
      path: "/auth/signin",
      element: <SignIn />,
    },
    {
      path: "/auth/signup",
      element: <SignUp />,
    },
    {
      path: "/auth/verify",
      element: <Verify />,
    },
    // {
    //   path: "*",
    //   element: <PageNotFound />,
    // },
  ];

  const routersForAuthenticatedOnly = [
    {
      path: "/",
      element: <Navigate to="/admin" replace />,
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
        {
          path: "/admin/domains/default",
          element: <DomainsDashboard />,
        },
        {
          path: "/admin/extensions/default",
          element: <ExtensionsDashboard />,
        },
        {
          path: "/admin/users/default",
          element: <UsersDashboard />,
        },
        {
          path: "/customer",
          element: <CustomerDashboard />,
        },
      ],
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...routersForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
