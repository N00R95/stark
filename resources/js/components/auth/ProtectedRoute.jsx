import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, userType }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userType && user.profile?.type !== userType) {
    return <Navigate to={`/${user.profile?.type}/properties`} replace />;
  }

  return children;
}
