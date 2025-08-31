// src/ProtectedRoute.jsx  
import { Navigate } from 'react-router-dom';  

const ProtectedRoute = ({ isLoggedIn, children }) => {
  const role = localStorage.getItem('role') || null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

//   if (role === 'ShopTechnician') {
//     return <Navigate to="/TechnicianClocking" replace />;
//   }

  return children;
};

export default ProtectedRoute;
