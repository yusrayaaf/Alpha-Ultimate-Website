import { NavLink } from 'react-router-dom';
import { Menu, X, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteAssets } from '../hooks/useSiteAssets';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const assets = useSiteAssets();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const nav = [
    { label: t('nav.home'),     to: '/' },
    { label: t('nav.services'), to: '/services' },
    { label: t('nav.pricing'),  to: '/pricing' },
    { label: t('nav.gallery'),  to: '/gallery' },
    { label: t('nav.contact'),  to: '/contact' },
    { label: t('nav.faq'),      to: '/faq' },
  ];

  return (
    <header dir={isRtl ? 'rtl' : 'ltr'}
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? 'glass-dark shadow-[0_4px_40px_rgba(0,0,0,0.7)] border-b border-white/[0.07]'
        : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative flex items-center justify-center">
            <img src={assets.logo} alt="Alpha Ultimate" className="h-10 w-auto object-contain"
              loading="eager" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#030307] bg-green-400 animate-pulse" />
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {nav.map(link => (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isActive
                  ? 'text-amber-300 glass-gold border-amber-400/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Quick contact */}
          <a href="tel:+16509955661"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-semibold text-gray-300 hover:text-white hover:border-teal-400/30 transition-all duration-300">
            <Phone size={11} className="text-teal-400" />
            +1 650 995 5661
          </a>
          <a href="https://wa.me/966578695494" target="_blank" rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-semibold text-gray-300 hover:text-green-400 hover:border-green-400/30 transition-all duration-300">
            <MessageCircle size={11} className="text-green-400" />
            WhatsApp
          </a>
          <LanguageSwitcher />
          <NavLink to="/booking" className="hidden md:inline-flex btn-primary !text-sm !py-2 !px-5">
            <Sparkles size={13} />{t('nav.book')}
          </NavLink>
          <button onClick={() => setOpen(!open)} aria-label="menu" aria-expanded={open}
            className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/6 transition-colors">
            <AnimatePresence mode="wait">
              {open
                ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={21} /></motion.div>
                : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={21} /></motion.div>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-[62px] bg-[#030307]/70 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="lg:hidden relative glass-dark border-t border-white/5 z-50 overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-1">
                {nav.map((link, i) => (
                  <motion.div key={link.to} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <NavLink to={link.to} onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block py-3.5 px-4 text-sm font-semibold rounded-xl transition-all ${isActive
                          ? 'text-amber-300 glass-gold border-amber-400/15'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'}`
                      }
                    >{link.label}</NavLink>
                  </motion.div>
                ))}
                {/* Mobile contact quick links */}
                <div className="pt-2 pb-1 grid grid-cols-2 gap-2">
                  <a href="tel:+16509955661" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2.5 px-3 rounded-xl glass text-xs font-semibold text-teal-400 hover:bg-white/5 transition-all">
                    <Phone size={13} />+1 650 995 5661
                  </a>
                  <a href="https://wa.me/966578695494" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2.5 px-3 rounded-xl glass text-xs font-semibold text-green-400 hover:bg-white/5 transition-all">
                    <MessageCircle size={13} />WhatsApp
                  </a>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <NavLink to="/booking" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                    <Sparkles size={14} />{t('nav.book')}
                  </NavLink>
                </div>
              </nav>
              <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
