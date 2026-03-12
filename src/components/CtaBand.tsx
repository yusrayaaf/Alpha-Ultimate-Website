import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Sparkles, ArrowRight, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CtaBand() {
  const { t } = useTranslation();
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(255,209,102,0.08) 0%,rgba(6,214,160,0.05) 50%,rgba(155,89,255,0.08) 100%)' }} />
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,209,102,0.3),rgba(6,214,160,0.3),transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(155,89,255,0.3),rgba(255,107,107,0.2),transparent)' }} />

      {/* Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(255,209,102,0.07)' }} />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(155,89,255,0.07)' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="badge mb-7">Get Started Today</div>

          <h2 className="font-black mb-6" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2.2rem,6vw,4.5rem)', lineHeight: 0.92 }}>
            Ready for a <span style={{ background: 'linear-gradient(135deg,#FFD166,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Spotless</span><br />Home?
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {t('ctaBand.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NavLink to="/booking" className="btn-primary text-base w-full sm:w-auto justify-center">
              <Sparkles size={16} />Book Now — It's Easy<ArrowRight size={15} />
            </NavLink>
            <a href="https://wa.me/966563906822" target="_blank" rel="noopener noreferrer"
              className="btn-secondary w-full sm:w-auto justify-center">
              <Phone size={15} />WhatsApp Us
            </a>
          </div>

          <p className="mt-8 text-xs text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            ✓ No commitments &nbsp;·&nbsp; ✓ Free quotes &nbsp;·&nbsp; ✓ 100% satisfaction guaranteed
          </p>
        </motion.div>
      </div>
    </section>
  );
}
