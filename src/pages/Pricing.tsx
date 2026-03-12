import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Check, Zap, ArrowRight } from 'lucide-react';
import PriceEstimator from '../components/PriceEstimator';
import { NavLink } from 'react-router-dom';

const TIERS = [
  { name: 'Standard',     price: 'SAR 150+', desc: 'Regular maintenance for a consistently clean home.',   color: '#FFD166', features: ['General dusting & wiping','Vacuum & mop all floors','Kitchen surface clean','Bathroom sanitization','Trash removal'], popular: false },
  { name: 'Deep Clean',   price: 'SAR 300+', desc: 'Intensive top-to-bottom clean for a fresh start.',      color: '#06D6A0', features: ['All Standard tasks','Inside appliances cleaned','Hard-to-reach areas','Grout & tile scrubbing','Eco-certified products','Satisfaction guarantee'], popular: true },
  { name: 'Move In/Out',  price: 'SAR 450+', desc: 'Full property clean for transitions — in or out.',     color: '#9B59FF', features: ['Full Deep Clean','Inside all cabinets','Walls & baseboards','Window interior clean','Full sanitization','Move-ready results'], popular: false },
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
    <div className="card overflow-hidden">
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
    <div style={{ background: '#050508' }} className="text-white pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

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
                className={`card p-7 flex flex-col relative ${tier.popular ? 'ring-1' : ''}`}
                style={tier.popular ? { ringColor: tier.color, boxShadow: `0 0 40px ${tier.color}15` } : {}}>
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="badge text-[10px] py-1 px-3" style={{ background: `${tier.color}15`, borderColor: `${tier.color}30`, color: tier.color }}>
                      <Zap size={9} />Most Popular
                    </div>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-black text-white text-xl mb-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>{tier.name}</h3>
                  <p className="text-gray-600 text-xs mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{tier.desc}</p>
                  <div className="font-black text-3xl" style={{ color: tier.color, fontFamily: 'Urbanist, sans-serif' }}>{tier.price}</div>
                </div>
                <ul className="space-y-3 flex-grow mb-7">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <Check size={14} style={{ color: tier.color, flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <NavLink to="/booking"
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105"
                  style={{ background: `${tier.color}12`, border: `1.5px solid ${tier.color}30`, color: tier.color, fontFamily: 'Urbanist, sans-serif' }}>
                  Book This Plan<ArrowRight size={14} />
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-black text-white text-2xl text-center mb-8" style={{ fontFamily: 'Urbanist, sans-serif' }}>Pricing FAQ</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
