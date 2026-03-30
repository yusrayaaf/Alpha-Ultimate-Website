import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Check, Zap, ArrowRight, MessageCircle, HeadphonesIcon } from 'lucide-react';
import PriceEstimator from '../components/PriceEstimator';
import { NavLink } from 'react-router-dom';

const TIERS = [
  { name: 'Standard',     price: 'SAR 150+', desc: 'Regular maintenance for a consistently clean home.',   color: '#FFD166', gradient: 'from-amber-400/10 to-amber-400/5',   features: ['General dusting & wiping','Vacuum & mop all floors','Kitchen surface clean','Bathroom sanitization','Trash removal'], popular: false },
  { name: 'Deep Clean',   price: 'SAR 300+', desc: 'Intensive top-to-bottom clean for a fresh start.',      color: '#06D6A0', gradient: 'from-teal-400/10 to-teal-400/5',     features: ['All Standard tasks','Inside appliances cleaned','Hard-to-reach areas','Grout & tile scrubbing','Eco-certified products','Satisfaction guarantee'], popular: true },
  { name: 'Move In/Out',  price: 'SAR 450+', desc: 'Full property clean for transitions — in or out.',     color: '#9B59FF', gradient: 'from-violet-400/10 to-violet-400/5',  features: ['Full Deep Clean','Inside all cabinets','Walls & baseboards','Window interior clean','Full sanitization','Move-ready results'], popular: false },
];

const FAQS = [
  { q: 'How is pricing calculated?',       a: 'Base rate by service type, adjusted for property size, location, and any add-ons you select.' },
  { q: 'Are there hidden fees?',            a: 'Never. The price quoted is the price you pay. No surprises, ever.' },
  { q: 'Discounts for recurring bookings?', a: 'Yes — weekly bookings get 20% off, bi-weekly get 15% off. Ask us for a custom package.' },
  { q: 'What payment methods?',             a: 'Cash, bank transfer, and all major credit/debit cards. Pay after service.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card glass-shine overflow-hidden transition-all ${open ? 'border-amber-400/20' : ''}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left hover:bg-white/[0.02] transition-colors gap-4">
        <span className="font-semibold text-gray-200 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
          <ChevronDown size={16} style={{ color: open ? '#FFD166' : '#4b5563' }} />
        </motion.div>
      </button>
      {open && <p className="px-5 pb-5 text-sm text-gray-500 border-t border-white/5 pt-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{a}</p>}
    </div>
  );
}

export default function Pricing() {
  return (
    <div style={{ background: '#030307' }} className="text-white pt-24 pb-20 min-h-screen">
      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15" style={{ background: 'rgba(255,209,102,0.2)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px] opacity-10" style={{ background: 'rgba(155,89,255,0.2)' }} />
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="badge mb-5">Pricing</div>
          <h1 className="font-black mb-4" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.92 }}>
            Transparent <span style={{ background: 'linear-gradient(135deg,#FFD166,#FF9A3C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Pricing</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No hidden fees. No surprises. Use our estimator for a personalized quote in seconds.</p>
        </motion.div>

        {/* Estimator */}
        <div className="mb-20"><PriceEstimator /></div>

        {/* Tiers */}
        <div className="mb-20">
          <h2 className="font-black text-center text-white mb-12" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Choose Your <span style={{ background: 'linear-gradient(135deg,#06D6A0,#0BB4CC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Plan</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TIERS.map((tier, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`glass-panel glass-shine p-7 flex flex-col relative ${tier.popular ? 'scale-[1.03]' : ''}`}
                style={tier.popular ? { borderColor: `${tier.color}35`, boxShadow: `0 0 60px ${tier.color}15, 0 32px 80px rgba(0,0,0,0.5)` } : {}}>
                {/* Gradient tint */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} rounded-2xl pointer-events-none`} />
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <div className="badge text-[10px] py-1 px-3" style={{ background: `${tier.color}15`, borderColor: `${tier.color}40`, color: tier.color }}>
                      <Zap size={9} />Most Popular
                    </div>
                  </div>
                )}
                <div className="relative z-10 mb-6">
                  <h3 className="font-black text-white text-xl mb-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>{tier.name}</h3>
                  <p className="text-gray-600 text-xs mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{tier.desc}</p>
                  <div className="font-black text-4xl" style={{ color: tier.color, fontFamily: 'Urbanist, sans-serif' }}>{tier.price}</div>
                </div>
                <ul className="relative z-10 space-y-3 flex-grow mb-7">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${tier.color}15` }}>
                        <Check size={11} style={{ color: tier.color }} />
                      </div>{f}
                    </li>
                  ))}
                </ul>
                <NavLink to="/booking"
                  className="relative z-10 flex items-center justify-center gap-2 py-3 px-5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105"
                  style={{ background: `${tier.color}15`, border: `1.5px solid ${tier.color}35`, color: tier.color, fontFamily: 'Urbanist, sans-serif' }}>
                  Book {tier.name}<ArrowRight size={14} />
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel p-6 sm:p-8 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-black text-white text-xl mb-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>Need a custom quote?</h3>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Large properties, corporate packages, or recurring contracts — we have tailored solutions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a href="https://wa.me/966578695494" target="_blank" rel="noopener noreferrer" className="btn-whatsapp !text-sm !py-2.5 !px-5 whitespace-nowrap">
              <MessageCircle size={14} />WhatsApp: +966 57 869 5494
            </a>
            <a href="tel:+16509955661" className="btn-secondary !text-sm !py-2.5 !px-5 whitespace-nowrap">
              <HeadphonesIcon size={14} />Care: +1 650 995 5661
            </a>
          </div>
        </motion.div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-black text-center text-white mb-10" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(1.6rem,3.5vw,2.5rem)' }}>Pricing FAQs</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
