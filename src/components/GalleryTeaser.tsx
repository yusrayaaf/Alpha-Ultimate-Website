import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const MEDIA = [
  { type: 'video', src: '/assets/gallery-1.mp4',         label: 'Living Room',  span: 'lg:col-span-2 lg:row-span-2' },
  { type: 'video', src: '/assets/gallery-2.mp4',         label: 'Kitchen',      span: '' },
  { type: 'video', src: '/assets/gallery-3.mp4',         label: 'Bathroom',     span: '' },
  { type: 'image', src: '/assets/gallery-kitchen-1.png', label: 'Result',       span: '' },
  { type: 'video', src: '/assets/gallery-living-1.mp4',  label: 'Deep Living',  span: '' },
];

export default function GalleryTeaser() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'rgba(155,89,255,0.06)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="badge mb-4">Our Work</div>
            <h2 className="font-black" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 0.95 }}>
              See the <span style={{ background: 'linear-gradient(135deg,#9B59FF,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Transformation</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <NavLink to="/gallery" className="btn-secondary !text-sm whitespace-nowrap">
              Full Gallery<ArrowRight size={14} />
            </NavLink>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[180px] lg:auto-rows-[200px]">
          {MEDIA.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${m.span}`}
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {m.type === 'video' ? (
                <video src={m.src} autoPlay loop muted playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
              ) : (
                <img src={m.src} alt={m.label} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              {m.type === 'video' && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,209,102,0.8)' }}>
                  <Play size={10} className="text-[#050508] ml-0.5" fill="currentColor" />
                </div>
              )}
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(8px)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {m.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
