export default function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/ajay-krishna-murthy-7a6166257/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'hover:bg-blue-600',
      bgColor: 'bg-blue-700'
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/ajayteds',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'hover:bg-blue-700',
      bgColor: 'bg-blue-800'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/oculoplastix/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.989.016 6.756.072 5.526.127 4.74.323 4.077.609a5.906 5.906 0 00-2.156 1.4A5.901 5.901 0 00.525 4.165C.239 4.828.043 5.614-.012 6.844-.068 8.077-.084 8.484-.084 12.105c0 3.621.016 4.028.072 5.261.056 1.23.252 2.016.538 2.679a5.901 5.901 0 001.4 2.156c.663.433 1.449.629 2.679.685 1.233.056 1.64.072 5.261.072 3.621 0 4.028-.016 5.261-.072 1.23-.056 2.016-.252 2.679-.538a5.906 5.906 0 002.156-1.4c.433-.663.629-1.449.685-2.679.056-1.233.072-1.64.072-5.261 0-3.621-.016-4.028-.072-5.261-.056-1.23-.252-2.016-.538-2.679a5.901 5.901 0 00-1.4-2.156A5.906 5.906 0 0019.835.525C19.172.239 18.386.043 17.156-.012 15.923-.068 15.516-.084 11.895-.084L12.017 0zm-.105 2.183c3.549 0 3.97.016 5.378.072 1.298.059 2.003.274 2.472.456.621.242 1.065.531 1.532.998.467.467.756.911.998 1.532.182.469.397 1.174.456 2.472.056 1.408.072 1.829.072 5.378 0 3.549-.016 3.97-.072 5.378-.059 1.298-.274 2.003-.456 2.472a4.13 4.13 0 01-.998 1.532 4.134 4.134 0 01-1.532.998c-.469.182-1.174.397-2.472.456-1.408.056-1.829.072-5.378.072-3.549 0-3.97-.016-5.378-.072-1.298-.059-2.003-.274-2.472-.456a4.134 4.134 0 01-1.532-.998 4.13 4.13 0 01-.998-1.532c-.182-.469-.397-1.174-.456-2.472-.056-1.408-.072-1.829-.072-5.378 0-3.549.016-3.97.072-5.378.059-1.298.274-2.003.456-2.472.242-.621.531-1.065.998-1.532a4.134 4.134 0 011.532-.998c.469-.182 1.174-.397 2.472-.456 1.408-.056 1.829-.072 5.378-.072l-.105 2.183z"/>
          <path d="M12.017 15.33a3.33 3.33 0 110-6.66 3.33 3.33 0 010 6.66zM12.017 7.487a4.843 4.843 0 100 9.686 4.843 4.843 0 000-9.686zM18.685 6.051a1.134 1.134 0 11-2.268 0 1.134 1.134 0 012.268 0z"/>
        </svg>
      ),
      color: 'hover:bg-pink-600',
      bgColor: 'bg-pink-700'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@drajaykmurthy',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: 'hover:bg-red-600',
      bgColor: 'bg-red-700'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/drajaykmurthy',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'hover:bg-gray-800',
      bgColor: 'bg-gray-900'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-8 mb-8">
          
          {/* About Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5L13.5 7.5C13.1 7.9 12.6 8 12 8S10.9 7.9 10.5 7.5L9 6.5L3 7V9L9 10L10.5 11L12 12L13.5 11L15 10L21 9ZM12 13.5L11 14L8 15V20H10V16L12 15L14 16V20H16V15L13 14L12 13.5Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Dr. Ajay Krishna Murthy</h3>
                <p className="text-amber-300 text-sm font-medium">Oculoplastic Surgeon</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Specialized consultant in Oculoplasty with extensive training from prestigious institutions. 
              Committed to providing exceptional care in ophthalmology and advanced surgical procedures.
            </p>
            
            {/* Social Media Links */}
            <div>
              <h5 className="text-white font-semibold mb-3 text-sm">Connect with Dr. Murthy</h5>
              <div className="flex space-x-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.bgColor} ${social.color} p-2.5 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg group`}
                    title={`Follow on ${social.name}`}
                    aria-label={`Follow Dr. Ajay Krishna Murthy on ${social.name}`}
                  >
                    <span className="group-hover:scale-110 transition-transform block">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <a href="tel:+919611517424" className="hover:text-amber-300 transition-colors text-sm">+91 96115 17424</a>
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 mr-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a href="mailto:drajaykmurthy@gmail.com" className="hover:text-amber-300 transition-colors text-sm break-all">drajaykmurthy@gmail.com</a>
              </div>
              <div className="flex items-start text-gray-300">
                <svg className="w-4 h-4 mr-3 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="text-sm">HSR Layout, Bengaluru, Karnataka</span>
              </div>

            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#about" className="text-gray-300 hover:text-amber-300 transition-colors duration-200 text-sm">
                  About Dr. Murthy
                </a>
              </li>
              <li>
                <a href="#specializations" className="text-gray-300 hover:text-amber-300 transition-colors duration-200 text-sm">
                  Specializations
                </a>
              </li>
              <li>
                <a href="#experience" className="text-gray-300 hover:text-amber-300 transition-colors duration-200 text-sm">
                  Experience
                </a>
              </li>
              <li>
                <a href="#education" className="text-gray-300 hover:text-amber-300 transition-colors duration-200 text-sm">
                  Education
                </a>
              </li>
              <li>
                <a href="#affiliations" className="text-gray-300 hover:text-amber-300 transition-colors duration-200 text-sm">
                  Affiliations
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-amber-300 transition-colors duration-200 text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Services & Credentials */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2 mb-6">
              <li className="text-gray-300 text-sm">Eyelid Surgery</li>
              <li className="text-gray-300 text-sm">Orbital Surgery</li>
              <li className="text-gray-300 text-sm">Aesthetic Procedures</li>
              <li className="text-gray-300 text-sm">Reconstructive Surgery</li>
              <li className="text-gray-300 text-sm">Lacrimal System Surgery</li>
              <li className="text-gray-300 text-sm">Facial Rejuvenation</li>
            </ul>

          </div>
        </div>
        
        {/* Bottom Section */}
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs leading-relaxed max-w-4xl mx-auto">
            © 2025 Dr. Ajay Krishna Murthy. All rights reserved.
            </p>
          </div>
      </div>
    </footer>
  );
} 