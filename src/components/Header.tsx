'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-50 via-white to-orange-50 border-b border-amber-200 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Name */}
          <div className="flex items-center space-x-3">
            {/* <div className="flex-shrink-0">
              <img 
                src="/images/logo.jpeg" 
                alt="Oculoplasty Logo" 
                className="h-10 w-10 object-cover rounded-lg"
              />
            </div> */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dr. Ajay Krishna Murthy
              </h1>
              {/* <p className="text-sm text-amber-700">Oculoplasty Surgeon</p> */}
            </div>
          </div>

          {/* Right side - Quick Links and CTA */}
          <div className="flex items-center space-x-6">
            {/* Quick Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('#about')}
                className="text-gray-600 hover:text-amber-700 text-sm font-medium transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('#education')}
                className="text-gray-600 hover:text-amber-700 text-sm font-medium transition-colors"
              >
                Education
              </button>
              <button 
                onClick={() => scrollToSection('#specializations')}
                className="text-gray-600 hover:text-amber-700 text-sm font-medium transition-colors"
              >
                Specialization
              </button>
              <button 
                onClick={() => scrollToSection('#services')}
                className="text-gray-600 hover:text-amber-700 text-sm font-medium transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('#vlogs')}
                className="text-gray-600 hover:text-amber-700 text-sm font-medium transition-colors"
              >
                Vlogs
              </button>
            </nav>

            {/* Admin Actions */}
            {isAuthenticated && isAdmin ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/admin"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 px-2 py-2 transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => scrollToSection('#contact')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Book Now
                </button>
                <Link
                  href="/admin/login"
                  className="text-gray-600 hover:text-amber-600 px-2 py-2 transition-colors text-sm font-medium"
                  title="Admin Login"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 