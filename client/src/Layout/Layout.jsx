import React from "react";
import { Outlet } from "react-router-dom";
import { useGetUserQuery } from "../store/features/user/api/userApiSlice";

const Layout = () => {
  const { isLoading } = useGetUserQuery();

  return isLoading ? null : <Outlet />;
};

export default Layout;
