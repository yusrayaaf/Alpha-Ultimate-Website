import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, CheckCircle, AlertCircle, Loader2, ExternalLink, Trash2, RefreshCw } from 'lucide-react';

interface UploadRecord {
  id: number;
  name: string;
  url: string;
  display_url: string;
  thumb: string;
  type: string;
  uploaded_at: string;
}

export default function FileUpload() {
  const [uploads, setUploads]   = useState<UploadRecord[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  const loadUploads = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/upload', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.uploads) setUploads(data.uploads);
    } catch { /* silent */ }
    finally { setFetching(false); }
  }, [token]);

  useEffect(() => { loadUploads(); }, [loadUploads]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res((r.result as string).split(',')[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files are supported.'); return; }
    if (file.size > 20 * 1024 * 1024) { setError('File size must be under 20MB.'); return; }
    setLoading(true); setError('');
    try {
      const base64 = await toBase64(file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image: base64, name: file.name.replace(/\.[^/.]+$/, ''), type: 'image' }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        await loadUploads();
      } else {
        setError(data.error || data.message || 'Upload failed. Check IMGBB_API_KEY in Vercel settings.');
      }
    } catch { setError('Upload failed. Check your internet connection.'); }
    finally { setLoading(false); }
  }, [token, loadUploads]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    Array.from(e.dataTransfer.files).forEach(uploadFile);
  }, [uploadFile]);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteUpload = async (id: number) => {
    await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    setUploads(u => u.filter(x => x.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-black text-white text-xl mb-1">Media Library</h2>
          <p className="text-gray-500 text-sm">Upload images via <a href="https://imgbb.com/api" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">ImgBB</a>. Records saved to NeonDB.</p>
        </div>
        <button onClick={loadUploads} disabled={fetching}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white text-sm transition-all">
          <RefreshCw size={13} className={fetching ? 'animate-spin' : ''}/> Refresh
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          dragging
            ? 'border-yellow-400/60 bg-yellow-400/5 scale-[1.01]'
            : 'border-white/10 hover:border-yellow-400/30 hover:bg-white/[0.02]'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => Array.from(e.target.files || []).forEach(uploadFile)} />
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={36} className="text-yellow-400 animate-spin" />
            <p className="text-gray-400 text-sm">Uploading to ImgBB…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
              <Upload size={24} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Drop images here or click to upload</p>
              <p className="text-gray-500 text-xs mt-1">PNG, JPG, WebP, GIF · Max 20MB per file</p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-red-400/8 border border-red-400/20">
            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-400 text-sm font-medium">{error}</p>
              {error.includes('IMGBB') && (
                <a href="https://api.imgbb.com/" target="_blank" rel="noopener noreferrer"
                  className="text-yellow-400 text-xs hover:underline flex items-center gap-1 mt-1">
                  Get free ImgBB API key <ExternalLink size={10} />
                </a>
              )}
            </div>
            <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400"><X size={14}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery */}
      {fetching && !uploads.length ? (
        <div className="flex items-center justify-center py-12 text-gray-500 gap-2">
          <Loader2 size={18} className="animate-spin"/> Loading library…
        </div>
      ) : uploads.length > 0 ? (
        <div>
          <h3 className="font-display font-bold text-white text-sm mb-3">
            Library ({uploads.length} file{uploads.length !== 1 ? 's' : ''})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploads.map((f) => (
              <motion.div key={f.id} initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                className="group relative rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.02] aspect-square">
                <img src={f.thumb || f.display_url} alt={f.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-2">
                  <p className="text-white text-[10px] font-medium text-center line-clamp-2">{f.name}</p>
                  <button onClick={() => copyUrl(f.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-all">
                    {copied === f.url ? <><CheckCircle size={11}/>Copied!</> : <><Image size={11}/>Copy URL</>}
                  </button>
                  <div className="flex items-center gap-2">
                    <a href={f.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-white transition-colors">
                      <ExternalLink size={9} /> Open
                    </a>
                    <button onClick={() => deleteUpload(f.id)}
                      className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 size={9} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600 text-sm">
          No uploads yet. Upload your first image above.
        </div>
      )}

      <div className="rounded-xl border border-yellow-400/15 bg-yellow-400/5 p-4">
        <p className="text-yellow-400 font-bold text-xs mb-2">📸 Setup Required</p>
        <ol className="space-y-1 text-gray-400 text-xs list-decimal list-inside">
          <li>Sign up free at <a href="https://api.imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">api.imgbb.com</a></li>
          <li>Copy your API key</li>
          <li>Add to Vercel env: <code className="bg-black/40 text-yellow-300 px-1 rounded">IMGBB_API_KEY=your_key</code></li>
          <li>Also add <code className="bg-black/40 text-yellow-300 px-1 rounded">DATABASE_URL</code> (NeonDB) to save upload history</li>
        </ol>
      </div>
    </div>
  );
}
