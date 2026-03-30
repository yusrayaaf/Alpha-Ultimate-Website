import { Clock, MapPin, Phone, Mail, MessageCircle, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const CONTACTS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@alpha-01.com',
    href: 'mailto:info@alpha-01.com',
    color: '#FFD166',
    bg: 'rgba(255,209,102,0.10)',
    border: 'rgba(255,209,102,0.20)',
    glassClass: 'hover:glass-gold',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+966 57 869 5494',
    href: 'https://wa.me/966578695494',
    color: '#25D366',
    bg: 'rgba(37,211,102,0.10)',
    border: 'rgba(37,211,102,0.20)',
    glassClass: 'hover:glass-teal',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+966 57 869 5494',
    href: 'tel:+966578695494',
    color: '#9B59FF',
    bg: 'rgba(155,89,255,0.10)',
    border: 'rgba(155,89,255,0.20)',
    glassClass: 'hover:glass-violet',
  },
  {
    icon: HeadphonesIcon,
    label: 'Customer Care',
    value: '+1 650 995 5661',
    href: 'tel:+16509955661',
    color: '#06D6A0',
    bg: 'rgba(6,214,160,0.10)',
    border: 'rgba(6,214,160,0.20)',
    glassClass: 'hover:glass-teal',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Riyadh, Saudi Arabia',
    href: '#',
    color: '#FF6B6B',
    bg: 'rgba(255,107,107,0.10)',
    border: 'rgba(255,107,107,0.20)',
    glassClass: '',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: '24/7 — We never close',
    href: '#',
    color: '#C8F4FF',
    bg: 'rgba(200,244,255,0.08)',
    border: 'rgba(200,244,255,0.15)',
    glassClass: '',
  },
];

export default function ContactInfo() {
  return (
    <div className="glass-panel p-8 max-w-lg mx-auto">
      <h2 className="text-3xl font-black mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
        Contact <span style={{ background: 'linear-gradient(135deg,#FFD166,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Information</span>
      </h2>
      <p className="text-gray-500 text-sm mb-7" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Multiple ways to reach us — pick what works best for you.
      </p>
      <div className="space-y-3">
        {CONTACTS.map((c, i) => {
          const Icon = c.icon;
          const isLink = c.href !== '#';
          const Comp = isLink ? 'a' : 'div';
          const extra: any = isLink ? {
            href: c.href,
            target: c.href.startsWith('http') ? '_blank' : undefined,
            rel: 'noopener noreferrer',
          } : {};
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
              <Comp {...extra}
                className={`flex items-center gap-4 p-4 rounded-2xl glass glass-shine transition-all duration-300 ${c.glassClass} ${isLink ? 'cursor-pointer group' : 'cursor-default'}`}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <Icon size={18} style={{ color: c.color }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{c.label}</p>
                  <p className="text-white font-semibold text-sm truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{c.value}</p>
                </div>
                {isLink && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-gray-700 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                )}
              </Comp>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
