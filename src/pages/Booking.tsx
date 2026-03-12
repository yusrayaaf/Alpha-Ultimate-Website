import { motion } from 'framer-motion';
import { useState, ChangeEvent, FormEvent, useCallback, useEffect } from 'react';
import { UploadCloud, Calendar, CheckCircle, Sparkles } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import LocationPicker from '../components/LocationPicker';
import { useTranslation } from 'react-i18next';
import { safeStr } from '../utils/safe';
import { useContent } from '../hooks/useContent';
import { Service } from '../types';

export default function Booking() {
  const { t, i18n: { language } } = useTranslation();
  const { content, loading } = useContent();
  const [formData, setFormData] = useState({
    name: '', phone: '', city: 'Riyadh', homeType: 'Apartment', service: '',
    date: new Date(), time: '09:00', notes: '',
    location: { lat: 0, lng: 0, address: '' },
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && content?.services.length > 0) {
      setFormData(prev => ({ ...prev, service: content.services[0].id }));
    }
  }, [loading, content]);

  const handleLocationChange = useCallback((location: { lat: number; lng: number; address: string }) => {
    setFormData(cur => ({ ...cur, location, city: '' }));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) errs.phone = 'Enter a valid phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#050508] text-white pt-24 pb-20 flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center spark-border p-14 max-w-md mx-auto">
          <CheckCircle size={64} className="mx-auto text-[#14f195] mb-6" />
          <h2 className="text-3xl font-black text-white mb-3" style={{fontFamily:'Syne,sans-serif'}}>Booking Received!</h2>
          <p className="text-gray-400">We'll contact you shortly to confirm the details.</p>
          <a href="/services" className="btn-secondary mt-8 inline-block text-sm">Explore Services</a>
        </motion.div>
      </div>
    );
  }

  const inputCls = (field: string) =>
    `input-field ${errors[field] ? '!border-red-500/50' : ''}`;

  const SELECT_BASE = "w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[rgba(20,241,149,0.4)] focus:shadow-[0_0_0_3px_rgba(20,241,149,0.08)] transition-all appearance-none";

  return (
    <div className="min-h-screen pt-20 pb-24 text-white">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-12">
          <div className="section-badge mb-4"><Sparkles size={12} />Book a Service</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('booking.title', 'Schedule Your')} <span className="gradient-text">Clean</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('booking.subtitle', 'Fill in the details below and we\'ll be in touch shortly.')}</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }} className="spark-border p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('booking.form.name', 'Full Name')} *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls('name')} placeholder="Your full name" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('booking.form.phone', 'Phone Number')} *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputCls('phone')} placeholder="+966 5X XXXX XXXX" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('booking.form.location', 'Service Location')}</label>
              <LocationPicker onLocationChange={handleLocationChange} />
            </div>
            {/* Home & Service */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('booking.form.homeType', 'Property Type')}</label>
                <select name="homeType" value={formData.homeType} onChange={handleChange} className={SELECT_BASE}>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Office">Office</option>
                  <option value="Commercial Space">Commercial</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('booking.form.service', 'Service Type')}</label>
                <select name="service" value={formData.service} onChange={handleChange} className={SELECT_BASE}>
                  {content?.services.map((s: Service) => (
                    <option key={s.id} value={s.id}>{safeStr(s.title, language)}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('booking.form.date', 'Preferred Date')} *</label>
                <div className="relative">
                  <DatePicker selected={formData.date} onChange={(d: Date | null) => setFormData({ ...formData, date: d || new Date() })}
                    className="input-field !pl-10 w-full" dateFormat="MMMM d, yyyy" minDate={new Date()} />
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('booking.form.time', 'Preferred Time')}</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="input-field" />
              </div>
            </div>
            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                className="input-field resize-none" placeholder="Any special requirements or notes..." />
            </div>
            {/* Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Upload Photos (Optional)</label>
              <label className="flex items-center justify-center gap-3 w-full p-5 rounded-xl border border-dashed border-white/15 cursor-pointer hover:border-[#14f195]/30 hover:bg-[#14f195]/03 transition-all">
                <UploadCloud size={20} className="text-gray-500" />
                <span className="text-sm text-gray-500">{fileName || 'Upload PNG or MP4 for visual quote'}</span>
                <input type="file" className="hidden" accept="image/png,video/mp4" onChange={e => e.target.files?.[0] && setFileName(e.target.files[0].name)} />
              </label>
            </div>
            <button type="submit" disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? <div className="neon-spinner !w-5 !h-5 !border-2" /> : <Sparkles size={15} />}
              {isLoading ? 'Processing...' : 'Book My Cleaning'}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
