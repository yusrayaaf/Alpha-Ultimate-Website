import { motion } from 'framer-motion';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle, ArrowRight } from 'lucide-react';

const CONTACTS = [
  { icon: Mail,          label: 'Email',     value: 'info@alpha-ultimate.com',  href: 'mailto:info@alpha-ultimate.com',  color: '#FFD166' },
  { icon: MessageCircle, label: 'WhatsApp',  value: '+966 56 3906822',           href: 'https://wa.me/966563906822',      color: '#25D366' },
  { icon: Phone,         label: 'Phone',     value: '+966 57 8695494',           href: 'tel:+966578695494',               color: '#9B59FF' },
  { icon: MapPin,        label: 'Location',  value: 'Riyadh, Saudi Arabia',      href: '#',                               color: '#FF6B6B' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill all required fields.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) setDone(true);
      else setError('Something went wrong. Please try WhatsApp instead.');
    } catch { setError('Network error. Please WhatsApp us directly.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#050508' }} className="text-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="badge mb-5">Contact Us</div>
          <h1 className="font-black mb-4" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.92 }}>
            Get in <span style={{ background: 'linear-gradient(135deg,#FFD166,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Touch</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            We're here 24/7. Reach out any way that works best for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex flex-col gap-4">
            {CONTACTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="card p-5 flex items-center gap-4 group hover:border-opacity-40 transition-all"
                  style={{ ['--hover-border' as any]: c.color }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${c.color}12`, border: `1px solid ${c.color}25` }}>
                    <Icon size={20} style={{ color: c.color }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-widest mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{c.label}</p>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{c.value}</p>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-gray-700 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </a>
              );
            })}

            {/* WhatsApp highlight */}
            <div className="card p-6" style={{ background: 'rgba(37,211,102,0.04)', borderColor: 'rgba(37,211,102,0.2)' }}>
              <p className="text-green-400 font-bold text-sm mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>⚡ Fastest Response</p>
              <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                For the quickest response, WhatsApp us. Our team replies in minutes, day or night.
              </p>
              <a href="https://wa.me/966563906822" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105"
                style={{ background: 'rgba(37,211,102,0.1)', border: '1.5px solid rgba(37,211,102,0.35)', color: '#25D366', fontFamily: 'Urbanist, sans-serif' }}>
                <MessageCircle size={15} />Start WhatsApp Chat
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>
            {done ? (
              <div className="card p-10 flex flex-col items-center justify-center text-center h-full">
                <CheckCircle size={52} className="text-green-400 mb-5" />
                <h3 className="font-black text-white text-2xl mb-3" style={{ fontFamily: 'Urbanist, sans-serif' }}>Message Sent!</h3>
                <p className="text-gray-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>We'll get back to you within 24 hours. Check your WhatsApp too!</p>
              </div>
            ) : (
              <div className="card p-7">
                <h3 className="font-black text-white text-xl mb-6" style={{ fontFamily: 'Urbanist, sans-serif' }}>Send a Message</h3>
                {error && <p className="text-red-400 text-sm mb-4 p-3 rounded-xl bg-red-400/8 border border-red-400/20" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us about your cleaning needs..." className="input-field resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary justify-center">
                    {loading ? <span className="w-4 h-4 border-2 border-[#050508] border-t-transparent rounded-full animate-spin" /> : <Send size={15} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
