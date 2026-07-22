import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const PublicOnlyRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="flex flex-col items-center gap-3 p-6 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xl">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (user && isAdmin) {
    const destination = location.state?.from?.pathname || '/admin';
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
