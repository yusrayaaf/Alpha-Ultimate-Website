import { motion } from 'framer-motion';
import { Home, Building2, Sparkles, Wind, Hammer, Sofa, Clock, Check, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { safeStr, safeArr } from '../utils/safe';
import { useContent } from '../hooks/useContent';
import { NavLink } from 'react-router-dom';

const ICON_MAP: Record<string, any> = {
  'post-construction': Hammer, 'move-in-out': Wind, 'full-deep': Sparkles,
  'standard': Home, 'kitchen': Home, 'bathroom': Home, 'sofa': Sofa, 'office': Building2,
};
const COLORS = ['#FFD166','#06D6A0','#9B59FF','#FF6B6B','#C8F4FF','#FFB703','#FFD166','#06D6A0'];

const WHAT_YOU_GET = ['Professional & Vetted Staff','Eco-Friendly Products','All Equipment Provided','100% Satisfaction Guarantee','Flexible Scheduling','Fully Insured Service'];

export default function Services() {
  const { t, i18n } = useTranslation();
  const { content, loading } = useContent();
  const lang = i18n.language;

  return (
    <div style={{ background: '#050508' }} className="text-white pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="badge mb-5">Services</div>
          <h1 className="font-black mb-4" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.92 }}>
            Our <span style={{ background: 'linear-gradient(135deg,#FFD166,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Services</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t('services.subtitle')}</p>
        </motion.div>

        {/* What you get strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card p-5 sm:p-6 mb-16 flex flex-wrap gap-x-8 gap-y-3 justify-center">
          {WHAT_YOU_GET.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <Check size={14} className="text-amber-400 flex-shrink-0" /><span className="text-gray-300">{item}</span>
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
              const title = safeStr(svc.title, lang);
              const desc  = safeStr(svc.description, lang);
              const benefits = safeArr(svc.benefits, lang);
              const included  = safeArr(svc.includedItems, lang);
              const duration  = safeStr(svc.duration, lang);

              return (
                <motion.div key={svc.id}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                  className="card p-7 flex flex-col group"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
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

                  <p className="text-gray-500 text-sm leading-relaxed mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{desc}</p>

                  {(benefits.length > 0 || included.length > 0) && (
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {[...benefits, ...included].slice(0, 4).map((b: string, j: number) => (
                        <div key={j} className="flex items-center gap-1.5 text-xs text-gray-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <Check size={11} style={{ color, flexShrink: 0 }} />{b}
                        </div>
                      ))}
                    </div>
                  )}

                  <NavLink to="/booking" className="mt-auto flex items-center gap-1.5 text-sm font-bold transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover:gap-3"
                    style={{ color, fontFamily: 'Urbanist, sans-serif' }}>
                    Book This Service<ArrowRight size={14} />
                  </NavLink>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <NavLink to="/booking" className="btn-primary text-base inline-flex">
            <Sparkles size={16} />Book a Service Now<ArrowRight size={15} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}
