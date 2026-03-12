import { NavLink } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSiteAssets } from '../hooks/useSiteAssets';

export default function Footer() {
  const assets = useSiteAssets();
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#080810' }}>
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,209,102,0.3),rgba(6,214,160,0.2),rgba(155,89,255,0.2),transparent)' }} />
      <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <NavLink to="/" className="flex items-center gap-3 mb-5 group">
              <img src={assets.logo} alt="Elevate Builders Ltd" className="h-10 w-auto object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            </NavLink>
            <p className="text-gray-600 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Riyadh's most trusted premium cleaning service. Transforming homes and offices since 2023.
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-600 hover:text-amber-400 hover:border-amber-400/30 transition-all duration-300">
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
                { l: t('footer.privacyPolicy'),   to: '/legal' },
                { l: t('footer.termsOfService'),  to: '/legal' },
                { l: t('footer.refundPolicy'),    to: '/legal' },
              ].map((lnk, i) => (
                <li key={i}>
                  <NavLink to={lnk.to} className="text-gray-600 hover:text-amber-400 text-sm transition-colors duration-300"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{lnk.l}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-wider mb-5" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              {t('footer.contactUs')}
            </h4>
            <ul className="space-y-3.5">
              <li><a href="mailto:info@alpha-ultimate.com" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-amber-400 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}><Mail size={13} className="flex-shrink-0 text-amber-400/60" />info@alpha-ultimate.com</a></li>
              <li><a href="https://wa.me/966563906822" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-green-400 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}><MessageCircle size={13} className="flex-shrink-0 text-green-500/70" />+966 56 3906822</a></li>
              <li><a href="tel:+966578695494" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-teal-400 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}><Phone size={13} className="flex-shrink-0 text-teal-400/60" />+966 57 8695494</a></li>
              <li className="flex items-center gap-2.5 text-sm text-gray-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}><MapPin size={13} className="flex-shrink-0 text-violet-400/60" />Riyadh, Saudi Arabia</li>
            </ul>
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
