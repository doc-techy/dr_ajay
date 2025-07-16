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
      title: 'Oculoplasty and Oncology',
      description: 'Oculoplasty treats eyelid/orbital tumors, like basal cell carcinoma, with tumor removal and reconstruction.',
      thumbnail: '/thumbnails/vlog_image2.png',
      videoUrl: '/videos/video1.mp4',
      duration: '12:34',
      category: 'educational',
      uploadDate: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'Puffy Eyelids',
      description: 'Blepharoplasty reduces puffiness from excess fat/skin.',
      thumbnail: '/thumbnails/vlog_image1.png',
      videoUrl: '/videos/video2.mp4',
      duration: '8:45',
      category: 'educational',
      uploadDate: '2024-01-10'
    },
    {
      id: 3,
      title: '20-20-20 Rule',
      description: 'Eye strain and dry eyes are common. The 20-20-20 rule helps prevent them.',
      thumbnail: '/thumbnails/vlog_image3.png',
      videoUrl: '/videos/video3.mp4',
      duration: '6:23',
      category: 'tips',
      uploadDate: '2024-01-08'
    },
    {
      id: 4,
      title: 'Cosmetic vs. Reconstructive Surgery',
      description: 'Cosmetic blepharoplasty enhances looks; reconstructive fixes function, like ptosis; both need 1-2 weeks recovery.',
      thumbnail: '/thumbnails/video4-thumbnail.jpg',
      videoUrl: '/videos/video4.mp4',
      duration: '9:12',
      category: 'procedures',
      uploadDate: '2024-01-05'
    },
    {
      id: 5,
      title: 'Watering in Infants/Toddlers',
      description: 'Watering in infants/toddlers is normal. It can be managed with warm compresses and gentle cleaning.',
      thumbnail: '/thumbnails/video5-thumbnail.jpg',
      videoUrl: '/videos/video5.mp4',
      duration: '15:18',
      category: 'tips',
      uploadDate: '2024-01-02'
    },
    {
      id: 6,
      title: 'Dark Circles',
      description: 'Blepharoplasty or fillers reduce dark circles from genetics or thin skin.',
      thumbnail: '/thumbnails/video6-thumbnail.jpg',
      videoUrl: '/videos/video6.mp4',
      duration: '7:56',
      category: 'educational',
      uploadDate: '2023-12-28'
    },
    {
      id: 7,
      title: 'Sinusitis',
      description: 'Sinusitis is inflammation of the paranasal sinuses. It can be treated with antibiotics or surgery.',
      thumbnail: '/thumbnails/video7-thumbnail.jpg',
      videoUrl: '/videos/video7.mp4',
      duration: '11:45',
      category: 'procedures',
      uploadDate: '2023-12-25'
    },
    {
      id: 8,
      title: 'Eyes Tearing',
      description: 'Tearing from allergies/ducts may need oculoplastic treatment, not cosmetic surgery.',
      thumbnail: '/thumbnails/video8-thumbnail.jpg',
      videoUrl: '/videos/video8.mp4',
      duration: '5:32',
      category: 'educational',
      uploadDate: '2023-12-22'
    },
    {
      id: 9,
      title: 'Blepharoplasty Recovery',
      description: 'Detailed timeline of recovery phases after oculoplastic surgery procedures.',
      thumbnail: '/thumbnails/video9-thumbnail.jpg',
      videoUrl: '/videos/video9.mp4',
      duration: '13:28',
      category: 'procedures',
      uploadDate: '2023-12-20'
    },
    {
      id: 10,
      title: 'Eyelid Bump',
      description: 'Chalazia/styes may resolve or need minor surgery, distinct from blepharoplasty.',
      thumbnail: '/thumbnails/video10-thumbnail.jpg',
      videoUrl: '/videos/video10.mp4',
      duration: '8:17',
      category: 'testimonials',
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
                  {/* <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <span>{new Date(featuredVlog.uploadDate).toLocaleDateString()}</span>
                  </div> */}
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
                
                {/* <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(vlog.uploadDate).toLocaleDateString()}</span>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Video Modal */}
      {isVideoModalOpen && selectedVideo && (
        <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 transition-all duration-300 ${
          isVideoModalOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`relative w-full h-full max-w-7xl max-h-[95vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 ${
            isVideoModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player Container */}
            <div className="relative h-full flex flex-col">
              {/* Video Player - Now properly responsive */}
              <div className="flex-1 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-t-2xl md:rounded-t-3xl p-2 sm:p-4">
                <div className="relative w-full h-full max-h-[calc(95vh-120px)] sm:max-h-[calc(95vh-140px)] md:max-h-[calc(95vh-160px)]">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain rounded-lg md:rounded-xl"
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%'
                    }}
                  >
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Video Info Panel - Compact on mobile */}
              <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 p-3 sm:p-4 md:p-6 rounded-b-2xl md:rounded-b-3xl flex-shrink-0">
                <div className="text-white">
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">{selectedVideo.title}</h3>
                  <p className="text-gray-200 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2">{selectedVideo.description}</p>
                  <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs text-gray-300">
                    {/* <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {new Date(selectedVideo.uploadDate).toLocaleDateString()}
                    </span> */}
                    <span className="hidden sm:inline">•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 ${
                      selectedVideo.category === 'educational' ? 'bg-amber-500/30 text-amber-200' :
                      selectedVideo.category === 'procedures' ? 'bg-purple-500/30 text-purple-200' :
                      selectedVideo.category === 'testimonials' ? 'bg-green-500/30 text-green-200' :
                      'bg-orange-500/30 text-orange-200'
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

      {/* Click-to-close backdrop */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={closeVideoModal}
        />
      )}
    </section>
  );
} 