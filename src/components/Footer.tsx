export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          
          {/* About Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">👨‍⚕️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Dr. Ajay Krishna Murthy</h3>
                <p className="text-amber-300">Oculoplasty Surgeon</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Specialized consultant in Oculoplasty with extensive training from prestigious institutions. 
              Committed to providing exceptional care in ophthalmology and advanced surgical procedures.
            </p>
            <div className="flex space-x-4">
              <a href="tel:+919611517424" className="bg-amber-600 hover:bg-amber-700 p-3 rounded-lg transition-colors">
                <span className="text-xl">📞</span>
              </a>
              <a href="mailto:drajaykmurthy@gmail.com" className="bg-orange-600 hover:bg-orange-700 p-3 rounded-lg transition-colors">
                <span className="text-xl">✉️</span>
              </a>
              <a href="https://wa.me/919611517424" className="bg-amber-600 hover:bg-amber-700 p-3 rounded-lg transition-colors">
                <span className="text-xl">💬</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-amber-300">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors hover:underline">About Dr. Murthy</a></li>
              <li><a href="#specializations" className="text-gray-300 hover:text-white transition-colors hover:underline">Specializations</a></li>
              <li><a href="#experience" className="text-gray-300 hover:text-white transition-colors hover:underline">Experience</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors hover:underline">Contact</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-purple-300">Services</h4>
            <ul className="space-y-3">
              <li><span className="text-gray-300">Eyelid Surgery</span></li>
              <li><span className="text-gray-300">Orbital Surgery</span></li>
              <li><span className="text-gray-300">Aesthetic Procedures</span></li>
              <li><span className="text-gray-300">Reconstructive Surgery</span></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300 mb-2">
                © 2024 Dr. Ajay Krishna Murthy. Professional medical website for informational purposes.
              </p>
              {/* <p className="text-gray-400 text-sm">
                For appointments and consultations, please contact through official channels.
              </p> */}
            </div>
            
            {/* Credentials */}
            {/* <div className="flex flex-col items-center md:items-end">
              <div className="flex items-center space-x-4 mb-2">
                <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm">JIPMER Graduate</span>
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">L.V. Prasad Fellow</span>
              </div>
              <p className="text-gray-400 text-sm">Bangalore, Karnataka, India</p>
            </div> */}
          </div>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
    </footer>
  );
} 