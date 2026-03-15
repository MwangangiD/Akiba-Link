import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 1. Check the browser's memory for the digital token
  const token = localStorage.getItem('token');

  // 2. If no token exists, immediately redirect them to the Login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. If they DO have a token, render whatever page they were trying to visit (the children)
  return children;
};

export default ProtectedRoute;