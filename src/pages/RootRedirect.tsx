
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const RootRedirect: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  console.log('RootRedirect: Auth loading:', authLoading, 'User:', user?.id);
  console.log('RootRedirect: Role loading:', roleLoading, 'Role:', role);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role === 'candidate') {
    return <Navigate to="/candidate" replace />;
  }

  if (role === 'recruiter') {
    return <Navigate to="/dashboard" replace />;
  }

  // If no role is found, redirect to auth
  return <Navigate to="/auth" replace />;
};

export default RootRedirect;
