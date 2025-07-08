export default function AcademicContributions() {
  const contributions = [
    {
      title: "Research & Publications",
      description: "Active participant in ophthalmic research with contributions to peer-reviewed publications in oculoplasty and orbital surgery.",
      icon: "RP",
      color: "amber-700",
      items: [
        "Active participant in National conferences",
        "Presents research papers at International meetings", 
        "Contributes to advancement in Ophthalmology"
      ]
    },
    {
      title: "Professional Standing",
      description: "Recognized expertise in the field with active participation in professional organizations and continuing medical education.",
      icon: "PS",
      color: "amber-700",
      items: [
        "Respected figure in Oculoplasty field",
        "Commitment to precision and innovation",
        "High standards of patient care"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white rounded-lg px-6 py-3 shadow-md mb-6">
            <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">AC</span>
            </div>
            <span className="text-amber-700 font-medium">Academic</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Academic
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Contributions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Contributing to the advancement of oculoplastic surgery through research, education, and knowledge sharing.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {contributions.map((contribution, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-amber-200">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-${contribution.color} rounded-lg mb-6`}>
                <span className="text-lg font-bold text-white">{contribution.icon}</span>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {contribution.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {contribution.description}
                </p>
                
                {/* Items List */}
                <ul className="space-y-3">
                  {contribution.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Research Highlights */}
        <div className="bg-amber-50 rounded-xl p-12 border border-amber-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Research Highlights</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dr. Murthy&apos;s commitment to advancing the field of oculoplastic surgery through evidence-based practice and continuous learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-sm font-bold">DD</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Data-Driven</h4>
              <p className="text-gray-600 text-sm">Evidence-based surgical approaches</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-sm font-bold">GR</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
              <p className="text-gray-600 text-sm">International collaboration</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-sm font-bold">IN</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Innovation</h4>
              <p className="text-gray-600 text-sm">Advanced surgical techniques</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-sm font-bold">ED</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
              <p className="text-gray-600 text-sm">Knowledge sharing & mentoring</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 