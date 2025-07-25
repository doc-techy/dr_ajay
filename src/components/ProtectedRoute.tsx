'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = true 
}) => {
  const { loading, isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('🛡️ ProtectedRoute check:', { 
      loading, 
      isAuthenticated, 
      isAdmin, 
      requireAdmin,
      hasUser: !!user,
      userDetails: user ? {
        id: user.id,
        username: user.username,
        is_staff: user.is_staff,
        is_superuser: user.is_superuser
      } : null
    });

    // Don't make any routing decisions while auth is still loading
    if (loading) {
      return;
    }

    // Auth has finished loading, now make routing decisions
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      router.push('/admin/login');
      return;
    }

    // User is authenticated
    if (requireAdmin) {
      // For admin routes, we need to ensure the user object is loaded
      // and check their admin status
      if (user && (user.is_staff || user.is_superuser)) {
        console.log('✅ Admin access granted, showing content');
        setIsChecking(false);
      } else if (user && !user.is_staff && !user.is_superuser) {
        console.log('❌ Not admin, redirecting to home');
        router.push('/');
        return;
      } else if (!user) {
        // User is authenticated but user data is not loaded yet
        // This can happen during the brief moment after login
        console.log('⏳ User authenticated but user data not loaded yet, waiting...');
        return;
      }
    } else {
      // For non-admin routes, just being authenticated is enough
      console.log('✅ Access granted, showing content');
      setIsChecking(false);
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router, user]);

  // Show loading spinner while checking authentication
  if (loading || isChecking || (isAuthenticated && requireAdmin && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {loading ? 'Loading authentication...' : 
             isAuthenticated && requireAdmin && !user ? 'Loading user data...' : 
             'Verifying access...'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Auth Loading: {loading.toString()} | Checking: {isChecking.toString()} | Has User: {!!user}
          </p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated or not admin
  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 