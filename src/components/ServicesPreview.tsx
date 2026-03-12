import { motion } from 'framer-motion';
import { Home, Building2, Sparkles, ArrowRight, Wind, Hammer, Sofa, BathIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SERVICES = [
  { icon: Sparkles, title: 'Deep Cleaning',          desc: 'Top-to-bottom intensive clean. Every surface, every corner — nothing overlooked.', price: 'From SAR 300', color: '#FFD166', gradient: 'linear-gradient(135deg,rgba(255,209,102,0.12),rgba(255,209,102,0.02))' },
  { icon: Home,     title: 'Standard Home Clean',    desc: 'Regular maintenance that keeps your home fresh, hygienic, and ready for life.', price: 'From SAR 150', color: '#06D6A0', gradient: 'linear-gradient(135deg,rgba(6,214,160,0.12),rgba(6,214,160,0.02))' },
  { icon: Wind,     title: 'Move In / Move Out',     desc: 'Leave your old place spotless. Arrive at a gleaming new one. Full-service transition clean.', price: 'From SAR 450', color: '#9B59FF', gradient: 'linear-gradient(135deg,rgba(155,89,255,0.12),rgba(155,89,255,0.02))' },
  { icon: Hammer,   title: 'Post-Construction',      desc: 'Dust, debris, cement, paint — we tackle the aftermath of any build or renovation.', price: 'From SAR 500', color: '#FF6B6B', gradient: 'linear-gradient(135deg,rgba(255,107,107,0.12),rgba(255,107,107,0.02))' },
  { icon: Building2,title: 'Office & Commercial',   desc: 'A pristine workspace drives productivity. We clean offices, retail, and commercial spaces.', price: 'Custom Quote', color: '#C8F4FF', gradient: 'linear-gradient(135deg,rgba(200,244,255,0.1),rgba(200,244,255,0.02))' },
  { icon: Sofa,     title: 'Sofa & Upholstery',     desc: 'Deep extraction cleaning for sofas, mattresses, and fabric — restored to like-new condition.', price: 'From SAR 100', color: '#FFB703', gradient: 'linear-gradient(135deg,rgba(255,183,3,0.12),rgba(255,183,3,0.02))' },
];

export default function ServicesPreview() {
  const { t } = useTranslation();
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: 'rgba(6,214,160,0.06)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20">
          <div className="badge mb-6">What We Offer</div>
          <h2 className="font-black mb-5 leading-[0.95]" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2rem,5.5vw,4rem)' }}>
            Every Clean, <span style={{ background: 'linear-gradient(135deg,#06D6A0,#0BB4CC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Perfected</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {t('servicesPreview.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card p-7 flex flex-col group"
                style={{ background: s.gradient }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <Icon size={22} style={{ color: s.color }} strokeWidth={1.8} />
                </div>
                <h3 className="font-black text-white text-lg mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.desc}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="font-bold text-sm" style={{ color: s.color, fontFamily: 'Urbanist, sans-serif' }}>{s.price}</span>
                  <NavLink to="/booking"
                    className="flex items-center gap-1.5 text-xs font-bold transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover:gap-2.5"
                    style={{ color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                    Book Now<ArrowRight size={13} />
                  </NavLink>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-12">
          <NavLink to="/services" className="btn-secondary">
            View All Services <ArrowRight size={15} />
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
}
