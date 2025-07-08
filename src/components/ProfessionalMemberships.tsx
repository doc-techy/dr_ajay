export default function ProfessionalMemberships() {
  const memberships = [
    { 
      acronym: "AIOS", 
      fullName: "All India Ophthalmological Society",
      color: "blue-700",
      icon: "AI"
    },
    { 
      acronym: "OAI", 
      fullName: "Oculoplastics Association of India",
      color: "blue-700",
      icon: "OA"
    },
    { 
      acronym: "ISOO", 
      fullName: "International Society of Ocular Oncology",
      color: "blue-700",
      icon: "IS"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white rounded-lg px-6 py-3 shadow-md mb-6">
            <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">PM</span>
            </div>
            <span className="text-amber-700 font-medium">Memberships</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional
                          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Affiliations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Active membership in leading professional organizations demonstrates commitment to excellence and continuous learning.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {memberships.map((membership, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-amber-200">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-${membership.color} rounded-lg mb-6 mx-auto`}>
                <span className="text-lg font-bold text-white">{membership.icon}</span>
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {membership.acronym}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {membership.fullName}
                </p>
                
                {/* Membership Badge */}
                <div className={`inline-flex items-center bg-${membership.color} text-white px-4 py-2 rounded-md text-sm font-medium`}>
                  Active Member
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-amber-50 rounded-xl p-8 border border-amber-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Commitment to Excellence</h3>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              These professional memberships reflect Dr. Murthy&apos;s dedication to staying current with the latest 
              advancements in oculoplastic surgery and maintaining the highest standards of patient care.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-md text-sm font-medium">
                Excellence in Practice
              </span>
              <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-md text-sm font-medium">
                Professional Standards
              </span>
              <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-md text-sm font-medium">
                Continuing Education
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 