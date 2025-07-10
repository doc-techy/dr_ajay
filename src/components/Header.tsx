'use client';

export default function Header() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
              {/* <button 
                onClick={() => scrollToSection('#specializations')}
                className="text-gray-600 hover:text-amber-700 text-sm font-medium transition-colors"
              >
                Specializations
              </button> */}
              <button 
                onClick={() => scrollToSection('#specializations')}
                className="text-gray-600 hover:text-amber-700 text-sm font-medium transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('#vlogs')}
                className="text-gray-600 hover:text-amber-700 text-sm font-medium transition-colors"
              >
                Educational Content
              </button>
            </nav>

            {/* Book Now Button */}
            <button 
              onClick={() => scrollToSection('#book')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 