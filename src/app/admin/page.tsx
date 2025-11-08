'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6 py-10 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Admin Access Disabled</h1>
        <p className="text-sm text-gray-600 max-w-sm">
          The admin dashboard is temporarily unavailable. You are being redirected to the main site.
        </p>
      </div>
    </div>
  );
}