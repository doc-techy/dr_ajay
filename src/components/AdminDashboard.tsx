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
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200';
      case 'confirmed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
      case 'completed': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200';
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200';
      default: return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-transparent bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-spin mx-auto mb-6">
              <div className="absolute inset-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse opacity-75 mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Dashboard</h3>
          <p className="text-slate-500">Fetching your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Admin Dashboard
                      </h1>
                      <p className="text-slate-600 text-lg">Dr. Ajay Krishna Murthy - Practice Management</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Welcome back, <span className="font-semibold text-slate-700">{user?.username}</span></span>
                    <span className="text-slate-400">•</span>
                    <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:block text-right bg-slate-50 rounded-xl p-3">
                    <p className="text-sm text-slate-500">Current Session</p>
                    <p className="font-semibold text-slate-700">{new Date().toLocaleTimeString()}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</div>
                <div className="text-sm font-medium text-slate-600">Total Appointments</div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
                <div className="text-sm font-medium text-slate-600">Pending</div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.confirmed}</div>
                <div className="text-sm font-medium text-slate-600">Confirmed</div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.completed}</div>
                <div className="text-sm font-medium text-slate-600">Completed</div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-1">{stats.cancelled}</div>
                <div className="text-sm font-medium text-slate-600">Cancelled</div>
              </div>
            </div>
          )}

          {/* Appointments Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Recent Appointments</h2>
                  <p className="text-slate-600 mt-1">Manage and track patient appointments</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600">Live Updates</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/50">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Patient Information
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Contact Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Appointment Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200/30">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1m0 4v1m4-8v1m0 4v1m-4-5h4m-4 5h4" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Appointments Found</h3>
                          <p className="text-slate-500 text-sm">When patients book appointments, they will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                            {appointment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{appointment.name}</div>
                            <div className="text-sm text-slate-500">{appointment.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center text-sm text-slate-700">
                          <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {appointment.phone}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-slate-900">{appointment.date}</div>
                          <div className="mx-2 w-1 h-1 bg-slate-400 rounded-full"></div>
                          <div className="text-sm text-slate-600">{appointment.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <select
                            value={appointment.status}
                            onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
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
                            className="inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs font-medium rounded-lg transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button
                            onClick={() => deleteAppointment(appointment.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium rounded-lg transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
        </div>

          {/* Enhanced Modal for appointment details */}
          {showModal && selectedAppointment && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-white/20 transform transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      {selectedAppointment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">Appointment Details</h3>
                      <p className="text-slate-600">Patient Information Overview</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/50 rounded-2xl p-4">
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Patient Name</label>
                      <p className="text-lg font-medium text-slate-900">{selectedAppointment.name}</p>
                    </div>
                    <div className="bg-slate-50/50 rounded-2xl p-4">
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Email Address</label>
                      <p className="text-sm text-slate-900 break-all">{selectedAppointment.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/50 rounded-2xl p-4">
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Phone Number</label>
                      <p className="text-lg font-medium text-slate-900">{selectedAppointment.phone}</p>
                    </div>
                    <div className="bg-slate-50/50 rounded-2xl p-4">
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Appointment Date & Time</label>
                      <p className="text-lg font-medium text-slate-900">{selectedAppointment.date}</p>
                      <p className="text-sm text-slate-600">{selectedAppointment.time}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-2xl p-4">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Patient Message</label>
                    <p className="text-sm text-slate-900 leading-relaxed">{selectedAppointment.message || 'No message provided'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-50/50 rounded-2xl p-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Current Status</label>
                      <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Appointment ID</label>
                      <p className="text-sm font-mono text-slate-900">#{selectedAppointment.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Close Details
                  </button>
                  <button
                    onClick={() => {
                      // Add edit functionality here if needed
                      setShowModal(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Edit Appointment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 