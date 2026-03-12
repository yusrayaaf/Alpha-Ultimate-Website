import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'bn', label: 'বাংলা', short: 'BN' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-gray-400 hover:text-white transition-all duration-300 text-sm font-semibold"
      >
        <Globe size={14} className="text-[#FFD166]" />
        <span>{current.short}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-36 glass rounded-xl overflow-hidden shadow-xl z-50"
            style={{ border: '1px solid rgba(20,241,149,0.15)' }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { i18n.changeLanguage(lang.code); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-[#FFD166]/08 transition-colors ${
                  i18n.language === lang.code ? 'text-[#FFD166] font-bold' : 'text-gray-400'
                }`}
              >
                {lang.label}
                {i18n.language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-[#FFD166] shadow-[0_0_6px_rgba(20,241,149,0.8)]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
