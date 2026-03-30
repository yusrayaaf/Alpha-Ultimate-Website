import { NavLink } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, MessageCircle, HeadphonesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSiteAssets } from '../hooks/useSiteAssets';

export default function Footer() {
  const assets = useSiteAssets();
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#05050e' }}>
      {/* Glassmorphic top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,209,102,0.4),rgba(6,214,160,0.3),rgba(155,89,255,0.3),transparent)' }} />

      {/* Background orbs */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{ background: 'rgba(255,209,102,0.05)' }} />
      <div className="absolute top-0 right-0 w-[300px] h-[200px] rounded-full blur-[100px] pointer-events-none opacity-20"
        style={{ background: 'rgba(155,89,255,0.08)' }} />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2">
            <NavLink to="/" className="flex items-center gap-3 mb-5 group">
              <img src={assets.logo} alt="Alpha Ultimate" className="h-10 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            </NavLink>
            <p className="text-gray-600 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Riyadh's most trusted premium cleaning service. Transforming homes and offices since 2023.
            </p>

            {/* Contact cards — glassmorphic */}
            <div className="space-y-2.5 mb-6">
              <a href="mailto:info@alpha-01.com"
                className="flex items-center gap-3 p-3 rounded-xl glass hover:glass-gold transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,209,102,0.12)' }}>
                  <Mail size={14} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">Email</p>
                  <p className="text-white text-xs font-semibold group-hover:text-amber-300 transition-colors">info@alpha-01.com</p>
                </div>
              </a>
              <a href="https://wa.me/966578695494" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl glass hover:glass-teal transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,211,102,0.12)' }}>
                  <MessageCircle size={14} className="text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">WhatsApp</p>
                  <p className="text-white text-xs font-semibold group-hover:text-green-400 transition-colors">+966 57 869 5494</p>
                </div>
              </a>
              <a href="tel:+16509955661"
                className="flex items-center gap-3 p-3 rounded-xl glass hover:glass-teal transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(6,214,160,0.12)' }}>
                  <HeadphonesIcon size={14} className="text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">Customer Care</p>
                  <p className="text-white text-xs font-semibold group-hover:text-teal-400 transition-colors">+1 650 995 5661</p>
                </div>
              </a>
              <div className="flex items-center gap-3 p-3 rounded-xl glass">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(155,89,255,0.12)' }}>
                  <MapPin size={14} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">Location</p>
                  <p className="text-white text-xs font-semibold">Riyadh, Saudi Arabia</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl glass glass-shine flex items-center justify-center text-gray-600 hover:text-amber-400 hover:border-amber-400/30 transition-all duration-300">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-wider mb-5" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {[
                { l: t('nav.services'), to: '/services' },
                { l: t('nav.pricing'),  to: '/pricing' },
                { l: t('nav.gallery'),  to: '/gallery' },
                { l: t('nav.book'),     to: '/booking' },
                { l: t('nav.faq'),      to: '/faq' },
              ].map((lnk, i) => (
                <li key={i}>
                  <NavLink to={lnk.to}
                    className="text-gray-600 hover:text-amber-400 text-sm transition-colors duration-300 flex items-center gap-2 group"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span className="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {lnk.l}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-wider mb-5" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              {t('footer.legal')}
            </h4>
            <ul className="space-y-3">
              {[
                { l: t('footer.privacyPolicy'),  to: '/legal' },
                { l: t('footer.termsOfService'), to: '/legal' },
                { l: t('footer.refundPolicy'),   to: '/legal' },
              ].map((lnk, i) => (
                <li key={i}>
                  <NavLink to={lnk.to} className="text-gray-600 hover:text-amber-400 text-sm transition-colors duration-300"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{lnk.l}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-wider mb-5" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              Support
            </h4>
            <div className="space-y-4">
              {/* Hours glass card */}
              <div className="glass-gold rounded-xl p-4">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Business Hours</p>
                <p className="text-white text-sm font-semibold">24 / 7</p>
                <p className="text-gray-500 text-xs">We never close</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-xs mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Need instant help? Chat with us directly on WhatsApp.
                </p>
                <a href="https://wa.me/966578695494" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-green-400 hover:text-green-300 transition-colors">
                  <MessageCircle size={12} />Start Chat →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-700 text-xs" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {t('footer.copyright', { year })}
          </p>
          <p className="text-gray-700 text-xs" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {t('footer.developer')}
          </p>
          <NavLink to="/admin/login" className="text-gray-800 hover:text-gray-500 text-xs transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Admin
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
