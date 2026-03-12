import { useSEO } from '../hooks/useSEO';
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import ServicesPreview from '../components/ServicesPreview';
import GalleryTeaser from '../components/GalleryTeaser';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CtaBand from '../components/CtaBand';

export default function Home() {
  useSEO({ title: 'Home', description: 'Alpha Ultimate — Riyadh\'s #1 premium cleaning service. Deep cleaning, move-in/out, post-construction. Book 24/7.', canonical: '/' });
  return (
    <div style={{ background: '#050508' }}>
      <Hero />
      <WhyChooseUs />
      <ServicesPreview />
      <GalleryTeaser />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CtaBand />
    </div>
  );
}
