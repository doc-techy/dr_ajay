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
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null); // Track which appointment is being updated
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({
    type: 'success',
    message: '',
    show: false
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const itemsPerPage = 10;

  const { user, logout, getAuthHeaders, getAccessToken, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const fetchAppointments = useCallback(async (page = currentPage) => {
    try {
      // Enhanced debugging
      console.log('🚀 AdminDashboard - fetchAppointments called');
      console.log('🔍 Backend URL:', backendUrl);
      console.log('👤 User state:', user);
      console.log('🔐 Is authenticated:', isAuthenticated);
      console.log('📄 Fetching page:', page, 'with', itemsPerPage, 'items per page');
      
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
      
      // Add pagination parameters to the URL
      const url = new URL(`${backendUrl}/api/appointments/`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', itemsPerPage.toString());
      
      const response = await fetch(url.toString(), {
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
        setAppointments(data.appointments || data.results || []);
        
        // Handle pagination metadata
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || Math.ceil(data.pagination.total / itemsPerPage));
          setTotalAppointments(data.pagination.total || 0);
        } else if (data.count !== undefined) {
          // Alternative pagination format
          setTotalPages(Math.ceil(data.count / itemsPerPage));
          setTotalAppointments(data.count);
        } else {
          // Fallback - assume current page data
          setTotalPages(1);
          setTotalAppointments(data.appointments?.length || 0);
        }
        
        setCurrentPage(page);
      } else {
        console.error('❌ Appointments fetch failed:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, logout, router, getAuthHeaders, user, isAuthenticated, getAccessToken, currentPage, itemsPerPage]);

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

  // Initial data fetch
  useEffect(() => {
    const initialFetch = async () => {
      if (!authLoading && isAuthenticated) {
        console.log('✅ Auth ready, fetching admin data...');
        await fetchAppointments(1); // Always start from page 1
        await fetchStats();
      } else if (!authLoading && !isAuthenticated) {
        console.log('❌ Not authenticated, redirecting...');
        router.push('/admin/login');
      }
    };
    
    initialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, router]);

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    setUpdatingStatus(appointmentId); // Set loading state for this specific appointment
    
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
        fetchAppointments(currentPage); // Refresh current page
        fetchStats();
        showNotification('success', 'Appointment status updated successfully!');
      } else {
        showNotification('error', 'Error updating appointment: ' + data.error);
      }
    } catch {
      showNotification('error', 'Error updating appointment');
    } finally {
      setUpdatingStatus(null); // Clear loading state
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
        // If we're on the last page and it only has 1 item, go to previous page
        const shouldGoToPreviousPage = currentPage > 1 && appointments.length === 1;
        const pageToFetch = shouldGoToPreviousPage ? currentPage - 1 : currentPage;
        
        fetchAppointments(pageToFetch);
        fetchStats();
        showNotification('success', 'Appointment deleted successfully!');
      } else {
        showNotification('error', 'Error deleting appointment: ' + data.error);
      }
    } catch {
      showNotification('error', 'Error deleting appointment');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 flex items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Loading Dashboard</h3>
          <p className="text-gray-300">Fetching your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900">
      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div className={`rounded-lg p-4 shadow-lg border-l-4 transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-blue-50 border-blue-400 text-blue-800'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className="ml-3 flex-shrink-0"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logout Button - Top Right */}
          <div className="absolute top-8 right-8">
            <button
              onClick={handleLogout}
              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-lg mb-4">
              Dr. Ajay Krishna Murthy - Practice Management
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-300 mb-6">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Welcome back, <span className="font-semibold text-white">{user?.username}</span></span>
              <span className="text-gray-400">•</span>
              <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
                <div className="text-sm font-medium text-gray-600">Total Appointments</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
                <div className="text-sm font-medium text-gray-600">Pending</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.confirmed}</div>
                <div className="text-sm font-medium text-gray-600">Confirmed</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.completed}</div>
                <div className="text-sm font-medium text-gray-600">Completed</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-1">{stats.cancelled}</div>
                <div className="text-sm font-medium text-gray-600">Cancelled</div>
              </div>
            </div>
          )}

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Appointments</h2>
                  <p className="text-gray-600 mt-1">Manage and track patient appointments</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Updates</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Patient Information
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Appointment Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1m0 4v1m4-8v1m0 4v1m-4-5h4m-4 5h4" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Appointments Found</h3>
                          <p className="text-gray-500 text-sm">When patients book appointments, they will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                            {appointment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{appointment.name}</div>
                            <div className="text-sm text-gray-500">{appointment.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {appointment.phone}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{appointment.date}</div>
                          <div className="mx-2 w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="text-sm text-gray-600">{appointment.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <select
                              value={appointment.status}
                              onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                              disabled={updatingStatus === appointment.id}
                              className={`text-xs border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                                updatingStatus === appointment.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {updatingStatus === appointment.id && (
                              <div className="absolute inset-y-0 right-2 flex items-center">
                                <div className="w-3 h-3 border border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalAppointments)} of {totalAppointments} appointments
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchAppointments(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      const isActive = pageNumber === currentPage;
                      const shouldShow = 
                        pageNumber === 1 || 
                        pageNumber === totalPages || 
                        (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2);
                      
                      if (!shouldShow) {
                        if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                          return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => fetchAppointments(pageNumber)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => fetchAppointments(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Modal for appointment details */}
          {showModal && selectedAppointment && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      {selectedAppointment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Appointment Details</h3>
                      <p className="text-gray-600">Patient Information Overview</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Patient Name</label>
                      <p className="text-lg font-medium text-gray-900">{selectedAppointment.name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                      <p className="text-sm text-gray-900 break-all">{selectedAppointment.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number</label>
                      <p className="text-lg font-medium text-gray-900">{selectedAppointment.phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Appointment Date & Time</label>
                      <p className="text-lg font-medium text-gray-900">{selectedAppointment.date}</p>
                      <p className="text-sm text-gray-600">{selectedAppointment.time}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Patient Message</label>
                    <p className="text-sm text-gray-900 leading-relaxed">{selectedAppointment.message || 'No message provided'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Current Status</label>
                      <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Appointment ID</label>
                      <p className="text-sm font-mono text-gray-900">#{selectedAppointment.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    Close Details
                  </button>
                  <button
                    onClick={() => {
                      // Add edit functionality here if needed
                      setShowModal(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    Edit Appointment
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Back to Website */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="text-white hover:text-amber-300 text-sm font-medium transition-colors duration-200"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 