export default function ServicesSection() {
  const services = [
    {
      title: 'Comprehensive Eye Examination',
      description: 'Complete diagnostic evaluation of eye health and vision assessment',
      icon: '🔍',
      price: '₹2,500',
      duration: '45-60 mins',
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Eyelid Surgery Consultation',
      description: 'Expert consultation for reconstructive and cosmetic eyelid procedures',
      icon: '👁️',
      price: '₹3,000',
      duration: '30 mins',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Orbital Disorder Treatment',
      description: 'Specialized treatment for orbital tumors, fractures, and complications',
      icon: '🏥',
      price: '₹4,000',
      duration: '60 mins',
      color: 'from-yellow-600 to-amber-600'
    },
    {
      title: 'Cosmetic Enhancement',
      description: 'Aesthetic procedures for facial rejuvenation and eye area enhancement',
      icon: '✨',
      price: '₹5,000',
      duration: '90 mins',
      color: 'from-amber-600 to-orange-600'
    },
    {
      title: 'Emergency Eye Care',
      description: '24/7 emergency services for urgent eye conditions and injuries',
      icon: '🚨',
      price: '₹3,500',
      duration: 'Immediate',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Follow-up Consultation',
      description: 'Post-surgical care and routine follow-up appointments',
      icon: '📋',
      price: '₹1,500',
      duration: '20 mins',
      color: 'from-amber-500 to-yellow-600'
    }
  ];

  return (
    <section className="relative py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-amber-100/30 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center bg-white rounded-lg px-6 py-3 shadow-md mb-6">
            <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">SV</span>
            </div>
            <span className="text-amber-700 font-medium">Our Services</span>
          </div> */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Eye Care Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From routine check-ups to complex surgical procedures, we provide complete 
            oculoplastic and ophthalmology services with personalized care.
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto"></div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl text-white">{service.icon}</span>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                
                {/* Service Details */}
                <div className="flex justify-between items-center mb-4">
                  {/* <div className="text-sm text-gray-500">
                    <div>Duration: {service.duration}</div>
                  </div> */}
                  {/* <div className="text-lg font-bold text-amber-600">
                    {service.price}
                  </div> */}
                </div>
                
                {/* Book Now Button */}
                <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 group-hover:shadow-md">
                  Book Now
                </button>
              </div>
              
              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
      </div>
    </section>
  );
} 