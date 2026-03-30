import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail, X, HeadphonesIcon } from 'lucide-react';

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CONTACTS = [
  {
    label: 'WhatsApp',
    value: '+966 57 869 5494',
    href: 'https://wa.me/966578695494',
    icon: WA_ICON,
    color: '#25D366',
    bg: 'rgba(37,211,102,0.12)',
    border: 'rgba(37,211,102,0.30)',
  },
  {
    label: 'Customer Care',
    value: '+1 650 995 5661',
    href: 'tel:+16509955661',
    icon: <HeadphonesIcon className="w-5 h-5" />,
    color: '#06D6A0',
    bg: 'rgba(6,214,160,0.12)',
    border: 'rgba(6,214,160,0.30)',
  },
  {
    label: 'Email Us',
    value: 'info@alpha-01.com',
    href: 'mailto:info@alpha-01.com',
    icon: <Mail className="w-5 h-5" />,
    color: '#FFD166',
    bg: 'rgba(255,209,102,0.12)',
    border: 'rgba(255,209,102,0.30)',
  },
];

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2.5">
      {/* Expanded menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col gap-2 items-end"
          >
            {/* Header label */}
            <div className="glass-dark rounded-xl px-3 py-1.5 mb-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Contact Us</p>
            </div>
            {CONTACTS.map((c, i) => (
              <motion.a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl glass-shine transition-all duration-300 hover:scale-105 group"
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 0 ${c.color}40`,
                }}
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: c.color, opacity: 0.8 }}>{c.label}</span>
                  <span className="text-white text-sm font-semibold">{c.value}</span>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: c.color, background: `${c.color}20` }}>
                  {c.icon}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
        style={{
          background: open
            ? 'rgba(255,255,255,0.08)'
            : 'linear-gradient(135deg,#25D366,#128C7E)',
          border: open
            ? '1px solid rgba(255,255,255,0.15)'
            : '1px solid rgba(37,211,102,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: open
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(37,211,102,0.35), 0 0 0 0 rgba(37,211,102,0.4)',
          animation: open ? 'none' : 'wa-pulse 2.5s ease-in-out infinite',
        }}
        aria-label="Contact us"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} className="text-white" />
              </motion.div>
            : <motion.div key="wa" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
