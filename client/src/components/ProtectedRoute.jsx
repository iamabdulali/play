import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isUserLoggedIn = useSelector((state) => state.user.status);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoggedIn) navigate("/login");
    setLoading(false);
  }, [isUserLoggedIn, loading]);

  return loading ? null : <>{children}</>;
};

export default ProtectedRoute;
