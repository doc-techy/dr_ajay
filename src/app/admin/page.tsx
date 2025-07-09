'use client';

import { AdminDashboard } from '@/components';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={false}>
      <AdminDashboard />
    </ProtectedRoute>
  );
} 