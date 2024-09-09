// PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx'; // UserContext 경로에 맞게 수정하세요.

const PrivateRoute = ({ element, redirectTo = '/login' }) => {
  const { user } = useContext(UserContext); // UserContext에서 사용자 정보를 가져옴

  if (!user || !user.isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return element;
};

export default PrivateRoute;
