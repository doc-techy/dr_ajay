export default function Affiliations() {
  const affiliations = [
    {
      title: "Professional Memberships",
      description: "Active membership in leading ophthalmology and oculoplastic surgery organizations, ensuring adherence to the highest standards of medical practice.",
      icon: "👨‍⚕️",
      gradient: "from-amber-500 to-orange-500",
      items: [
        "Committed to professional excellence",
        "Continuous education and skill development", 
        "Networking with global experts",
        "Adherence to international standards"
      ]
    },
    {
      title: "Medical Organizations", 
      description: "Affiliated with prestigious medical institutions that promote innovation, research, and best practices in ophthalmic surgery.",
      icon: "🏥",
      gradient: "from-orange-500 to-red-500",
      items: [
        "Access to latest medical research",
        "Collaboration with industry leaders",
        "Standards of ethical practice",
        "Evidence-based medical approaches"
      ]
    }
  ];

  const organizations = [
    {
      name: "ALOS",
      fullName: "Association for Lachrymal and Orbital Surgery",
      description: "Leading organization for specialists in lachrymal and orbital surgery with focus on advanced techniques",
      icon: "👁️",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      name: "KOS", 
      fullName: "Karnataka Ophthalmological Society",
      description: "State-level society promoting ophthalmology excellence and innovation in Karnataka",
      icon: "🏛️",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      name: "OPAI",
      fullName: "Oculoplastic Association of India",
      description: "Premier association for oculoplastic surgeons across India, driving clinical excellence",
      icon: "🇮🇳",
      gradient: "from-amber-600 to-yellow-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700"
    },
    {
      name: "ISOO",
      fullName: "Indian Society of Ocular Oncology",
      description: "Specialized society focusing on ocular oncology research and cutting-edge treatments",
      icon: "🔬",
      gradient: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-amber-25 to-amber-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-bl from-orange-200/15 to-transparent rounded-full translate-x-40 blur-2xl"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-tr from-yellow-200/20 to-transparent rounded-full translate-y-32 blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20 relative">

          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Professional
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent"> Affiliations</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Maintaining active affiliations with leading medical organizations to ensure the highest standards of patient care and professional excellence in oculoplastic surgery.
          </p>
          
          {/* Enhanced decorative elements */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-sm"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-sm"></div>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          {affiliations.map((affiliation, index) => (
            <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-200 border-2 border-amber-100/50 hover:border-amber-200 transform hover:-translate-y-1 hover:scale-[1.01] relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-200"></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${affiliation.gradient} rounded-2xl mb-8 shadow-xl transform group-hover:scale-105 transition-all duration-200 relative z-10`}>
                <span className="text-4xl filter drop-shadow-lg">{affiliation.icon}</span>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 group-hover:text-amber-800 transition-colors duration-150">
                  {affiliation.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-150">
                  {affiliation.description}
                </p>
                
                {/* Items List */}
                <ul className="space-y-5">
                  {affiliation.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start hover-item group/item">
                      <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2 mr-5 flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-all duration-150 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-0 group-hover/item:opacity-30 transition-opacity duration-150"></div>
                      </div>
                      <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-150 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Bottom accent */}
                <div className={`w-20 h-1 bg-gradient-to-r ${affiliation.gradient} rounded-full mt-8 group-hover:w-32 transition-all duration-200`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Medical Organizations */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-[3rem] p-20 border-2 border-amber-200/50 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Enhanced Background decorations */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-amber-300/15 to-transparent rounded-full -mr-30 -mt-30 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-300/15 to-transparent rounded-full -ml-24 -mb-24 blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-yellow-200/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
          

          
          <div className="text-center mb-20 relative z-10">
            {/* Icon header */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl mb-8 shadow-2xl">
              <span className="text-3xl">🏥</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Medical Organizations</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dr. Ajay Krishna Murthy maintains active memberships in prestigious medical organizations, ensuring access to cutting-edge research and best practices in oculoplastic surgery.
            </p>
            
            {/* Enhanced decorative elements */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="w-20 h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-lg"></div>
              <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-lg"></div>
              <div className="w-20 h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-lg"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {organizations.map((org, index) => (
              <div key={index} className={`${org.bgColor} rounded-3xl p-8 text-center group hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-2 hover:scale-102 border-2 border-white/50 hover:border-white relative overflow-hidden backdrop-blur-sm`}>
                {/* Card background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-200"></div>
                
                <div className="relative z-10">
                  <div className={`w-24 h-24 bg-gradient-to-r ${org.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-all duration-200 relative`}>
                    <span className="text-4xl filter drop-shadow-lg">{org.icon}</span>
                    {/* Icon glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${org.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-200 -z-10`}></div>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-gray-800 transition-colors duration-150">{org.name}</h4>
                  <h5 className={`font-semibold ${org.textColor} mb-4 text-sm leading-relaxed group-hover:font-bold transition-all duration-150`}>{org.fullName}</h5>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-150">{org.description}</p>
                  
                  {/* Enhanced decorative elements */}
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <div className={`w-16 h-1 bg-gradient-to-r ${org.gradient} rounded-full group-hover:w-20 transition-all duration-200 shadow-lg`}></div>
                    <div className={`w-2 h-2 bg-gradient-to-r ${org.gradient} rounded-full shadow-lg`}></div>
                    <div className={`w-16 h-1 bg-gradient-to-r ${org.gradient} rounded-full group-hover:w-20 transition-all duration-200 shadow-lg`}></div>
                  </div>
                  
                  {/* Membership badge */}
                  <div className="inline-flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mt-6 shadow-lg group-hover:bg-white/90 transition-all duration-150">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-700">Active Member</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
} 