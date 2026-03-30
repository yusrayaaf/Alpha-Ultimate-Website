import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, AlertCircle, Loader2, Home, Wrench, HelpCircle, MessageSquare, Info, Phone } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  fields: { key: string; label: string; multiline?: boolean }[];
}

const SECTIONS: Section[] = [
  {
    id: 'home',
    label: 'Home Page',
    icon: Home,
    description: 'Hero section headline, subtitle and call-to-action button',
    fields: [
      { key: 'hero.title',    label: 'Hero Title' },
      { key: 'hero.subtitle', label: 'Hero Subtitle', multiline: true },
      { key: 'hero.cta',      label: 'CTA Button Text' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact Info',
    icon: Phone,
    description: 'Phone numbers, email, WhatsApp and address',
    fields: [
      { key: 'phone',     label: 'Primary Phone' },
      { key: 'whatsapp',  label: 'WhatsApp Number' },
      { key: 'email',     label: 'Email Address' },
      { key: 'address',   label: 'Address', multiline: true },
    ],
  },
  {
    id: 'about',
    label: 'About',
    icon: Info,
    description: 'Company story, mission and values',
    fields: [
      { key: 'title',       label: 'Section Title' },
      { key: 'description', label: 'Main Description', multiline: true },
      { key: 'mission',     label: 'Mission Statement', multiline: true },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: Wrench,
    description: 'Edit as JSON — service titles, descriptions, pricing',
    fields: [],
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: HelpCircle,
    description: 'Edit as JSON — questions and answers',
    fields: [],
  },
  {
    id: 'testimonials',
    label: 'Reviews',
    icon: MessageSquare,
    description: 'Edit as JSON — client testimonials',
    fields: [],
  },
];

export default function ContentEditor() {
  const [activeSection, setActiveSection] = useState('home');
  const [flatValues, setFlatValues]   = useState<Record<string, string>>({});
  const [jsonValues, setJsonValues]   = useState<Record<string, string>>({});
  const [rawContent, setRawContent]   = useState<Record<string, any>>({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  // Flatten nested object for simple field editing
  const flatten = (obj: any, prefix = ''): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const k in obj) {
      const val = obj[k];
      const key = prefix ? `${prefix}.${k}` : k;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        Object.assign(out, flatten(val, key));
      } else {
        out[key] = Array.isArray(val) ? JSON.stringify(val, null, 2) : String(val ?? '');
      }
    }
    return out;
  };

  // Set nested value by dotted key
  const setNested = (obj: any, path: string, val: string): any => {
    const parts = path.split('.');
    const clone = JSON.parse(JSON.stringify(obj));
    let cur = clone;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    try { cur[parts[parts.length - 1]] = JSON.parse(val); }
    catch { cur[parts[parts.length - 1]] = val; }
    return clone;
  };

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => {
        setRawContent(data);
        const flat: Record<string, string> = {};
        const json: Record<string, string> = {};
        for (const sec of SECTIONS) {
          if (!sec.fields.length) {
            json[sec.id] = JSON.stringify(data[sec.id] ?? {}, null, 2);
          } else {
            const secData = data[sec.id] ?? {};
            const secFlat = flatten(secData);
            for (const f of sec.fields) {
              flat[`${sec.id}.${f.key}`] = secFlat[f.key] ?? '';
            }
          }
        }
        setFlatValues(flat);
        setJsonValues(json);
      })
      .catch(() => setError('Failed to load content from server.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const payload: Record<string, any> = JSON.parse(JSON.stringify(rawContent));

      // Apply flat field changes
      for (const [dotKey, val] of Object.entries(flatValues)) {
        const [sec, ...rest] = dotKey.split('.');
        const secPath = rest.join('.');
        payload[sec] = setNested(payload[sec] ?? {}, secPath, val)[secPath.split('.')[0]]
          !== undefined ? setNested(payload[sec] ?? {}, secPath, val) : payload[sec];
      }

      // Apply JSON section changes
      for (const [sec, jsonStr] of Object.entries(jsonValues)) {
        try { payload[sec] = JSON.parse(jsonStr); }
        catch { setError(`Invalid JSON in "${sec}" section. Please fix before saving.`); setSaving(false); return; }
      }

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setRawContent(payload);
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } else {
        setError(d.error || d.message || 'Save failed. Check DATABASE_URL in Vercel env vars.');
      }
    } catch (e: any) {
      setError(e.message || 'Network error. Try again.');
    } finally { setSaving(false); }
  };

  const section = SECTIONS.find(s => s.id === activeSection)!;

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
      <Loader2 size={20} className="animate-spin text-yellow-400"/> Loading content…
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-black text-white text-xl mb-1">Content Manager</h2>
          <p className="text-gray-500 text-sm">Changes are saved to NeonDB and go live immediately.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#FFD166,#FF9A3C)', color: '#050508', boxShadow: saved ? '0 0 30px rgba(255,209,102,0.5)' : undefined }}>
          {saving ? <Loader2 size={15} className="animate-spin"/> : saved ? <CheckCircle size={15}/> : <Save size={15}/>}
          {saving ? 'Saving…' : saved ? 'Saved! ✅' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-400/8 border border-red-400/20 text-red-400 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0"/>
          <span>{error}</span>
        </div>
      )}

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeSection === s.id
                  ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30'
                  : 'text-gray-500 hover:text-gray-300 bg-white/[0.03] border border-white/5'
              }`}>
              <Icon size={13}/>{s.label}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <motion.div key={activeSection} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}>
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 bg-white/[0.02] border-b border-white/[0.06] flex items-center gap-2">
            <section.icon size={14} className="text-yellow-400"/>
            <span className="text-white text-sm font-semibold">{section.label}</span>
            <span className="ml-2 text-[10px] text-gray-600">{section.description}</span>
          </div>

          <div className="p-5 space-y-4">
            {section.fields.length > 0 ? (
              // Simple field editors
              section.fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{f.label}</label>
                  {f.multiline ? (
                    <textarea
                      value={flatValues[`${section.id}.${f.key}`] ?? ''}
                      onChange={e => setFlatValues(v => ({ ...v, [`${section.id}.${f.key}`]: e.target.value }))}
                      rows={4}
                      className="w-full bg-black/20 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-400/40 transition-all resize-none"
                      spellCheck={false}
                    />
                  ) : (
                    <input
                      type="text"
                      value={flatValues[`${section.id}.${f.key}`] ?? ''}
                      onChange={e => setFlatValues(v => ({ ...v, [`${section.id}.${f.key}`]: e.target.value }))}
                      className="w-full bg-black/20 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-400/40 transition-all"
                      style={{ fontSize: 'max(16px, 0.875rem)' }}
                    />
                  )}
                </div>
              ))
            ) : (
              // JSON editor for complex sections
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">JSON Editor</label>
                  <span className="text-[10px] text-gray-700 font-mono">Edit raw JSON — be careful with formatting</span>
                </div>
                <textarea
                  value={jsonValues[section.id] ?? ''}
                  onChange={e => setJsonValues(v => ({ ...v, [section.id]: e.target.value }))}
                  rows={20}
                  className="w-full bg-black/30 border border-white/[0.07] rounded-xl px-4 py-3 text-xs text-gray-300 font-mono outline-none focus:border-yellow-400/40 transition-all resize-none"
                  spellCheck={false}
                  style={{ minHeight: '340px' }}
                />
              </div>
            )}
          </div>
        </div>

        {!process.env.NODE_ENV && (
          <p className="text-gray-700 text-xs mt-3">
            Content is saved to NeonDB. Requires <code className="bg-white/5 px-1 rounded">DATABASE_URL</code> env var.
          </p>
        )}
      </motion.div>
    </div>
  );
}
