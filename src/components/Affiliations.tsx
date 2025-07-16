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
      gradient: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
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
    <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
                      <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Professional
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Affiliations</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Maintaining active affiliations with leading medical organizations to ensure the highest standards of patient care and professional excellence.
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {affiliations.map((affiliation, index) => (
            <div key={index} className="bg-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 hover:border-amber-200 transform hover:-translate-y-1">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${affiliation.gradient} rounded-xl mb-6 shadow-lg transform hover:scale-105 transition-all duration-300`}>
                <span className="text-3xl">{affiliation.icon}</span>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {affiliation.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {affiliation.description}
                </p>
                
                {/* Items List */}
                <ul className="space-y-4">
                  {affiliation.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start group">
                      <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Medical Organizations */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-16 border-2 border-amber-200 shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full -ml-16 -mb-16"></div>
          
          <div className="text-center mb-16 relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Medical Organizations</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Dr. Ajay Krishna Murthy maintains active memberships in prestigious medical organizations, ensuring access to cutting-edge research and best practices.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
              <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {organizations.map((org, index) => (
              <div key={index} className={`${org.bgColor} rounded-2xl p-6 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-white`}>
                <div className={`w-20 h-20 bg-gradient-to-r ${org.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <span className="text-3xl">{org.icon}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-3 text-xl">{org.name}</h4>
                <h5 className={`font-semibold ${org.textColor} mb-4 text-sm leading-relaxed`}>{org.fullName}</h5>
                <p className="text-gray-600 text-sm leading-relaxed">{org.description}</p>
                
                {/* Decorative element */}
                <div className={`w-12 h-1 bg-gradient-to-r ${org.gradient} rounded-full mx-auto mt-4 opacity-50`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 