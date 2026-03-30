import { motion } from 'framer-motion';
import { Home, Building2, Sparkles, Wind, Hammer, Sofa, Clock, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { safeStr, safeArr } from '../utils/safe';
import { useContent } from '../hooks/useContent';
import { NavLink } from 'react-router-dom';

const ICON_MAP: Record<string, any> = {
  'post-construction': Hammer, 'move-in-out': Wind, 'full-deep': Sparkles,
  'standard': Home, 'kitchen': Home, 'bathroom': Home, 'sofa': Sofa, 'office': Building2,
};
const COLORS = ['#FFD166','#06D6A0','#9B59FF','#FF6B6B','#C8F4FF','#FFB703','#FFD166','#06D6A0'];
const GRADIENTS = [
  'from-amber-400/8 to-transparent',
  'from-teal-400/8 to-transparent',
  'from-violet-400/8 to-transparent',
  'from-red-400/8 to-transparent',
  'from-cyan-400/8 to-transparent',
  'from-yellow-400/8 to-transparent',
];

const WHAT_YOU_GET = [
  'Professional & Vetted Staff',
  'Eco-Friendly Products',
  'All Equipment Provided',
  '100% Satisfaction Guarantee',
  'Flexible Scheduling',
  'Fully Insured Service',
];

export default function Services() {
  const { t, i18n } = useTranslation();
  const { content, loading } = useContent();
  const lang = i18n.language;

  return (
    <div style={{ background: '#030307' }} className="text-white pt-24 pb-20 min-h-screen">
      {/* Decorative bg */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-10" style={{ background: 'rgba(6,214,160,0.2)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-10" style={{ background: 'rgba(255,209,102,0.15)' }} />
        <div className="absolute inset-0 dot-pattern opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="badge mb-5">Services</div>
          <h1 className="font-black mb-4" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.92 }}>
            Our <span style={{ background: 'linear-gradient(135deg,#FFD166,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Services</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t('services.subtitle')}</p>
        </motion.div>

        {/* What you get — glassmorphic strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel p-5 sm:p-6 mb-16 flex flex-wrap gap-x-8 gap-y-3 justify-center">
          {WHAT_YOU_GET.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <div className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center flex-shrink-0">
                <Check size={11} className="text-amber-400" />
              </div>
              <span className="text-gray-300">{item}</span>
            </div>
          ))}
        </motion.div>

        {/* Services grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="neon-spinner" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {(content?.services || []).map((svc: any, i: number) => {
              const Icon = ICON_MAP[svc.id] || Sparkles;
              const color = COLORS[i % COLORS.length];
              const grad = GRADIENTS[i % GRADIENTS.length];
              const title = safeStr(svc.title, lang);
              const desc  = safeStr(svc.description, lang);
              const benefits = safeArr(svc.benefits, lang);
              const included  = safeArr(svc.includedItems, lang);
              const duration  = safeStr(svc.duration, lang);

              return (
                <motion.div key={svc.id}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                  className="card glass-shine p-7 flex flex-col group relative overflow-hidden"
                >
                  {/* Gradient tint */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${grad} pointer-events-none rounded-2xl`} />

                  <div className="relative z-10 flex items-start gap-4 mb-5">
                    <div className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                      <Icon size={22} style={{ color }} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-white text-lg mb-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>{title}</h3>
                      {duration && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <Clock size={11} />{duration}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="relative z-10 text-gray-500 text-sm leading-relaxed mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{desc}</p>

                  {(benefits.length > 0 || included.length > 0) && (
                    <div className="relative z-10 grid grid-cols-2 gap-2 mb-6">
                      {[...benefits, ...included].slice(0, 4).map((b: string, j: number) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-gray-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                            <Check size={9} style={{ color }} />
                          </div>
                          {b}
                        </div>
                      ))}
                    </div>
                  )}

                  <NavLink to="/booking"
                    className="relative z-10 mt-auto flex items-center gap-2 text-sm font-bold transition-all duration-300 hover:translate-x-1"
                    style={{ color, fontFamily: 'Urbanist, sans-serif' }}>
                    Book This Service <ArrowRight size={14} />
                  </NavLink>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel p-8 text-center">
          <h2 className="font-black text-white text-2xl mb-3" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            Not sure which service you need?
          </h2>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Chat with us on WhatsApp — we'll help you pick the right service and give you a free instant quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/966578695494" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <MessageCircle size={15} />WhatsApp: +966 57 869 5494
            </a>
            <NavLink to="/booking" className="btn-primary"><Sparkles size={14} />Book Online Now</NavLink>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
