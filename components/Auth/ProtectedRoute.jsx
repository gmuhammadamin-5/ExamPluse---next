// components/Auth/ProtectedRoute.jsx
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const router = useRouter();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!currentUser) {
    router.push('/');
    return null;
  }

  return children;
};

export default ProtectedRoute;
