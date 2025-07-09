'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createApiClient } from '@/utils/api';
import { useRouter } from 'next/navigation';
import type { CreateAppointmentRequest, CreateAppointmentResponse } from '@/types/api';

export default function BookSection() {
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });

  const { getAuthHeaders, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Create API client instance
  const apiClient = useMemo(() => 
    createApiClient(getAuthHeaders, () => {
      logout();
      router.push('/admin/login');
    }), 
    [getAuthHeaders, logout, router]
  );

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated before allowing appointment booking
    if (!isAuthenticated) {
      alert('Please log in to book an appointment.');
      return;
    }

    // Form data is already typed as CreateAppointmentRequest
    const result = await apiClient.post<CreateAppointmentResponse>('/api/appointments/', formData);

    if (result.success) {
      alert('Appointment created successfully! Reference ID: ' + result.data?.appointment_id);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
      });
    } else {
      alert(result.error || 'Failed to create appointment');
    }
  };

  return (
    <section className="relative py-16" id="book">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-100/30 to-transparent"></div>
      
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
          {/* Booking Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                  />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
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
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                Book Appointment
              </button>
            </form>
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
                    <a href="https://maps.app.goo.gl/Q2bA3j8gobp77qVC7" 
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