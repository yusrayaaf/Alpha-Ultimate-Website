import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, SmilePlus, Clock4, Award, Zap } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, title: 'Fully Vetted Professionals', desc: 'Every cleaner is background-checked, insured, and trained to the highest standards. Your home, your trust, our promise.', color: '#FFD166', bg: 'rgba(255,209,102,0.08)', border: 'rgba(255,209,102,0.15)', num: '01' },
  { icon: Leaf,        title: 'Eco-Safe Products',         desc: 'Biodegradable, non-toxic formulas safe for children, pets, and the planet — without sacrificing a single spot of clean.', color: '#06D6A0', bg: 'rgba(6,214,160,0.08)',   border: 'rgba(6,214,160,0.15)',   num: '02' },
  { icon: SmilePlus,   title: '100% Satisfaction Pledge',  desc: 'Not happy? We return and re-clean at zero cost. We don\'t leave until you\'re genuinely delighted with the result.', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.15)', num: '03' },
  { icon: Clock4,      title: 'Book in 60 Seconds',        desc: 'Our frictionless booking system lets you schedule a professional clean faster than ordering coffee. Available 24/7.', color: '#9B59FF', bg: 'rgba(155,89,255,0.08)',  border: 'rgba(155,89,255,0.15)',  num: '04' },
  { icon: Award,       title: 'ISO-Grade Standards',       desc: 'We follow documented, audited cleaning checklists on every job ensuring consistent, five-star quality every time.', color: '#C8F4FF', bg: 'rgba(200,244,255,0.06)', border: 'rgba(200,244,255,0.12)', num: '05' },
  { icon: Zap,         title: 'Lightning Fast Response',   desc: 'Same-day and next-day bookings available. Emergency cleaning? Call us — we move fast when you need us most.', color: '#FFB703', bg: 'rgba(255,183,3,0.08)',   border: 'rgba(255,183,3,0.15)',   num: '06' },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none animate-glow-beat"
        style={{ background: 'rgba(155,89,255,0.07)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none animate-glow-beat"
        style={{ background: 'rgba(255,209,102,0.05)', animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20">
          <div className="badge mb-6">Why Choose ELEVATE BUILDERS LTD</div>
          <h2 className="font-black mb-5 leading-[0.95]" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2rem,5.5vw,4rem)' }}>
            The Alpha <span style={{ background: 'linear-gradient(135deg,#FFD166,#FF9A3C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Difference</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(0.9rem,1.8vw,1.05rem)' }}>
            We're not just a cleaning company — we're your partners in maintaining a healthy, beautiful space you're proud to live and work in.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card glass-shine p-7 group cursor-default relative overflow-hidden"
              >
                {/* Number watermark */}
                <span className="absolute top-4 right-5 text-5xl font-black opacity-5 select-none" style={{ fontFamily: 'Urbanist, sans-serif', color: f.color }}>
                  {f.num}
                </span>

                {/* Icon */}
                <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ width: 52, height: 52, background: f.bg, border: `1px solid ${f.border}`, boxShadow: `0 0 24px ${f.bg}` }}>
                  <Icon size={24} style={{ color: f.color }} strokeWidth={1.8} />
                </div>

                <h3 className="font-black text-[1.05rem] text-white mb-3 group-hover:translate-x-1 transition-transform duration-300"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {f.desc}
                </p>

                {/* Bottom glow line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
