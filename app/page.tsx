import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WorkSection from "@/components/WorkSection";
import WhyFayms from "@/components/WhyFayms";
import Process from "@/components/Process";
import CtaBand from "@/components/CtaBand";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <WorkSection />
        <WhyFayms />
        <Process />
        <CtaBand />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
