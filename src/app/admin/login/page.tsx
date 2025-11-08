'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Disabled</h1>
        <p className="text-sm text-gray-600">
          The admin portal is currently unavailable. You are being redirected to the homepage.
        </p>
      </div>
    </div>
  );
}