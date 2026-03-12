import { motion } from 'framer-motion';
import { useState } from 'react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { Camera, Play } from 'lucide-react';

const MEDIA = [
  { type: 'video', src: '/assets/gallery-1.mp4',          label: 'Living Room Deep Clean' },
  { type: 'video', src: '/assets/gallery-2.mp4',          label: 'Kitchen Transformation' },
  { type: 'video', src: '/assets/gallery-3.mp4',          label: 'Bathroom Restoration' },
  { type: 'video', src: '/assets/gallery-bathroom-1.mp4', label: 'Bathroom Deep Clean' },
  { type: 'video', src: '/assets/gallery-living-1.mp4',   label: 'Full Living Area' },
  { type: 'image', src: '/assets/gallery-kitchen-1.png',  label: 'Kitchen Result' },
  { type: 'image', src: '/assets/gallery-whole-home-1.png',label: 'Whole Home' },
];

const BEFORE_AFTER = [
  { before: '/assets/before-1.png', after: '/assets/after-1.png', title: 'Living Room — Before & After' },
  { before: '/assets/before-2.png', after: '/assets/after-2.png', title: 'Kitchen Deep Clean — Before & After' },
];

export default function Gallery() {
  const [active, setActive] = useState('all');

  return (
    <div style={{ background: '#050508' }} className="text-white pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="badge mb-5"><Camera size={11} />Gallery</div>
          <h1 className="font-black mb-4" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.92 }}>
            Our <span style={{ background: 'linear-gradient(135deg,#9B59FF,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Work</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Every clean tells a story. Witness the transformation.</p>
        </motion.div>

        {/* Media grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {MEDIA.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="group relative rounded-2xl overflow-hidden aspect-video"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              {item.type === 'video'
                ? <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                : <img src={item.src} alt={item.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(5,5,8,0.75)', backdropFilter: 'blur(8px)', fontFamily: 'Space Grotesk, sans-serif' }}>{item.label}</span>
              </div>
              {item.type === 'video' && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,209,102,0.85)' }}>
                  <Play size={10} className="text-[#050508] ml-0.5" fill="currentColor" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Before/After */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-8">
          <h2 className="font-black text-center mb-12" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Before & <span style={{ background: 'linear-gradient(135deg,#FFD166,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>After</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {BEFORE_AFTER.map((pair, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="p-4 pb-0">
                  <p className="font-semibold text-white text-sm mb-3 text-center" style={{ fontFamily: 'Urbanist, sans-serif' }}>{pair.title}</p>
                </div>
                <BeforeAfterSlider before={pair.before} after={pair.after} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
