'use client';

export default function EducationSection() {
  const educationData = [
    {
      degree: "Fellowship in Oculoplasty",
      institution: "L.V. Prasad Eye Institute",
      location: "Hyderabad, India",
      year: "2016",
      description: "Advanced subspecialty training in Oculoplastic and Reconstructive Surgery",
      icon: "🏆",
      highlight: "Fellowship"
    },
    {
      degree: "MS Ophthalmology",
      institution: "Jawaharlal Institute of Postgraduate Medical Education and Research (JIPMER)",
      location: "Puducherry, India", 
      year: "2012",
      description: "Master of Surgery in Ophthalmology with academic excellence",
      icon: "👁️",
      highlight: "Postgraduate"
    },
    {
      degree: "MBBS",
      institution: "A.J Hospital and Research Centre",
      location: "Mangalore, India",
      year: "2004",
      description: "Bachelor of Medicine and Bachelor of Surgery with distinction",
      icon: "🎓",
      highlight: "Undergraduate"
    }
  ];

  const professionalData = [
    // {
    //   position: "Freelance Oculoplasty Consultant",
    //   organization: "Independent Practice",
    //   location: "Bangalore, India",
    //   year: "2019 - Present",
    //   description: "Comprehensive oculoplastic surgical services with focus on advanced lid and orbital procedures",
    //   icon: "💼",
    //   highlight: "Current",
    //   // details: ["Advanced oculoplastic procedures", "Patient-centered care", "Surgical innovation"]
    // },
    {
      position: "Consulting Ophthalmologist",
      organization: "HCG Cancer Center",
      location: "K.R. Road, Bangalore",
      year: "2023 - Present",
      description: "Specialized ophthalmic oncology and reconstructive procedures",
      icon: "🏥",
      highlight: "Current",
      // details: ["Ophthalmic oncology", "Reconstructive surgery", "Multidisciplinary care"]
    },
    {
      position: "Consultant Oculoplasty",
      organization: "L.V. Prasad Eye Institute",
      location: "Hyderabad, India",
      year: "2018 - 2019",
      description: "Advanced oculoplastic procedures and fellowship training supervision",
      icon: "🔬",
      highlight: "Previous",
      // details: ["Complex oculoplastic cases", "Training supervision", "Research collaboration"]
    },
    {
      position: "Consultant Ophthalmologist",
      organization: "Narayana Nethralaya",
      location: "Bangalore, India",
      year: "2019 -  Present",
      description: "Comprehensive eye care and oculoplastic surgical services",
      icon: "👨‍⚕️",
      highlight: "Previous",
      // details: ["Comprehensive eye care", "Surgical procedures", "Patient consultation"]
    }
  ];

  const affiliationsData = [
    {
      acronym: "AIOS",
      fullName: "All India Ophthalmological Society",
      description: "The All India Ophthalmological Society (AIOS) is dedicated to protecting sight, empowering lives, and advancing ophthalmic education and research across India.",
      icon: "👁️",
      highlight: "Active Member",
      gradient: "from-blue-500 to-cyan-500",
      hoverColor: "blue-200"
    },
    {
      acronym: "KOS", 
      fullName: "Karnataka Ophthalmological Society",
      description: "State-level society promoting ophthalmology excellence and innovation in Karnataka",
      icon: "🏛️",
      highlight: "Active Member",
      gradient: "from-green-500 to-emerald-500",
      hoverColor: "green-200"
    },
    {
      acronym: "OPAI",
      fullName: "Oculoplastic Association of India",
      description: "Premier association for oculoplastic surgeons across India, driving clinical excellence",
      icon: "🇮🇳",
      highlight: "Active Member",
      gradient: "from-amber-600 to-yellow-500",
      hoverColor: "amber-200"
    },
    {
      acronym: "ISOO",
      fullName: "International Society of Ocular Oncology",
      description: "The International Society of Ocular Oncology (ISOO) is a global organization dedicated to advancing the understanding and treatment of ocular tumors and cancers.",
      icon: "🔬",
      highlight: "Active Member",
      gradient: "from-purple-500 to-violet-500",
      hoverColor: "purple-200"
    }
  ];

  return (
    <div className="relative py-12 overflow-hidden scroll-margin-header" id="education">
      {/* Consistent Fading Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-amber-50/30"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Academic Excellence &
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent"> Professional Mastery</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A distinguished career built on exceptional academic foundations and comprehensive professional experience 
            at India&apos;s most prestigious medical institutions.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full"></div>
          </div>
        </div>

        {/* Main Education Container */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/30 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              {/* Academic Journey */}
              <div>
                <div className="text-center lg:text-left mb-5">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Academic Journey</h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full lg:mx-0 mx-auto"></div>
                </div>

                <div className="space-y-4">
                  {educationData.map((education, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-white/50 hover:border-blue-200/60 hover:-translate-y-1"
                    >
                      {index !== educationData.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-indigo-300 opacity-30"></div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                            <span className="text-lg">{education.icon}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {education.highlight}
                            </span>
                            <span className="text-sm font-bold text-blue-600">{education.year}</span>
                          </div>
                          
                          <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                            {education.degree}
                          </h4>
                          <h5 className="text-sm font-semibold text-gray-700 mb-1">
                            {education.institution}
                          </h5>
                          <p className="text-xs text-gray-600 mb-2 font-medium">
                            📍 {education.location}
                          </p>
                          {/* <p className="text-gray-600 leading-relaxed text-xs">
                            {education.description}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center lg:text-left mb-5">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Career Progression</h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full lg:mx-0 mx-auto"></div>
              </div>

              <div className="space-y-4">
                {professionalData.map((experience, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-white/50 hover:border-amber-200/60 hover:-translate-y-1"
                  >
                    {index !== professionalData.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-amber-300 to-orange-300 opacity-30"></div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                          <span className="text-lg">{experience.icon}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            experience.highlight === 'Current' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {experience.highlight}
                          </span>
                          <span className="text-sm font-bold text-amber-600">{experience.year}</span>
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                          {experience.position}
                        </h4>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">
                          {experience.organization}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2 font-medium">
                          📍 {experience.location}
                        </p>
                        {/* <p className="text-gray-600 leading-relaxed text-xs">
                          {experience.description}
                        </p> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Affiliations - Now below both columns in row format */}
          <div id="affiliations" className="border-t border-white/30 pt-6">
            <div className="text-center mb-5">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Professional
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Affiliations</span>
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {affiliationsData.map((affiliation, index) => (
                <div
                  key={index}
                  className={`group relative bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-white/50 hover:border-${affiliation.hoverColor}/60 hover:-translate-y-1 text-center`}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${affiliation.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}>
                        <span className="text-xl">{affiliation.icon}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-center mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          {affiliation.highlight}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">
                        {affiliation.acronym}
                      </h4>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2 leading-tight">
                        {affiliation.fullName}
                      </h5>
                      <p className="hidden text-gray-600 text-xs leading-relaxed md:block">
                        {affiliation.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 