'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Photo data for carousel
  const photos = [
    {
      id: 1,
      src: '/images/image1.jpg',
      caption: 'Professional Portrait',
      alt: 'Dr. Ajay Krishna Murthy - Professional Portrait'
    },
    {
      id: 2,
      src: '/images/image2.jpg',
      caption: 'Medical Practice',
      alt: 'Dr. Ajay Krishna Murthy - Medical Practice'
    },
    {
      id: 3,
      src: '/images/image3.jpg',
      caption: 'Patient Care',
      alt: 'Dr. Ajay Krishna Murthy - Patient Care'
    }
  ];

  // Professional stats
  const stats = [
    { number: '15+', label: 'Years of Experience', icon: '📅' },
    { number: '5,000+', label: 'Successful Procedures', icon: '✓' },
    { number: '98%', label: 'Patient Satisfaction', icon: '⭐' },
    { number: '50+', label: 'Research Publications', icon: '📚' }
  ];

  // Auto-slide functionality every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [photos.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-amber-50/30 overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Section - Left */}
          <div className="order-2 lg:order-1">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-50 rounded-full px-4 py-2 border border-amber-200">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-amber-700 font-medium text-sm">Leading Oculoplasty Specialist</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  Dr. Ajay Krishna
                  <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Murthy
                  </span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                  <p className="text-xl text-gray-600 font-medium">MS, FLVPEI, FICO</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Distinguished <strong className="text-amber-700">Oculoplasty Consultant</strong> with expertise in advanced 
                  lid, orbit, and aesthetic surgeries. Trained at India&apos;s premier medical institutions.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Combining surgical precision with aesthetic excellence to deliver exceptional patient outcomes 
                  through innovative techniques and personalized care.
                </p>
              </div>

              {/* CTA Buttons */}
              {/* <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Book Consultation
                </button>
                <button className="bg-white hover:bg-gray-50 text-amber-700 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-200">
                  View Specializations
                </button>
              </div> */}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stat.icon}</span>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.number}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Photo Section - Right */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Main Photo Container */}
              <div className="relative mx-auto max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="aspect-[3/4] relative">
                      {photos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-center"
                            priority={index === 0}
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Photo Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-sm font-medium opacity-90">{photos[currentSlide].caption}</p>
                    </div>
                  </div>
                </div>

                {/* Photo Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 bg-amber-600'
                          : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">15+</p>
                  <p className="text-sm text-gray-600 font-medium">Years of Excellence</p>
                </div>
              </div>

              {/* Credentials Badge */}
              {/* <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">LV</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">L.V. Prasad</p>
                    <p className="text-xs text-gray-600">Fellowship</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        {/* <div className="mt-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
} 