import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoading, currentUser } = useAuth();
  const location = useLocation();

  console.log('[AuthWrapper] Rendering with state:', {
    isLoading,
    hasUser: !!currentUser,
    pathname: location.pathname,
    state: location.state
  });

  useEffect(() => {
    console.log('[AuthWrapper] Mount effect running');
    return () => {
      console.log('[AuthWrapper] Cleanup effect running');
    };
  }, []);

  useEffect(() => {
    console.log('[AuthWrapper] Auth state changed:', {
      isLoading,
      hasUser: !!currentUser,
      pathname: location.pathname
    });
  }, [isLoading, currentUser, location.pathname]);

  if (isLoading) {
    console.log('[AuthWrapper] Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser && location.pathname !== '/auth') {
    console.log('[AuthWrapper] No user, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (currentUser && location.pathname === '/auth') {
    console.log('[AuthWrapper] User authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('[AuthWrapper] Rendering children');
  return <>{children}</>;
};

export default AuthWrapper;