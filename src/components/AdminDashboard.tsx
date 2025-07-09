'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { user, logout, getAuthHeaders, getAccessToken, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

  const fetchAppointments = useCallback(async () => {
    try {
      // Enhanced debugging
      console.log('🚀 AdminDashboard - fetchAppointments called');
      console.log('🔍 Backend URL:', backendUrl);
      console.log('👤 User state:', user);
      console.log('🔐 Is authenticated:', isAuthenticated);
      
      const token = getAccessToken();
      console.log('🎫 Raw access token:', token);
      console.log('🎫 Token length:', token ? token.length : 'null');
      
      const headers = getAuthHeaders();
      console.log('🚀 Fetching appointments with headers:', headers);
      console.log('📋 Headers breakdown:', {
        hasContentType: !!headers['Content-Type'],
        hasAuthorization: !!headers.Authorization,
        authHeaderLength: headers.Authorization ? headers.Authorization.length : 'none'
      });
      
      if (!headers.Authorization) {
        console.error('❌ No Authorization header available');
        console.error('🚨 This suggests the token is not properly stored or retrieved');
        return;
      }
      
      const response = await fetch(`${backendUrl}/api/appointments/`, {
        headers,
      });
      
      console.log('📡 Appointments API Response Status:', response.status);
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 401) {
        console.error('❌ Unauthorized - Token might be invalid or expired');
        const responseText = await response.text();
        console.error('❌ 401 Response body:', responseText);
        logout();
        router.push('/admin/login');
        return;
      }
      
      const data = await response.json();
      console.log('📋 Appointments data:', data);
      
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        console.error('❌ Appointments fetch failed:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, logout, router, getAuthHeaders, user, isAuthenticated, getAccessToken]);

  const fetchStats = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      console.log('📊 Fetching stats with headers:', headers);
      
      if (!headers.Authorization) {
        console.error('❌ No Authorization header available');
        return;
      }
      
      const response = await fetch(`${backendUrl}/api/appointments/stats/`, {
        headers,
      });
      
      console.log('📡 Stats API Response Status:', response.status);
      
      if (response.status === 401) {
        console.error('❌ Unauthorized - redirecting to login');
        logout();
        router.push('/admin/login');
        return;
      }
      
      const data = await response.json();
      console.log('📊 Stats data:', data);
      
      if (data.success) {
        setStats(data.stats);
      } else {
        console.error('❌ Stats fetch failed:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  }, [backendUrl, logout, router, getAuthHeaders]);

  useEffect(() => {
    // Only fetch data when auth is ready and user is authenticated
    if (!authLoading && isAuthenticated) {
      console.log('✅ Auth ready, fetching admin data...');
      fetchAppointments();
      fetchStats();
    } else if (!authLoading && !isAuthenticated) {
      console.log('❌ Not authenticated, redirecting...');
      router.push('/admin/login');
    }
  }, [fetchAppointments, fetchStats, authLoading, isAuthenticated, router]);

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/appointments/${appointmentId}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (response.status === 401) {
        logout();
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        fetchAppointments();
        fetchStats();
        alert('Appointment status updated successfully!');
      } else {
        alert('Error updating appointment: ' + data.error);
      }
    } catch {
      alert('Error updating appointment');
    }
  };

  const deleteAppointment = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`${backendUrl}/api/appointments/${appointmentId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        logout();
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        fetchAppointments();
        fetchStats();
        alert('Appointment deleted successfully!');
      } else {
        alert('Error deleting appointment: ' + data.error);
      }
    } catch {
      alert('Error deleting appointment');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Debug Panel */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">🔍 Debug Info</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="font-medium text-blue-700">Auth Loading:</span>
              <span className={`ml-1 ${authLoading ? 'text-orange-600' : 'text-green-600'}`}>
                {authLoading ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Is Authenticated:</span>
              <span className={`ml-1 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">User:</span>
              <span className="ml-1 text-gray-700">
                {user ? user.username : 'None'}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Token:</span>
              <span className={`ml-1 ${getAccessToken() ? 'text-green-600' : 'text-red-600'}`}>
                {getAccessToken() ? 'Present' : 'Missing'}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Backend URL:</span>
              <span className="ml-1 text-gray-700 break-all">
                {backendUrl}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Page Loading:</span>
              <span className={`ml-1 ${loading ? 'text-orange-600' : 'text-green-600'}`}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.username} • Manage all appointment bookings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-medium text-gray-900">{user?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Appointments</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </div>
        )}

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                      <div className="text-sm text-gray-500">{appointment.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <select
                          value={appointment.status}
                          onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowModal(true);
                          }}
                          className="text-amber-600 hover:text-amber-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for appointment details */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Appointment Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.date} at {selectedAppointment.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.message || 'No message provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 