'use client';

import { useState, useEffect } from 'react';
import type { CreateAppointmentRequest } from '@/types/api';

interface AvailableSlot {
  start_time: string;
  end_time: string;
  slot_time: string;
  is_available: boolean;
}

// Default time slots - moved outside component to avoid useEffect dependency issues
const DEFAULT_TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

// Helper function to convert 24-hour format to 12-hour AM/PM format
const formatTimeToAMPM = (time: string): string => {
  // If already in AM/PM format, return as is
  if (time.includes('AM') || time.includes('PM')) {
    return time;
  }
  
  // If it's just "HH:MM" format
  if (time.match(/^\d{1,2}:\d{2}$/)) {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
  }
  
  // If it's "HH:MM:SS" format, remove seconds
  if (time.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
  }
  
  // If it's ISO time format "YYYY-MM-DDTHH:MM:SS" or similar
  if (time.includes('T')) {
    const timePart = time.split('T')[1]?.split(':');
    if (timePart && timePart.length >= 2) {
      const hour24 = parseInt(timePart[0], 10);
      const minutes = timePart[1];
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
    }
  }
  
  // Return original if format not recognized
  return time;
};

export default function BookSection() {
  // Helper function to get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    name: '',
    email: '',
    phone: '',
    date: getTomorrowDate(), // Set tomorrow as default
    time: '',
    message: ''
  });

  // UI state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    date?: string;
    time?: string;
  }>({});

  // Available slots state - initialize with default time slots
  const [availableSlots, setAvailableSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch available slots when date changes
  const fetchAvailableSlots = async (date: string) => {
    if (!date) {
      setAvailableSlots(DEFAULT_TIME_SLOTS); // Use default time slots when no date
      return;
    }

    setLoadingSlots(true);
    try {
      // Use the available-slots endpoint as primary
      let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/available-slots/?date=${date}`);
      
      // If that fails, try the detailed endpoint (fallback)
      if (!response.ok) {
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/slots/detailed/?date=${date}`);
      }
      
      const data = await response.json();
      console.log('📅 Available slots response:', data); // Debug log
      
      if (data.success) {
        let availableSlotTimes: string[] = [];
        
        // Handle different response structures
        if (data.available_slots) {
          // Structure: { available_slots: [{ slot_time, is_available }] }
          availableSlotTimes = data.available_slots
            .filter((slot: AvailableSlot) => slot.is_available)
            .map((slot: AvailableSlot) => formatTimeToAMPM(slot.slot_time));
        } else if (data.slots) {
          // Structure: { slots: [{ slot_time, is_available }] }
          availableSlotTimes = data.slots
            .filter((slot: AvailableSlot) => slot.is_available)
            .map((slot: AvailableSlot) => formatTimeToAMPM(slot.slot_time));
        } else if (Array.isArray(data.data)) {
          // Structure: { data: [{ slot_time, is_available }] }
          availableSlotTimes = data.data
            .filter((slot: AvailableSlot) => slot.is_available)
            .map((slot: AvailableSlot) => formatTimeToAMPM(slot.slot_time));
        }
        
        // If no available slots found or empty array, use default time slots
        if (availableSlotTimes.length === 0) {
          console.log('⚠️ No available slots returned, using default time slots');
          setAvailableSlots(DEFAULT_TIME_SLOTS);
        } else {
          console.log('✅ Available slots found:', availableSlotTimes);
          setAvailableSlots(availableSlotTimes);
        }
      } else {
        console.log('⚠️ API returned success: false, using default time slots');
        setAvailableSlots(DEFAULT_TIME_SLOTS);
      }
    } catch (error) {
      console.error('❌ Error fetching available slots, using default time slots:', error);
      // Fallback to default time slots when API fails
      setAvailableSlots(DEFAULT_TIME_SLOTS);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
      // Clear the selected time when date changes
      setFormData(prev => ({ ...prev, time: '' }));
    } else {
      // When no date is selected, show default time slots
      setAvailableSlots(DEFAULT_TIME_SLOTS);
    }
  }, [formData.date]); // Removed dependencies since DEFAULT_TIME_SLOTS is constant

  // Validation functions
  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) return 'Please enter a valid phone number (10-15 digits)';
    return null;
  };

  const validateDate = (date: string): string | null => {
    if (!date) return 'Appointment date is required';
    const selectedDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (selectedDate < tomorrow) return 'Please select a date from tomorrow onwards';
    
    return null;
  };

  const validateTime = (time: string): string | null => {
    if (!time) return 'Appointment time is required';
    const slotsToCheck = availableSlots.length > 0 ? availableSlots : DEFAULT_TIME_SLOTS;
    if (!slotsToCheck.includes(time)) return 'Please select a valid time slot';
    return null;
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    const dateError = validateDate(formData.date);
    if (dateError) errors.date = dateError;
    
    const timeError = validateTime(formData.time);
    if (timeError) errors.time = timeError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Reset status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSuccessMessage(`Appointment created successfully!!!`);
        setValidationErrors({}); // Clear any validation errors
        
        // Reset form after a short delay
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            message: ''
          });
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to create appointment');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setSubmitStatus('error');
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-16 scroll-margin-header" id="book">
      {/* Consistent Fading Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-amber-50/30"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Schedule Your
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Consultation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book your appointment with Dr. Ajay Krishna Murthy for expert 
            oculoplastic care and personalized treatment.
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Booking Form or Success Page */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            {submitStatus === 'success' ? (
              /* Success Page */
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
                  <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Appointment Booked Successfully! 🎉
                </h3>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <p className="text-green-800 font-semibold text-lg mb-2">
                    {successMessage}
                  </p>
                  <p className="text-green-700 text-sm">
                    We have received your appointment request and will contact you shortly to confirm the details.
                  </p>
                </div>



                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h5 className="font-semibold text-amber-800 mb-2">What happens next?</h5>
                    <ul className="text-amber-700 text-sm space-y-1 text-left">
                      <li>• You will receive a confirmation email with all the details</li>
                      <li>• Please arrive 15 minutes early for your appointment</li>
                      <li>• Bring a valid ID and any relevant medical records</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitStatus('idle');
                      setSuccessMessage('');
                      setValidationErrors({});
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        date: '',
                        time: '',
                        message: ''
                      });
                    }}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    Book Another Appointment
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.phone 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                    validationErrors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-amber-500'
                  }`}
                  placeholder="your.email@example.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <div className="mb-2">
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.date 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                  />
                  {validationErrors.date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.date}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
                    disabled={loadingSlots || !formData.date}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.time 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-amber-500'
                    } ${(loadingSlots || !formData.date) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">
                      {!formData.date 
                        ? 'Please select a date first' 
                        : loadingSlots 
                          ? 'Loading available times...' 
                          : 'Select time'}
                    </option>
                    {!loadingSlots && formData.date && availableSlots.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                  {loadingSlots && formData.date && (
                    <p className="mt-1 text-sm text-amber-600 flex items-center">
                      <div className="w-3 h-3 border border-amber-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Checking available time slots...
                    </p>
                  )}
                  {!loadingSlots && formData.date && availableSlots.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Using default time slots. All times may be available.
                    </p>
                  )}
                  {validationErrors.time && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.time}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message / Concerns
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Any specific concerns, symptoms, or questions..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Book Appointment'
                )}
              </button>

              {/* Loading State */}
              {/* {isSubmitting && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <div>
                      <h4 className="text-blue-800 font-medium">Creating your appointment...</h4>
                      <p className="text-blue-600 text-sm">Please wait while we process your request.</p>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Error State */}
              {submitStatus === 'error' && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-red-800 font-medium">Booking Failed</h4>
                      <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                      <p className="text-red-600 text-sm mt-2">
                        Please check your information and try again. If the problem persists, contact us directly.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitStatus('idle');
                          setErrorMessage('');
                        }}
                        className="mt-3 inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
                        )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600">📞</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+91 96115 17424</p>
                    <p className="text-sm text-gray-500">Available 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600">📧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">drajaykmurthy@gmail.com</p>
                    <p className="text-sm text-gray-500">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Clinic Address</h4>
                    <p className="text-gray-600">ChanRe Veena Rheumatology and Immunology Center,<br />
                    Ground Floor, 531/B, 19th Main Rd, Sector 3,<br />
                    HSR Layout, Bengaluru, Karnataka 560102</p>
                    <a href="https://maps.app.goo.gl/Ju6YmNsmJ75Pvp4q8" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-sm text-amber-600 hover:text-amber-700 transition-colors inline-flex items-center gap-1 mt-1">
                      View on Google Maps
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600">💬</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                    <a 
                      href="https://wa.me/919611517424" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm mt-2"
                    >
                      <span className="mr-2">📱</span>
                      Message on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Specializations</h3>
              <ul className="space-y-2 text-amber-100">
                <li>• Eyelid Surgery (Blepharoplasty)</li>
                <li>• Orbital Surgery</li>
                <li>• Aesthetic Eye Procedures</li>
                <li>• Comprehensive Eye Care</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 