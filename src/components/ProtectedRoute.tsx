
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('DEBUG: ProtectedRoute component rendered');
  const { user, loading } = useAuth();
  console.log('DEBUG: ProtectedRoute - auth state:', { user: user ? `User ID: ${user.id}` : 'No user', loading });
  const location = useLocation();
  console.log('DEBUG: ProtectedRoute - current location:', location.pathname);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('DEBUG: ProtectedRoute useEffect triggered - loading:', loading, 'user:', user ? 'Exists' : 'None');
    if (!loading && !user) {
      console.log('DEBUG: ProtectedRoute - showing auth required toast');
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
    }
  }, [loading, user, toast]);
  
  if (loading) {
    console.log('DEBUG: ProtectedRoute - still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D724D]"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log('DEBUG: ProtectedRoute - no user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log('DEBUG: ProtectedRoute - user authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
