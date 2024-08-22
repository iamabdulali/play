import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const LoggedInUserLayout = ({ avatar, children }) => {
  return (
    <div class="h-screen overflow-y-auto bg-[#121212] text-white">
      <Header avatar={avatar} />
      <div class="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default LoggedInUserLayout;
