'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Vlog {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
  views: string;
  uploadDate: string;
  featured?: boolean;
}

export default function VlogsSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<Vlog | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'educational', name: 'Educational' },
    { id: 'procedures', name: 'Procedures' },
    { id: 'testimonials', name: 'Patient Stories' },
    { id: 'tips', name: 'Eye Care Tips' }
  ];

  const vlogs = [
    {
      id: 1,
      title: 'Understanding Eyelid Surgery: Complete Guide',
      description: 'Comprehensive overview of blepharoplasty procedures, benefits, and recovery process.',
      thumbnail: '/images/Operationtheatre.JPG',
      videoUrl: '/videos/video1.mp4',
      duration: '12:34',
      category: 'educational',
      views: '15.2K',
      uploadDate: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'Post-Surgery Care Instructions',
      description: 'Essential guidelines for optimal recovery after oculoplastic surgery.',
      thumbnail: '/images/image1.jpg',
      videoUrl: '/videos/video2.mp4',
      duration: '8:45',
      category: 'educational',
      views: '8.7K',
      uploadDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'Patient Success Story: Maria\'s Journey',
      description: 'Real patient testimonial about her transformative eyelid reconstruction experience.',
      thumbnail: '/images/image2.jpg',
      videoUrl: '/videos/video3.mp4',
      duration: '6:23',
      category: 'testimonials',
      views: '12.1K',
      uploadDate: '2024-01-08'
    },
    {
      id: 4,
      title: 'Daily Eye Care Routine for Healthy Eyes',
      description: 'Simple but effective daily practices to maintain optimal eye health.',
      thumbnail: '/images/image3.jpg',
      videoUrl: '/videos/video4.mp4',
      duration: '9:12',
      category: 'tips',
      views: '20.5K',
      uploadDate: '2024-01-05'
    },
    {
      id: 5,
      title: 'Orbital Surgery: Advanced Techniques',
      description: 'Detailed explanation of modern orbital surgery methods and innovations.',
      thumbnail: '/images/image4.jpg',
      videoUrl: '/videos/video5.mp4',
      duration: '15:18',
      category: 'procedures',
      views: '6.8K',
      uploadDate: '2024-01-02'
    },
    {
      id: 6,
      title: 'When to See an Oculoplastic Surgeon',
      description: 'Key signs and symptoms that indicate you should consult a specialist.',
      thumbnail: '/images/logo.jpeg',
      videoUrl: '/videos/video6.mp4',
      duration: '7:56',
      category: 'educational',
      views: '11.3K',
      uploadDate: '2023-12-28'
    },
    {
      id: 7,
      title: 'Tear Duct Surgery Explained',
      description: 'Complete guide to dacryocystorhinostomy and tear duct reconstruction procedures.',
      thumbnail: '/images/Operationtheatre.JPG',
      videoUrl: '/videos/video7.mp4',
      duration: '11:45',
      category: 'procedures',
      views: '9.4K',
      uploadDate: '2023-12-25'
    },
    {
      id: 8,
      title: 'Preventing Eye Injuries: Safety Tips',
      description: 'Essential safety measures to protect your eyes in daily activities and workplace.',
      thumbnail: '/images/image1.jpg',
      videoUrl: '/videos/video8.mp4',
      duration: '5:32',
      category: 'tips',
      views: '18.7K',
      uploadDate: '2023-12-22'
    },
    {
      id: 9,
      title: 'Recovery Timeline: What to Expect',
      description: 'Detailed timeline of recovery phases after oculoplastic surgery procedures.',
      thumbnail: '/images/image2.jpg',
      videoUrl: '/videos/video9.mp4',
      duration: '13:28',
      category: 'educational',
      views: '14.6K',
      uploadDate: '2023-12-20'
    },
    {
      id: 10,
      title: 'Patient Testimonial: John\'s Transformation',
      description: 'Inspiring story of a patient\'s journey through orbital reconstruction surgery.',
      thumbnail: '/images/image3.jpg',
      videoUrl: '/videos/video10.mp4',
      duration: '8:17',
      category: 'testimonials',
      views: '16.9K',
      uploadDate: '2023-12-18'
    }
  ];

  const filteredVlogs = activeCategory === 'all' 
    ? vlogs 
    : vlogs.filter(vlog => vlog.category === activeCategory);

  const featuredVlog = vlogs.find(vlog => vlog.featured);

  // Function to handle video click
  const handleVideoClick = (vlog: Vlog) => {
    setSelectedVideo(vlog);
    setIsVideoModalOpen(true);
  };

  // Function to close video modal
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setTimeout(() => setSelectedVideo(null), 300); // Delay to allow fade out animation
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        closeVideoModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVideoModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVideoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVideoModalOpen]);

  return (
    <section className="relative py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-amber-100/30 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Educational
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Video Content</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about eye health, surgical procedures, and patient care through 
            our comprehensive video library by Dr. Ajay Krishna Murthy.
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto"></div>
        </div>

        {/* Featured Video */}
        {featuredVlog && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Video</h3>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <div 
                    className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                    onClick={() => handleVideoClick(featuredVlog)}
                  >
                    <Image
                      src={featuredVlog.thumbnail}
                      alt={featuredVlog.title}
                      width={600}
                      height={256}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <svg className="w-6 h-6 text-amber-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
                      {featuredVlog.duration}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    Featured
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">{featuredVlog.title}</h4>
                  <p className="text-gray-600 mb-6">{featuredVlog.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <span>{featuredVlog.views} views</span>
                    <span>•</span>
                    <span>{new Date(featuredVlog.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => handleVideoClick(featuredVlog)}
                    className="bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700 shadow-sm'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVlogs.map((vlog) => (
            <div
              key={vlog.id}
              className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Video Thumbnail */}
              <div className="relative mb-6">
                <div 
                  className="relative rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleVideoClick(vlog)}
                >
                  <Image
                    src={vlog.thumbnail}
                    alt={vlog.title}
                    width={400}
                    height={160}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <svg className="w-4 h-4 text-amber-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {vlog.duration}
                  </div>
                </div>
              </div>

              {/* Video Content */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    vlog.category === 'educational' ? 'bg-amber-100 text-amber-700' :
                    vlog.category === 'procedures' ? 'bg-purple-100 text-purple-700' :
                    vlog.category === 'testimonials' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {categories.find(cat => cat.id === vlog.category)?.name}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                  {vlog.title}
                </h4>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {vlog.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{vlog.views} views</span>
                  <span>{new Date(vlog.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portrait-Optimized Video Modal */}
      {isVideoModalOpen && selectedVideo && (
        <div className={`fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isVideoModalOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`relative w-full h-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-black rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 ${
            isVideoModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player Container - Optimized for Portrait */}
            <div className="relative bg-black h-full flex flex-col">
              {/* Video Player */}
              <div className="flex-1 flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh]"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  controlsList="nodownload"
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Info Panel - Compact for Portrait */}
              <div className="bg-gradient-to-t from-black via-gray-900 to-transparent p-4 sm:p-6">
                <div className="text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">{selectedVideo.title}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{selectedVideo.description}</p>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      {selectedVideo.views} views
                    </span>
                    <span>•</span>
                    <span>{new Date(selectedVideo.uploadDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedVideo.category === 'educational' ? 'bg-amber-600/20 text-amber-300' :
                      selectedVideo.category === 'procedures' ? 'bg-purple-600/20 text-purple-300' :
                      selectedVideo.category === 'testimonials' ? 'bg-green-600/20 text-green-300' :
                      'bg-orange-600/20 text-orange-300'
                    }`}>
                      {categories.find(cat => cat.id === selectedVideo.category)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay backdrop for modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40"
          onClick={closeVideoModal}
        />
      )}
    </section>
  );
} 