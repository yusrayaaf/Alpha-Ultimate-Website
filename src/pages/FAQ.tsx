import { motion } from 'framer-motion';
import FAQ from '../components/FAQ';
import { NavLink } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  return (
    <div style={{ background: '#030307' }} className="text-white pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-4">
          <div className="badge mb-5">Help Center</div>
          <h1 className="font-black mb-4" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.92 }}>
            Frequently Asked <span style={{ background: 'linear-gradient(135deg,#9B59FF,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Questions</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Can't find what you're looking for? WhatsApp us — we reply in minutes.
          </p>
        </motion.div>
        <FAQ />
        <div className="text-center mt-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a href="https://wa.me/966578695494" target="_blank" rel="noopener noreferrer" className="btn-primary">
            <MessageCircle size={15} />Ask on WhatsApp
          </a>
          <NavLink to="/booking" className="btn-secondary"><ArrowRight size={15} />Book a Clean</NavLink>
        </div>
      </div>
    </div>
  );
}
