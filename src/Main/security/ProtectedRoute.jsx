import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user }) => {
   localStorage.clear();
      sessionStorage.clear();
  if (!user) {
 
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default ProtectedRoute;
