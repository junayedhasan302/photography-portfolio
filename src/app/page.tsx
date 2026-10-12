
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import SelectedWorks from "@/components/SelectedWorks";
import AlbumsSection from "@/components/AlbumsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#10110f] text-[#f4f0e8]">
      <Navbar />
      <Hero />
      <SelectedWorks />
      <AlbumsSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
