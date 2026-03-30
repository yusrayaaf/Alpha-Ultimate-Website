import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQ_EN = [
  { q: 'What areas of Riyadh do you serve?', a: 'We cover all major districts of Riyadh including Al Olaya, Al Malqa, Al Nakheel, Al Rawdah, and surrounding areas. Contact us to confirm coverage for your location.' },
  { q: 'Are your cleaning products safe for children and pets?', a: 'Absolutely. We use exclusively non-toxic, biodegradable, eco-certified products that are completely safe for children, pets, and the whole family.' },
  { q: 'Do I need to be home during the cleaning?', a: 'No — many of our regular clients provide us with access. All staff are background-verified, insured, and trusted. We treat every home with the same care as our own.' },
  { q: 'How quickly can you come?', a: 'We offer same-day and next-day bookings subject to availability. For urgent requirements, WhatsApp us directly at +966 57 869 5494 — we move fast.' },
  { q: 'What is included in a Deep Clean?', a: 'Deep cleaning covers every room top-to-bottom: inside appliances, behind furniture, window sills, baseboards, grout lines, and all fixtures. It\'s the full reset your home deserves.' },
  { q: 'Do you bring your own equipment?', a: 'Yes. Our team arrives fully equipped — professional-grade vacuums, steam cleaners, eco-safe chemicals, and everything needed to deliver outstanding results.' },
  { q: 'What if I\'m not satisfied with the clean?', a: 'We offer a 100% satisfaction guarantee. If any area doesn\'t meet your expectations, contact us within 24 hours and we\'ll return to make it right — at no extra cost.' },
];

function Item({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  const colors = ['#FFD166','#06D6A0','#9B59FF','#FF6B6B','#C8F4FF','#FFB703','#FFD166'];
  const c = colors[i % colors.length];
  return (
    <div className={`card overflow-hidden ${open ? 'border-opacity-30' : ''}`}
      style={{ borderColor: open ? `${c}30` : undefined }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-white/[0.02] transition-colors gap-4 group">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <span className="text-xs font-black flex-shrink-0" style={{ color: c, fontFamily: 'Urbanist, sans-serif' }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-semibold text-gray-200 text-sm sm:text-base" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{q}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ background: open ? `${c}15` : 'transparent', border: `1px solid ${open ? c + '40' : 'rgba(255,255,255,0.1)'}` }}>
            <ChevronDown size={14} style={{ color: open ? c : '#6b7280' }} />
          </div>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden">
            <p className="px-5 sm:px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-white/5 pt-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as { question: string; answer: string }[];
  const data = Array.isArray(items) && items[0]?.question ? items : FAQ_EN.map(f => ({ question: f.q, answer: f.a }));

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-14">
          <div className="badge mb-6">FAQ</div>
          <h2 className="font-black mb-4" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2rem,5.5vw,4rem)', lineHeight: 0.95 }}>
            Got <span style={{ background: 'linear-gradient(135deg,#FFD166,#FF9A3C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Questions?</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t('faq.subtitle')}</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {data.slice(0, 7).map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <Item q={item.question} a={item.answer} i={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
