'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DebugAuthState() {
  const { user, loading, isAuthenticated, isAdmin, getAccessToken } = useAuth();
  const router = useRouter();

  const token = getAccessToken();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug State</h3>
      <div className="space-y-1">
        <div>Loading: <span className="text-yellow-300">{loading.toString()}</span></div>
        <div>Authenticated: <span className="text-green-300">{isAuthenticated.toString()}</span></div>
        <div>Is Admin: <span className="text-blue-300">{isAdmin.toString()}</span></div>
        <div>User Exists: <span className="text-purple-300">{(!!user).toString()}</span></div>
        <div>Token Exists: <span className="text-orange-300">{(!!token).toString()}</span></div>
        {user && (
          <div className="mt-2 text-gray-300">
            <div>Username: {user.username}</div>
            <div>Staff: {user.is_staff?.toString()}</div>
            <div>Superuser: {user.is_superuser?.toString()}</div>
          </div>
        )}
        <div className="mt-3 space-y-1">
          <button 
            onClick={() => router.push('/admin')}
            className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Force Navigate to /admin
          </button>
          <button 
            onClick={() => console.log('Current localStorage tokens:', {
              access: localStorage.getItem('access_token')?.substring(0, 20) + '...',
              refresh: localStorage.getItem('refresh_token')?.substring(0, 20) + '...'
            })}
            className="block w-full bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs"
          >
            Log Tokens to Console
          </button>
        </div>
      </div>
    </div>
  );
} 