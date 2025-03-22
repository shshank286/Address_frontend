import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { openPopup, closePopup } from "../Context/authSlice";
import Popup from "./Popup";


const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const isPopupOpen = useSelector((state) => state.auth.isPopupOpen);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAdminLoggedIn = useSelector((state) => state.auth.isAdminLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn && !isPopupOpen) {
      dispatch(openPopup());
    }
  }, [isLoggedIn, isPopupOpen, dispatch]);

  if (!isLoggedIn) {
    // Redirect to home route if user is not logged in
    return <Navigate to="/" replace />;
  }

  // Render the protected content if logged in
  return (
    <>
      {!isLoggedIn && isPopupOpen && <Popup />}
      {children}
    </>
  );
};

export default ProtectedRoute;
