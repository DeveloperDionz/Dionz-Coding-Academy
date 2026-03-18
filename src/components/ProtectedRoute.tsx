import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show preloader while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="relative h-32 w-32">
          {/* Spinning circle */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>

          {/* Your image in the middle */}
          <img
            src="/favicon.ico"
            alt="Loading"
            className="absolute inset-0 m-auto h-16 w-16 object-contain"
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
