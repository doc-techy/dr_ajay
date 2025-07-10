export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-12 mb-12">
          
          {/* About Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Dr. Ajay Krishna Murthy</h3>
                <p className="text-amber-300 font-medium">Oculoplasty Surgeon</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">
              Specialized consultant in Oculoplasty with extensive training from prestigious institutions. 
              Committed to providing exceptional care in ophthalmology and advanced surgical procedures.
            </p>
            
            {/* Social Links */}
            <div className="mb-8">
              <h5 className="text-amber-300 font-semibold mb-4">Connect With Us</h5>
              <div className="flex space-x-4">
                <a href="tel:+919611517424" 
                   className="group bg-amber-600 hover:bg-amber-700 p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
                   title="Call us">
                  <span className="text-xl group-hover:scale-110 transition-transform">📞</span>
                </a>
                <a href="mailto:drajaykmurthy@gmail.com" 
                   className="group bg-orange-600 hover:bg-orange-700 p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
                   title="Email us">
                  <span className="text-xl group-hover:scale-110 transition-transform">✉️</span>
                </a>
                <a href="https://wa.me/919611517424" 
                   className="group bg-green-600 hover:bg-green-700 p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
                   title="WhatsApp">
                  <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                </a>
              </div>
            </div>

            {/* Credentials */}
            {/* <div className="flex flex-wrap gap-3">
              <span className="bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-medium border border-amber-500/30">
                JIPMER Graduate
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">
                L.V. Prasad Fellow
              </span>
            </div> */}
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-amber-300 flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#about" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-amber-500 rounded-full mr-3 group-hover:w-2 group-hover:h-2 transition-all"></span>
                  About Dr. Murthy
                </a>
              </li>
              <li>
                <a href="#specializations" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-amber-500 rounded-full mr-3 group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Specializations
                </a>
              </li>
              <li>
                <a href="#experience" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-amber-500 rounded-full mr-3 group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Experience
                </a>
              </li>
              <li>
                <a href="#book" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-amber-500 rounded-full mr-3 group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Book Appointment
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-amber-500 rounded-full mr-3 group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Services & Location */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-orange-300 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Services
            </h4>
            <ul className="space-y-4 mb-8">
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 bg-orange-500 rounded-full mr-3"></span>
                Eyelid Surgery
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 bg-orange-500 rounded-full mr-3"></span>
                Orbital Surgery
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 bg-orange-500 rounded-full mr-3"></span>
                Aesthetic Procedures
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 bg-orange-500 rounded-full mr-3"></span>
                Reconstructive Surgery
              </li>
            </ul>

            {/* Location */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h5 className="text-white font-semibold mb-2 flex items-center">
                <span className="text-lg mr-2">📍</span>
                Location
              </h5>
              <p className="text-gray-300 text-sm leading-relaxed">
                HSR Layout, Bengaluru<br/>
                Karnataka, India
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <p className="text-gray-300 text-lg mb-2">
                © 2024 Dr. Ajay Krishna Murthy. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm">
                Professional medical website for informational purposes. For appointments and consultations, please contact through official channels.
              </p>
            </div>
            
            {/* Professional Notice */}
            {/* <div className="text-center lg:text-right">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-6 py-3">
                <p className="text-amber-300 text-sm font-medium">
                  🏥 Licensed Medical Professional
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Practicing in Bangalore, Karnataka
                </p>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
    </footer>
  );
} 