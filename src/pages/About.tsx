import { motion } from 'framer-motion';
import { Award, Users, Leaf, Star, ArrowRight, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const STATS = [
  { val:'2,500+', label:'Clients Served', color:'#c8ff57' },
  { val:'4.97★', label:'Avg Rating',      color:'#ffb703' },
  { val:'50+',   label:'Team Members',    color:'#00e5ff' },
  { val:'3 yrs', label:'Of Excellence',   color:'#7c3aed' },
];
const VALUES = [
  { icon: Award, title: 'Quality First',    desc: 'ISO-certified processes with documented quality checks. We never cut corners.', color: '#c8ff57' },
  { icon: Leaf,  title: 'Eco Commitment',   desc: 'All products are biodegradable and certified safe for families and the planet.', color: '#10b981' },
  { icon: Users, title: 'People Powered',   desc: 'Our team is our strength — vetted, trained, fairly compensated, and proud of their craft.', color: '#00e5ff' },
  { icon: Star,  title: 'Client First',     desc: '100% satisfaction guarantee on every single job. Your happiness is non-negotiable.', color: '#ffb703' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-24 text-white">
      {/* Hero */}
      <div className="relative py-16 sm:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/10 rounded-full blur-[130px]" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <div className="badge mb-5">About Us</div>
            <h1 className="font-display font-black mb-5" style={{ fontSize:'clamp(2.5rem,8vw,5.5rem)', lineHeight:1 }}>
              <span className="text-white">Built on </span><span className="grad-aurora">Trust & Excellence</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              ELEVATE BUILDERS LTD was founded with one vision: to make premium, professional cleaning accessible to every home and business in Riyadh. Since 2023, we've delivered thousands of spotless results with unwavering commitment to quality.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.09 }}
              className="card p-6 text-center group">
              <div className="font-display font-black text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform" style={{ color:s.color }}>{s.val}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-6 leading-tight">
              Our Story — <span className="grad-lime">The Alpha Way</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4 text-base">
              ELEVATE BUILDERS LTD was born from a simple frustration: cleaning services that over-promised and under-delivered. Our founders — experienced professionals with backgrounds in hospitality and facilities management — decided to build something different.
            </p>
            <p className="text-gray-500 leading-relaxed text-sm">
              We started with a small team in Riyadh, obsessing over every detail, every surface, every client interaction. That obsession grew into a reputation. Today, we're proud to serve 2,500+ families and businesses across Riyadh, with a 4.97-star average and a 100% satisfaction policy that we've never had to compromise on.
            </p>
          </motion.div>
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
            className="card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/8 rounded-full blur-[60px]" />
            <blockquote className="relative">
              <div className="text-6xl font-display text-lime-400/20 mb-4">"</div>
              <p className="text-gray-300 text-lg leading-relaxed italic mb-6">
                We don't just clean homes — we restore peace of mind. When a client returns to a spotless space, that moment of pure relief and joy is why we do what we do.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center font-black text-black">A</div>
                <div>
                  <div className="font-bold text-white text-sm">ELEVATE BUILDERS LTD Founder</div>
                  <div className="text-xs text-gray-600">Riyadh, Saudi Arabia</div>
                </div>
              </div>
            </blockquote>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-10">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">Our Core Values</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                className="card p-6 text-center group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto transition-all duration-500 group-hover:scale-110"
                  style={{ background:`${v.color}12`, border:`1px solid ${v.color}25` }}>
                  <Icon size={24} style={{ color:v.color }} strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-lime-400 transition-colors">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="text-center">
          <NavLink to="/booking" className="btn-primary inline-flex text-base">
            <Sparkles size={16} /> Book Your Clean <ArrowRight size={15} />
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}
