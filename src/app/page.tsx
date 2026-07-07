import HeroSection from "@/components/sections/HeroSection";
import TargetAudience from "@/components/sections/TargetAudience";
import WholesalePriceForm from "@/components/sections/WholesalePriceForm";
import CategoriesGrid from "@/components/sections/CategoriesGrid";
import PopularModels from "@/components/sections/PopularModels";
import SendTZBlock from "@/components/sections/SendTZBlock";
import FindAnalogBlock from "@/components/sections/FindAnalogBlock";
import HowWeWork from "@/components/sections/HowWeWork";
import RealizedProjects from "@/components/sections/RealizedProjects";
import DocumentsSection from "@/components/sections/DocumentsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import FinalApplicationForm from "@/components/sections/FinalApplicationForm";

export default function Home() {
  return (
    <>
      <section id="hero">
        <HeroSection />
      </section>
      <section id="target-audience">
        <TargetAudience />
      </section>
      <section id="wholesale-price" className="bg-surface">
        <WholesalePriceForm />
      </section>
      <section id="categories">
        <CategoriesGrid />
      </section>
      <section id="popular-models">
        <PopularModels />
      </section>
      <section id="send-tz">
        <SendTZBlock />
      </section>
      <section id="find-analog">
        <FindAnalogBlock />
      </section>
      <section id="how-we-work" className="bg-surface">
        <HowWeWork />
      </section>
      <section id="projects">
        <RealizedProjects />
      </section>
      <section id="documents" className="bg-surface">
        <DocumentsSection />
      </section>
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <section id="advantages" className="bg-surface">
        <WhyChooseUs />
      </section>
      <section id="final-form">
        <FinalApplicationForm />
      </section>
    </>
  );
}
