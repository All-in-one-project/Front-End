// ProtectedPage.jsx
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';

const ProtectedPage = ({ redirectTo, children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isAuthenticated) {
      navigate(redirectTo);
    }
  }, [user, redirectTo, navigate]);

  return <>{children}</>;
};

export default ProtectedPage;
