
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import SelectedWorks from "@/components/SelectedWorks";
import AlbumsSection from "@/components/AlbumsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <SelectedWorks />
      <AlbumsSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
