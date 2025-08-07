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

interface DoctorAvailability {
  availability_id: number;
  date?: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  is_recurring: boolean;
  day_of_week?: number;
  created_at: string;
  updated_at: string;
}

interface AvailableSlot {
  start_time: string;
  end_time: string;
  slot_time: string;
  is_available: boolean;
  appointment_id?: number;
}

interface BlockedSlot {
  blocked_id: number;
  date?: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  day_of_week?: number;
  reason: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null); // Track which appointment is being updated
  
  // Filter state for appointments
  const [appointmentFilters, setAppointmentFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    searchTerm: ''
  });
  

  
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

  // Availability management state
  const [activeTab, setActiveTab] = useState<'appointments' | 'availability' | 'blocks' | 'slots'>('appointments');
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  // Blocked slots management state
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loadingBlockedSlots, setLoadingBlockedSlots] = useState(false);
  
  // Recurring schedule form state
  const [recurringForm, setRecurringForm] = useState({
    days: [] as number[],
    start_time: '09:00',
    end_time: '17:00',
    slot_duration: 30
  });
  
  // Specific date form state  
  const [specificDateForm, setSpecificDateForm] = useState({
    date: '',
    start_time: '09:00',
    end_time: '17:00',
    slot_duration: 30
  });

  // Blocked slots form state
  const [blockedRecurringForm, setBlockedRecurringForm] = useState({
    days: [] as number[],
    start_time: '13:00',
    end_time: '14:00',
    reason: 'Lunch Break'
  });
  
  const [blockedSpecificForm, setBlockedSpecificForm] = useState({
    date: '',
    start_time: '14:00',
    end_time: '15:00',
    reason: 'Meeting'
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

  // Server-side filtering is now handled by the API
  // The appointments array contains the filtered results from the server

  // Clear all filters
  const clearFilters = () => {
    setAppointmentFilters({
      dateFrom: '',
      dateTo: '',
      status: 'all',
      searchTerm: ''
    });
  };

  // Availability management functions
  const fetchAvailabilities = useCallback(async () => {
    setLoadingAvailability(true);
    try {
      const headers = getAuthHeaders();
      console.log('🔍 Fetching availabilities from:', `${backendUrl}/api/availability/`);
      console.log('📤 Request headers:', headers);
      
      const response = await fetch(`${backendUrl}/api/availability/`, {
        headers,
      });

      console.log('📡 Availability API Response Status:', response.status);

      if (response.status === 401) {
        logout();
        router.push('/admin/login');
        return;
      }

      // Check if response is ok
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Availability API endpoint not found (404). Backend might not be implemented yet.');
          showNotification('info', 'Availability management not yet implemented on backend');
          // Set some mock data for demonstration
          setAvailabilities([
            {
              availability_id: 1,
              start_time: '09:00',
              end_time: '17:00',
              slot_duration: 30,
              is_recurring: true,
              day_of_week: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              availability_id: 2,
              start_time: '09:00',
              end_time: '17:00',
              slot_duration: 30,
              is_recurring: true,
              day_of_week: 2,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📋 Availability API Response Data:', data);
      
      if (data.success) {
        console.log('✅ Setting availabilities:', data.availability || []);
        setAvailabilities(data.availability || []);
      } else {
        console.error('❌ API returned success: false', data.error);
        showNotification('error', data.error || 'Failed to fetch availabilities');
      }
    } catch (error) {
      console.error('❌ Error fetching availabilities:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('fetch')) {
        showNotification('error', 'Backend server not reachable. Please check if the backend is running.');
      } else {
        showNotification('error', `Failed to fetch availabilities: ${errorMessage}`);
      }
    } finally {
      setLoadingAvailability(false);
    }
  }, [backendUrl, getAuthHeaders, logout, router, showNotification]);

  const fetchAvailableSlots = useCallback(async (date: string) => {
    setLoadingAvailability(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${backendUrl}/api/slots/detailed/?date=${date}`, {
        headers,
      });

      if (response.status === 401) {
        logout();
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setAvailableSlots(data.slots || []);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      showNotification('error', 'Failed to fetch available slots');
    } finally {
      setLoadingAvailability(false);
    }
  }, [backendUrl, getAuthHeaders, logout, router]);

  const createRecurringAvailability = async () => {
    if (recurringForm.days.length === 0) {
      showNotification('error', 'Please select at least one day');
      return;
    }

    try {
      const headers = getAuthHeaders();
      console.log('🔄 Creating recurring availability:', recurringForm);
      
      const response = await fetch(`${backendUrl}/api/availability/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(recurringForm),
      });

      console.log('📡 Create Recurring Response Status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          showNotification('info', 'Availability creation not yet implemented on backend');
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📋 Create Recurring Response Data:', data);
      
      if (data.success) {
        showNotification('success', 'Recurring schedule created successfully');
        setRecurringForm({
          days: [],
          start_time: '09:00',
          end_time: '17:00',
          slot_duration: 30
        });
        fetchAvailabilities();
      } else {
        showNotification('error', data.error || 'Failed to create recurring schedule');
      }
    } catch (error) {
      console.error('❌ Error creating recurring availability:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('fetch')) {
        showNotification('error', 'Backend server not reachable');
      } else {
        showNotification('error', `Failed to create recurring schedule: ${errorMessage}`);
      }
    }
  };

  const createSpecificDateAvailability = async () => {
    if (!specificDateForm.date) {
      showNotification('error', 'Please select a date');
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${backendUrl}/api/availability/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...specificDateForm,
          is_recurring: false
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('success', 'Specific date availability created successfully');
        setSpecificDateForm({
          date: '',
          start_time: '09:00',
          end_time: '17:00',
          slot_duration: 30
        });
        fetchAvailabilities();
      } else {
        showNotification('error', data.error || 'Failed to create specific date availability');
      }
    } catch (error) {
      console.error('Error creating specific date availability:', error);
      showNotification('error', 'Failed to create specific date availability');
    }
  };

  const deleteAvailability = async (availabilityId: number) => {
    if (!confirm('Are you sure you want to delete this availability?')) return;

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${backendUrl}/api/availability/${availabilityId}/`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        showNotification('success', 'Availability deleted successfully');
        fetchAvailabilities();
      } else {
        showNotification('error', 'Failed to delete availability');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      showNotification('error', 'Failed to delete availability');
    }
  };

  // Blocked slots management functions
  const fetchBlockedSlots = useCallback(async () => {
    setLoadingBlockedSlots(true);
    try {
      const headers = getAuthHeaders();
      console.log('🔍 Fetching blocked slots from:', `${backendUrl}/api/blocked-slots/`);
      
      const response = await fetch(`${backendUrl}/api/blocked-slots/`, {
        headers,
      });

      console.log('📡 Blocked Slots API Response Status:', response.status);

      if (response.status === 401) {
        logout();
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Blocked slots API endpoint not found (404). Backend might not be implemented yet.');
          showNotification('info', 'Blocked slots management not yet implemented on backend');
          setBlockedSlots([]);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📋 Blocked Slots API Response Data:', data);
      
      if (data.success) {
        console.log('✅ Setting blocked slots:', data.blocked_slots || []);
        setBlockedSlots(data.blocked_slots || []);
      } else {
        console.error('❌ API returned success: false', data.error);
        showNotification('error', data.error || 'Failed to fetch blocked slots');
      }
    } catch (error) {
      console.error('❌ Error fetching blocked slots:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('fetch')) {
        showNotification('error', 'Backend server not reachable. Please check if the backend is running.');
      } else {
        showNotification('error', `Failed to fetch blocked slots: ${errorMessage}`);
      }
    } finally {
      setLoadingBlockedSlots(false);
    }
  }, [backendUrl, getAuthHeaders, logout, router, showNotification]);

  const createRecurringBlockedSlots = async () => {
    if (blockedRecurringForm.days.length === 0) {
      showNotification('error', 'Please select at least one day');
      return;
    }

    try {
      const headers = getAuthHeaders();
      console.log('🔄 Creating recurring blocked slots:', blockedRecurringForm);
      
      const response = await fetch(`${backendUrl}/api/blocked-slots/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(blockedRecurringForm),
      });

      console.log('📡 Create Recurring Blocked Response Status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          showNotification('info', 'Blocked slots creation not yet implemented on backend');
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📋 Create Recurring Blocked Response Data:', data);
      
      if (data.success) {
        showNotification('success', 'Recurring blocked slots created successfully');
        setBlockedRecurringForm({
          days: [],
          start_time: '13:00',
          end_time: '14:00',
          reason: 'Lunch Break'
        });
        fetchBlockedSlots();
      } else {
        showNotification('error', data.error || 'Failed to create recurring blocked slots');
      }
    } catch (error) {
      console.error('❌ Error creating recurring blocked slots:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('fetch')) {
        showNotification('error', 'Backend server not reachable');
      } else {
        showNotification('error', `Failed to create recurring blocked slots: ${errorMessage}`);
      }
    }
  };

  const createSpecificBlockedSlot = async () => {
    if (!blockedSpecificForm.date) {
      showNotification('error', 'Please select a date');
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${backendUrl}/api/blocked-slots/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...blockedSpecificForm,
          is_recurring: false
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('success', 'Specific blocked slot created successfully');
        setBlockedSpecificForm({
          date: '',
          start_time: '14:00',
          end_time: '15:00',
          reason: 'Meeting'
        });
        fetchBlockedSlots();
      } else {
        showNotification('error', data.error || 'Failed to create specific blocked slot');
      }
    } catch (error) {
      console.error('Error creating specific blocked slot:', error);
      showNotification('error', 'Failed to create specific blocked slot');
    }
  };

  const deleteBlockedSlot = async (blockedId: number) => {
    if (!confirm('Are you sure you want to delete this blocked slot?')) return;

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${backendUrl}/api/blocked-slots/${blockedId}/`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        showNotification('success', 'Blocked slot deleted successfully');
        fetchBlockedSlots();
      } else {
        showNotification('error', 'Failed to delete blocked slot');
      }
    } catch (error) {
      console.error('Error deleting blocked slot:', error);
      showNotification('error', 'Failed to delete blocked slot');
    }
  };

  const fetchAppointments = useCallback(async (page = currentPage, filters = appointmentFilters) => {
    try {
      // Enhanced debugging
      console.log('🚀 AdminDashboard - fetchAppointments called');
      console.log('🔍 Backend URL:', backendUrl);
      console.log('👤 User state:', user);
      console.log('🔐 Is authenticated:', isAuthenticated);
      console.log('📄 Fetching page:', page, 'with', itemsPerPage, 'items per page');
      console.log('🔍 Applied filters:', filters);
      
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
      
      // Add pagination and filter parameters to the URL
      const url = new URL(`${backendUrl}/api/appointments/`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', itemsPerPage.toString());
      
      // Add filter parameters
      if (filters.status !== 'all') {
        url.searchParams.append('status', filters.status);
      }
      if (filters.dateFrom) {
        url.searchParams.append('date_from', filters.dateFrom);
      }
      if (filters.dateTo) {
        url.searchParams.append('date_to', filters.dateTo);
      }
      if (filters.searchTerm) {
        url.searchParams.append('search', filters.searchTerm);
      }
      
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
  }, [backendUrl, logout, router, getAuthHeaders, user, isAuthenticated, getAccessToken, currentPage, itemsPerPage, appointmentFilters]);

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
        await fetchAppointments(1, {
          dateFrom: '',
          dateTo: '',
          status: 'all',
          searchTerm: ''
        }); // Always start from page 1 with no filters
        await fetchStats();
    } else if (!authLoading && !isAuthenticated) {
      console.log('❌ Not authenticated, redirecting...');
      router.push('/admin/login');
    }
    };
    
    initialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, router]);

  // Handle filter changes and trigger server-side filtering
  useEffect(() => {
    // Skip the initial render to avoid double fetching
    if (appointments.length > 0) {
      // Reset to page 1 when filters change
      setCurrentPage(1);
      fetchAppointments(1, appointmentFilters);
    }
  }, [appointmentFilters, fetchAppointments]);

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
        fetchAppointments(currentPage, appointmentFilters); // Refresh current page with current filters
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



  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg';
      case 'confirmed': return 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg';
      case 'completed': return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg';
      case 'cancelled': return 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg';
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber - 1] || `Day ${dayNumber}`;
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
          <div className="mx-auto h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8 transform animate-pulse">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center relative">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-2 border-transparent border-r-amber-300 rounded-full animate-ping"></div>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-3 animate-pulse">Loading Dashboard</h3>
          <p className="text-gray-300 text-lg">Fetching your appointments...</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
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

          {/* Tab Navigation */}
          <div className="flex justify-center mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2">
              <div className="flex space-x-2">
            <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'appointments'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1m0 4v1m4-8v1m0 4v1m-4-5h4m-4 5h4" />
              </svg>
                  Appointments
                </button>
                <button
                  onClick={() => {
                    setActiveTab('availability');
                    fetchAvailabilities();
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'availability'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1m0 4v1m4-8v1m0 4v1m-4-5h4m-4 5h4" />
                  </svg>
                  Availability
                </button>
                <button
                  onClick={() => {
                    setActiveTab('blocks');
                    fetchBlockedSlots();
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'blocks'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                  Blocked Slots
                </button>
                <button
                  onClick={() => {
                    setActiveTab('slots');
                    fetchAvailableSlots(selectedDate);
                  }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'slots'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available Slots
            </button>
              </div>
          </div>
        </div>

          {/* Tab Content */}
          {activeTab === 'appointments' && (
            <>
        {/* Stats Cards */}
                {stats && (
                  <>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <div 
                    className="bg-white rounded-xl p-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                          <div className="text-xs font-medium text-gray-600">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white rounded-xl p-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
                          <div className="text-xs font-medium text-gray-600">Pending</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white rounded-xl p-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{stats.confirmed}</div>
                          <div className="text-xs font-medium text-gray-600">Confirmed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white rounded-xl p-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">{stats.completed}</div>
                          <div className="text-xs font-medium text-gray-600">Completed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white rounded-xl p-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">{stats.cancelled}</div>
                          <div className="text-xs font-medium text-gray-600">Cancelled</div>
                        </div>
                      </div>
                    </div>
                  </div>
                    </div>
                  </>
                )}

        {/* Appointments Table */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
                      <p className="text-gray-600 mt-1 text-sm">Manage and track patient appointments</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Live Updates</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Showing {appointments.length} of {totalAppointments} appointments
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters Section */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                      <input
                        type="text"
                        placeholder="Name, email, phone..."
                        value={appointmentFilters.searchTerm}
                        onChange={(e) => setAppointmentFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Date From */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                      <input
                        type="date"
                        value={appointmentFilters.dateFrom}
                        onChange={(e) => setAppointmentFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    {/* Date To */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                      <input
                        type="date"
                        value={appointmentFilters.dateTo}
                        onChange={(e) => setAppointmentFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>



                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Patient Information
                  </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Contact Details
                  </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Appointment Time
                  </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                {appointments.length === 0 ? 'No Appointments Found' : 'No Appointments Match Filters'}
                              </h3>
                              <p className="text-gray-500 text-sm">
                                {appointments.length === 0 
                                  ? 'When patients book appointments, they will appear here.'
                                  : 'Try adjusting your filters to see more results.'
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                                {appointment.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-gray-900">{appointment.name}</div>
                                <div className="text-xs text-gray-500">{appointment.email}</div>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowModal(true);
                                }}
                                className="ml-2 p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                                title="View Details"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-700">
                              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {appointment.phone}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{appointment.date}</div>
                              <div className="mx-2 w-1 h-1 bg-gray-400 rounded-full"></div>
                              <div className="text-sm text-gray-600">{appointment.time}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full ${getStatusColor(appointment.status)} transform hover:scale-105 transition-all duration-200`}>
                              <div className="w-2 h-2 rounded-full bg-white mr-2 opacity-80"></div>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {appointment.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                    disabled={updatingStatus === appointment.id}
                                    className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                      updatingStatus === appointment.id ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                    disabled={updatingStatus === appointment.id}
                                    className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                      updatingStatus === appointment.id ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                  </button>
                                </>
                              )}
                              {appointment.status === 'confirmed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                  disabled={updatingStatus === appointment.id}
                                  className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                    updatingStatus === appointment.id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Complete
                                </button>
                              )}
                              {updatingStatus === appointment.id && (
                                <div className="flex items-center">
                                  <div className="relative">
                                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 w-5 h-5 border-2 border-transparent border-r-amber-400 rounded-full animate-ping"></div>
                                  </div>
                                </div>
                              )}
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
            </>
          )}

          {/* Availability Management Tab */}
          {activeTab === 'availability' && (
            <div className="space-y-8">
              {/* Recurring Schedule Form */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Recurring Schedule</h2>
                  <p className="text-gray-600 mt-1">Set weekly recurring availability</p>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Select Days</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 1, label: 'Monday' },
                          { value: 2, label: 'Tuesday' },
                          { value: 3, label: 'Wednesday' },
                          { value: 4, label: 'Thursday' },
                          { value: 5, label: 'Friday' },
                          { value: 6, label: 'Saturday' },
                          { value: 7, label: 'Sunday' }
                        ].map(day => (
                          <label key={day.value} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={recurringForm.days.includes(day.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRecurringForm(prev => ({
                                    ...prev,
                                    days: [...prev.days, day.value]
                                  }));
                                } else {
                                  setRecurringForm(prev => ({
                                    ...prev,
                                    days: prev.days.filter(d => d !== day.value)
                                  }));
                                }
                              }}
                              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <span className="text-sm text-gray-700">{day.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                          <input
                            type="time"
                            value={recurringForm.start_time}
                            onChange={(e) => setRecurringForm(prev => ({ ...prev, start_time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                          <input
                            type="time"
                            value={recurringForm.end_time}
                            onChange={(e) => setRecurringForm(prev => ({ ...prev, end_time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slot Duration (minutes)</label>
                        <select
                          value={recurringForm.slot_duration}
                          onChange={(e) => setRecurringForm(prev => ({ ...prev, slot_duration: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={createRecurringAvailability}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                      >
                        Create Recurring Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specific Date Override Form */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Specific Date Override</h2>
                  <p className="text-gray-600 mt-1">Set availability for specific dates</p>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={specificDateForm.date}
                        onChange={(e) => setSpecificDateForm(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                          <input
                            type="time"
                            value={specificDateForm.start_time}
                            onChange={(e) => setSpecificDateForm(prev => ({ ...prev, start_time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                          <input
                            type="time"
                            value={specificDateForm.end_time}
                            onChange={(e) => setSpecificDateForm(prev => ({ ...prev, end_time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slot Duration (minutes)</label>
                        <select
                          value={specificDateForm.slot_duration}
                          onChange={(e) => setSpecificDateForm(prev => ({ ...prev, slot_duration: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={createSpecificDateAvailability}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                      >
                        Create Specific Date Availability
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Availabilities */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Current Availabilities</h2>
                      <p className="text-gray-600 mt-1">Manage existing availability entries</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          console.log('🔍 Current availabilities state:', availabilities);
                          console.log('🔍 Loading state:', loadingAvailability);
                          fetchAvailabilities();
                        }}
                        className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                      <span className="text-sm text-gray-500">
                        {availabilities.length} entries
                      </span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {loadingAvailability ? (
                    <div className="p-8 text-center">
                      <div className="relative mx-auto mb-4">
                        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-r-amber-400 rounded-full animate-ping"></div>
                      </div>
                      <p className="text-gray-600 font-medium">Loading availabilities...</p>
                      <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  ) : availabilities.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1m0 4v1m4-8v1m0 4v1m-4-5h4m-4 5h4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Availabilities Found</h3>
                      <p className="text-gray-500 text-sm mb-4">Create your first availability schedule above, or check the browser console for debugging info.</p>
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                        <h4 className="text-amber-800 font-medium mb-2">🔧 Debugging Steps:</h4>
                        <ul className="text-amber-700 text-sm text-left space-y-1">
                          <li>1. Open browser Developer Tools (F12)</li>
                          <li>2. Go to Console tab</li>
                          <li>3. Click &quot;Refresh&quot; button above</li>
                          <li>4. Check the API request logs</li>
                          <li>5. Verify backend server is running on port 8000</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Day</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {availabilities.map((availability) => (
                          <tr key={availability.availability_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                                availability.is_recurring 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {availability.is_recurring ? 'Recurring' : 'Specific Date'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {availability.is_recurring 
                                ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][availability.day_of_week! - 1] || `Day ${availability.day_of_week}`
                                : availability.date
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {availability.start_time} - {availability.end_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {availability.slot_duration} min
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => deleteAvailability(availability.availability_id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                Delete
                              </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                  )}
          </div>
        </div>
            </div>
          )}

          {/* Blocked Slots Management Tab */}
          {activeTab === 'blocks' && (
            <div className="space-y-8">
              {/* Recurring Blocked Slots Form */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Recurring Blocked Slots</h2>
                  <p className="text-gray-600 mt-1">Block time slots weekly (e.g., lunch breaks, meetings)</p>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Select Days to Block</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 1, label: 'Monday' },
                          { value: 2, label: 'Tuesday' },
                          { value: 3, label: 'Wednesday' },
                          { value: 4, label: 'Thursday' },
                          { value: 5, label: 'Friday' },
                          { value: 6, label: 'Saturday' },
                          { value: 7, label: 'Sunday' }
                        ].map(day => (
                          <label key={day.value} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={blockedRecurringForm.days.includes(day.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBlockedRecurringForm(prev => ({
                                    ...prev,
                                    days: [...prev.days, day.value]
                                  }));
                                } else {
                                  setBlockedRecurringForm(prev => ({
                                    ...prev,
                                    days: prev.days.filter(d => d !== day.value)
                                  }));
                                }
                              }}
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">{day.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                          <input
                            type="time"
                            value={blockedRecurringForm.start_time}
                            onChange={(e) => setBlockedRecurringForm(prev => ({ ...prev, start_time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                          <input
                            type="time"
                            value={blockedRecurringForm.end_time}
                            onChange={(e) => setBlockedRecurringForm(prev => ({ ...prev, end_time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Block</label>
                        <select
                          value={blockedRecurringForm.reason}
                          onChange={(e) => setBlockedRecurringForm(prev => ({ ...prev, reason: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="Lunch Break">Lunch Break</option>
                          <option value="Staff Meeting">Staff Meeting</option>
                          <option value="Surgery">Surgery</option>
                          <option value="Hospital Rounds">Hospital Rounds</option>
                          <option value="Personal Time">Personal Time</option>
                          <option value="Administrative Work">Administrative Work</option>
                        </select>
                      </div>
                      
                <button
                        onClick={createRecurringBlockedSlots}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                >
                        Block Recurring Time Slots
                </button>
              </div>
                  </div>
                </div>
              </div>

              {/* Specific Date Blocked Slot Form */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Specific Date Block</h2>
                  <p className="text-gray-600 mt-1">Block specific dates and times (e.g., meetings, conferences)</p>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date to Block</label>
                      <input
                        type="date"
                        value={blockedSpecificForm.date}
                        onChange={(e) => setBlockedSpecificForm(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                          <input
                            type="time"
                            value={blockedSpecificForm.start_time}
                            onChange={(e) => setBlockedSpecificForm(prev => ({ ...prev, start_time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                </div>
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                          <input
                            type="time"
                            value={blockedSpecificForm.end_time}
                            onChange={(e) => setBlockedSpecificForm(prev => ({ ...prev, end_time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                </div>
                      </div>
                      
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Block</label>
                        <input
                          type="text"
                          value={blockedSpecificForm.reason}
                          onChange={(e) => setBlockedSpecificForm(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder="e.g., Board Meeting, Conference, Surgery"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                </div>
                      
                      <button
                        onClick={createSpecificBlockedSlot}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
                      >
                        Block Specific Date & Time
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Blocked Slots */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                <div>
                      <h2 className="text-2xl font-bold text-gray-900">Current Blocked Slots</h2>
                      <p className="text-gray-600 mt-1">Manage existing blocked time slots</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          console.log('🔍 Current blocked slots state:', blockedSlots);
                          console.log('🔍 Loading state:', loadingBlockedSlots);
                          fetchBlockedSlots();
                        }}
                        className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                      <span className="text-sm text-gray-500">
                        {blockedSlots.length} blocked slots
                      </span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {loadingBlockedSlots ? (
                    <div className="p-8 text-center">
                      <div className="relative mx-auto mb-4">
                        <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-r-red-400 rounded-full animate-ping"></div>
                      </div>
                      <p className="text-gray-600 font-medium">Loading blocked slots...</p>
                      <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  ) : blockedSlots.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Blocked Slots Found</h3>
                      <p className="text-gray-500 text-sm mb-4">Create your first blocked slot above to manage unavailable times.</p>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                        <h4 className="text-red-800 font-medium mb-2">💡 Examples of Blocked Slots:</h4>
                        <ul className="text-red-700 text-sm text-left space-y-1">
                          <li>• Daily lunch breaks (1:00 PM - 2:00 PM)</li>
                          <li>• Weekly staff meetings (Monday 9:00 AM - 10:00 AM)</li>
                          <li>• Hospital rounds (Tuesday & Thursday 8:00 AM - 9:00 AM)</li>
                          <li>• Conference or training sessions</li>
                          <li>• Personal time or administrative work</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Day</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {blockedSlots.map((blockedSlot) => (
                          <tr key={blockedSlot.blocked_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                                blockedSlot.is_recurring 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {blockedSlot.is_recurring ? 'Recurring' : 'Specific Date'}
                              </span>
                            </td>
                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               {blockedSlot.is_recurring 
                                 ? getDayName(blockedSlot.day_of_week!)
                                 : blockedSlot.date
                               }
                             </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{blockedSlot.start_time} - {blockedSlot.end_time}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-gray-900">{blockedSlot.reason}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => deleteBlockedSlot(blockedSlot.blocked_id)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium rounded-lg transition-colors duration-200"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Block
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Blocked Slots Summary */}
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Blocked Slots Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-red-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-1">{blockedSlots.length}</div>
                    <div className="text-sm font-medium text-gray-600">Total Blocked Slots</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {blockedSlots.filter(slot => slot.is_recurring).length}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Recurring Blocks</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1m0 4v1m4-8v1m0 4v1m-4-5h4m-4 5h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {blockedSlots.filter(slot => !slot.is_recurring).length}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Specific Date Blocks</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Slots Tab */}
          {activeTab === 'slots' && (
            <div className="space-y-8">
              {/* Date Selector */}
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Available Slots</h2>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Select Date:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        fetchAvailableSlots(e.target.value);
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {loadingAvailability ? (
                  <div className="text-center py-8">
                    <div className="relative mx-auto mb-4">
                      <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-r-amber-400 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading available slots...</p>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Available Slots</h3>
                    <p className="text-gray-500 text-sm">No availability configured for this date.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 text-center ${
                          slot.is_available
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                      >
                        <div className="font-medium">{slot.slot_time}</div>
                        <div className="text-xs mt-1">
                          {slot.is_available ? 'Available' : `Booked (${slot.appointment_id})`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full ${getStatusColor(selectedAppointment.status)} transform hover:scale-105 transition-all duration-200`}>
                        <div className="w-2 h-2 rounded-full bg-white mr-2 opacity-80"></div>
                        {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
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