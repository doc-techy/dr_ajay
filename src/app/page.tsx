import {
  Header,
  Footer,
  HeroSection,
  EducationSection,
  SpecializationsSection,
  BookSection,
  VlogsSection
} from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <Header />
      
      <main>
        <section id="about">
          <HeroSection />
        </section>
        
        <section id="education">
          <EducationSection />
        </section>
        
        <section id="specializations">
          <SpecializationsSection />
        </section>
        
        {/* <section id="services">
          <ServicesSection />
        </section> */}
        
        <section id="book">
          <BookSection />
        </section>
        
        <section id="vlogs">
          <VlogsSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
