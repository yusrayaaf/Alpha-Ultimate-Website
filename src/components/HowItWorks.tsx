import { motion } from 'framer-motion';
import { CalendarDays, Users, Star, Sparkles } from 'lucide-react';

const STEPS = [
  { icon: CalendarDays, n: '01', title: 'Book in Seconds',       desc: 'Pick your service, date, and time. Submit online or WhatsApp us. Instant confirmation.', color: '#FFD166' },
  { icon: Users,        n: '02', title: 'We Arrive On Time',     desc: 'Our vetted, uniformed team arrives at your door punctually with all equipment and eco-products.', color: '#06D6A0' },
  { icon: Sparkles,     n: '03', title: 'Deep, Detailed Clean',  desc: 'We work systematically through every room using our proven checklist — leaving nothing untouched.', color: '#9B59FF' },
  { icon: Star,         n: '04', title: 'You\'re Delighted',     desc: 'Enjoy your spotless space. Rate us, rebook, or refer a friend. Your happiness is our measure.', color: '#FF6B6B' },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(255,209,102,0.04)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20">
          <div className="badge mb-6">Our Process</div>
          <h2 className="font-black mb-5" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2rem,5.5vw,4rem)', lineHeight: 0.95 }}>
            Simple. Fast. <span style={{ background: 'linear-gradient(135deg,#9B59FF,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Spotless.</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Four steps from booking to bliss. No complexity, no surprises — just a beautifully clean space.
          </p>
        </motion.div>

        {/* Steps with connectors */}
        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,209,102,0.2),rgba(6,214,160,0.2),rgba(155,89,255,0.2),transparent)' }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center group cursor-default"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div className="w-[104px] h-[104px] rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{ background: `${s.color}10`, border: `2px solid ${s.color}25`, boxShadow: `0 0 0 0 ${s.color}20` }}>
                      <Icon size={36} style={{ color: s.color }} strokeWidth={1.5} />
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 text-[#050508]"
                      style={{ background: s.color, borderColor: '#050508', fontFamily: 'Urbanist, sans-serif' }}>
                      {i + 1}
                    </div>
                    {/* Glow on hover */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ boxShadow: `0 0 40px ${s.color}30` }} />
                  </div>

                  <h3 className="font-black text-white text-lg mb-3" style={{ fontFamily: 'Urbanist, sans-serif' }}>{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Ticker strip */}
        <div className="mt-20 overflow-hidden">
          <div className="flex gap-6 animate-ticker w-max">
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex gap-6">
                {['Residential', 'Commercial', 'Deep Clean', 'Move In/Out', 'Post-Construction', 'Sofa & Upholstery', 'Office Clean', 'Bathroom Deep'].map((item, j) => (
                  <div key={j} className="flex items-center gap-3 px-5 py-2.5 glass rounded-full whitespace-nowrap text-sm font-semibold text-gray-400 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
