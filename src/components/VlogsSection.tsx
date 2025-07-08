'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VlogsSection() {
  const [activeCategory, setActiveCategory] = useState('all');

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
      duration: '7:56',
      category: 'educational',
      views: '11.3K',
      uploadDate: '2023-12-28'
    }
  ];

  const filteredVlogs = activeCategory === 'all' 
    ? vlogs 
    : vlogs.filter(vlog => vlog.category === activeCategory);

  const featuredVlog = vlogs.find(vlog => vlog.featured);

  return (
    <section className="relative py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-amber-100/30 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center bg-white rounded-lg px-6 py-3 shadow-md mb-6">
            <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">VL</span>
            </div>
            <span className="text-amber-700 font-medium">Video Blogs</span>
          </div> */}
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
                  <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
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
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
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
                  <button className="bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-md">
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
                <div className="relative rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300 cursor-pointer">
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
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
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

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg inline-block">
            <p className="text-lg text-gray-600 mb-4">
              Subscribe to stay updated with our latest educational content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-md">
                Subscribe on YouTube
              </button>
              <button className="border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white font-medium py-3 px-8 rounded-lg transition-all duration-300">
                View All Videos
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
} 