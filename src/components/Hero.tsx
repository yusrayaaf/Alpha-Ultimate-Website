import { motion, useScroll, useTransform } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, ChevronDown, ArrowRight, Star, Phone } from 'lucide-react';
import { useRef } from 'react';
import { useSiteAssets } from '../hooks/useSiteAssets';

const STATS = [
  { n: '2,500+', l: 'Clients Served' },
  { n: '4.97★', l: 'Star Rating' },
  { n: '24/7',  l: 'Support' },
  { n: '100%',  l: 'Guaranteed' },
];

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const ref = useRef<HTMLDivElement>(null);
  const assets = useSiteAssets();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const vidY   = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div ref={ref} className="relative min-h-[100svh] w-full flex items-center overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── FULL-SCREEN VIDEO ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: vidY }}>
        <video autoPlay loop muted playsInline preload="metadata"
          poster="/assets/after-1.png"
          className="absolute inset-0 w-full h-full object-cover scale-[1.08]">
          <source src={assets.hero_video} type="video/mp4" />
        </video>

        {/* Multi-layer cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/75 via-[#050508]/45 to-[#050508]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/70 via-transparent to-[#050508]/30" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(255,209,102,0.07) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(135deg, rgba(155,89,255,0.08) 0%, transparent 50%, rgba(6,214,160,0.05) 100%)' }} />
      </motion.div>

      {/* ── ANIMATED ORBS ── */}
      <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full blur-[140px] z-0 pointer-events-none animate-glow-beat"
        style={{ background: 'rgba(155,89,255,0.1)' }} />
      <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full blur-[120px] z-0 pointer-events-none animate-glow-beat"
        style={{ background: 'rgba(6,214,160,0.08)', animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[100px] z-0 pointer-events-none"
        style={{ background: 'rgba(255,209,102,0.05)' }} />

      {/* ── GRID ── */}
      <div className="absolute inset-0 grid-pattern opacity-15 z-0" />

      {/* ── FLOATING BADGES (desktop) ── */}
      {[
        { emoji: '⭐', text: '5-Star Rated', delay: 0,   top: '22%', left: '5%' },
        { emoji: '🌿', text: 'Eco-Safe',     delay: 0.8, top: '60%', left: '4%' },
        { emoji: '🏆', text: 'Best in Riyadh', delay: 1.6, top: '30%', right: '5%' },
        { emoji: '💎', text: 'Premium Quality', delay: 2.4, top: '65%', right: '4%' },
      ].map((b, i) => (
        <motion.div key={i}
          className="hidden xl:flex absolute z-10 items-center gap-2 glass rounded-full px-4 py-2.5 text-xs font-semibold text-white whitespace-nowrap"
          style={{ top: b.top, left: (b as any).left, right: (b as any).right }}
          initial={{ opacity: 0, x: (b as any).left ? -20 : 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
          transition={{ delay: b.delay, duration: 0.6, y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: b.delay } }}
        >
          <span className="text-base">{b.emoji}</span>{b.text}
        </motion.div>
      ))}

      {/* ── CONTENT ── */}
      <motion.div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24 text-center"
        style={{ y: textY, opacity: fadeOut }}>

        {/* Live badge */}
        <motion.div initial={{ opacity: 0, y: -16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center">
          <div className="badge">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Riyadh's Premium Cleaning Service · Est. 2023
            <Star size={9} className="text-amber-300" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.18 }}
          className="font-black leading-[0.9] tracking-tight mb-7"
          style={{ fontSize: 'clamp(2.8rem, 9.5vw, 7.5rem)', fontFamily: 'Urbanist, sans-serif' }}
        >
          <span className="block text-white">Transform Your</span>
          <span className="block" style={{ background: 'linear-gradient(135deg,#FFD166 0%,#06D6A0 45%,#9B59FF 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Space. Elevate
          </span>
          <span className="block text-white">Your Life.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.36 }}
          className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed px-2"
          style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.2rem)', fontFamily: 'Space Grotesk, sans-serif' }}>
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.52 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14 px-4">
          <NavLink to="/booking" className="btn-primary text-sm sm:text-base w-full sm:w-auto justify-center">
            <Sparkles size={15} />Book Your Clean Now<ArrowRight size={14} />
          </NavLink>
          <NavLink to="/pricing" className="btn-secondary text-sm sm:text-base w-full sm:w-auto justify-center">
            View Pricing
          </NavLink>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/966578695494" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-300 hover:text-green-400 hover:border-green-400/30 font-semibold transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href="tel:+16509955661"
              className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-300 hover:text-teal-400 hover:border-teal-400/30 font-semibold transition-all duration-300">
              <Phone size={14} className="text-teal-400" />
              Care: +1 650 995 5661
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.72 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto px-2">
          {STATS.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4 sm:p-5 text-center group hover:border-amber-400/30 transition-all duration-300 cursor-default">
              <div className="font-black text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform duration-300"
                style={{ fontFamily: 'Urbanist, sans-serif', background: 'linear-gradient(135deg,#FFD166,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {s.n}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gray-600">
        <p className="text-[9px] tracking-[0.28em] uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Explore</p>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </div>
  );
}
