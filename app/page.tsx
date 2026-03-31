import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";
import WhyTechie from "@/components/WhyTechie";
import Games from "@/components/Games";
import RegForm from "@/components/register";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <AboutUs />
      <WhyTechie />
      <Games />
      <RegForm />
      <Footer />
    </div>
  );
}
