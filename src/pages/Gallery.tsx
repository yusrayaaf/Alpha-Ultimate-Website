import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { Camera, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

const MEDIA = [
  { type: 'video', src: '/assets/gallery-1.mp4',           label: 'Living Room Deep Clean',   cat: 'video' },
  { type: 'video', src: '/assets/gallery-2.mp4',           label: 'Kitchen Transformation',   cat: 'video' },
  { type: 'video', src: '/assets/gallery-3.mp4',           label: 'Bathroom Restoration',     cat: 'video' },
  { type: 'video', src: '/assets/gallery-bathroom-1.mp4',  label: 'Bathroom Deep Clean',      cat: 'video' },
  { type: 'video', src: '/assets/gallery-living-1.mp4',    label: 'Full Living Area',         cat: 'video' },
  { type: 'image', src: '/assets/gallery-kitchen-1.png',   label: 'Kitchen Result',           cat: 'photo' },
  { type: 'image', src: '/assets/gallery-whole-home-1.png',label: 'Whole Home',               cat: 'photo' },
];

const BEFORE_AFTER = [
  { before: '/assets/before-1.png', after: '/assets/after-1.png', title: 'Living Room — Before & After' },
  { before: '/assets/before-2.png', after: '/assets/after-2.png', title: 'Kitchen Deep Clean — Before & After' },
];

const CATS = ['all', 'video', 'photo'];

export default function Gallery() {
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === 'all' ? MEDIA : MEDIA.filter(m => m.cat === active);

  const prev = () => setLightbox(l => l === null ? null : l === 0 ? filtered.length - 1 : l - 1);
  const next = () => setLightbox(l => l === null ? null : l === filtered.length - 1 ? 0 : l + 1);

  return (
    <div style={{ background: '#030307' }} className="text-white pt-24 pb-20 min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-10" style={{ background: 'rgba(155,89,255,0.2)' }} />
        <div className="absolute inset-0 dot-pattern opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-12">
          <div className="badge mb-5"><Camera size={11} />Gallery</div>
          <h1 className="font-black mb-4" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.92 }}>
            Our <span style={{ background: 'linear-gradient(135deg,#9B59FF,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Work</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Every clean tells a story. Witness the transformation.</p>

          {/* Filter tabs */}
          <div className="inline-flex glass rounded-full p-1 gap-1">
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  active === cat ? 'bg-amber-400 text-[#030307]' : 'text-gray-500 hover:text-white'
                }`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Media grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div key={item.src} layout
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }} transition={{ delay: i * 0.05 }}
                onClick={() => setLightbox(i)}
                className="group relative rounded-2xl overflow-hidden aspect-video cursor-pointer glass-shine"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {item.type === 'video'
                  ? <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  : <img src={item.src} alt={item.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                }
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="glass-strong rounded-full p-3">
                    {item.type === 'video' ? <Play size={18} className="text-white ml-0.5" fill="white" /> : <Camera size={18} className="text-white" />}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(3,3,7,0.8)', backdropFilter: 'blur(12px)', fontFamily: 'Space Grotesk, sans-serif' }}>{item.label}</span>
                </div>
                {item.type === 'video' && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center glass" style={{ background: 'rgba(255,209,102,0.85)' }}>
                    <Play size={10} className="text-[#030307] ml-0.5" fill="currentColor" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Before/After */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-8">
          <h2 className="font-black text-white text-center mb-10" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Before & <span style={{ background: 'linear-gradient(135deg,#FFD166,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>After</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {BEFORE_AFTER.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-panel p-4">
                <p className="text-sm font-bold text-gray-400 mb-3 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.title}</p>
                <BeforeAfterSlider before={item.before} after={item.after} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            style={{ background: 'rgba(3,3,7,0.95)', backdropFilter: 'blur(20px)' }}
            onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 glass w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-10">
              <X size={18} />
            </button>
            <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 glass w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-10">
              <ChevronLeft size={18} />
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 glass w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-10">
              <ChevronRight size={18} />
            </button>
            <motion.div key={lightbox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl w-full rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              {filtered[lightbox]?.type === 'video'
                ? <video src={filtered[lightbox].src} autoPlay controls className="w-full max-h-[80vh] object-contain" />
                : <img src={filtered[lightbox]?.src} alt={filtered[lightbox]?.label} className="w-full max-h-[80vh] object-contain" />
              }
              <div className="glass-dark px-4 py-2.5">
                <p className="text-white text-sm font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{filtered[lightbox]?.label}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
