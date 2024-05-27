import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppStore } from "../lib/zustand/store";

export interface IProtectedRoute {}

const ProtectedRoute: React.FC<IProtectedRoute> = () => {
  const { userData, setUserData } = useAppStore();

  if (userData.token === "") return <Navigate to="/auth/signin" />;

  if (userData.loginTime + userData.expireTime * 1000 < new Date().getTime()) {
    setUserData(false, "", "", "", " ", "", 0, 0);

    return <Navigate to="/auth/signin" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
