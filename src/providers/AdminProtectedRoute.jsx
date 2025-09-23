// src/providers/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, isAdminLoading } = useAdminAuth();

  if (isAdminLoading) {
    return <div>관리자 인증 확인 중...</div>; // Or a loading spinner
  }

  if (!isAdminAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them along
    // to that page after they login, which is a nicer user experience
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
