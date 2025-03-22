import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";


const AdminProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = useSelector((state) => state.auth.isAdminLoggedIn);

  if (!isAdminLoggedIn) {
    // Redirect to home route if user is not logged in
    return <Navigate to="/admin" replace />;
  }

  // Render the protected content if logged in
  return <>{children}</>;
};

export default AdminProtectedRoute;
