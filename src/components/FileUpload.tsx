import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Image as ImageIcon, CheckCircle, AlertCircle,
  Loader2, ExternalLink, Trash2, RefreshCw, Video, Search,
  Copy, Filter, FolderOpen, Link2, Check,
} from 'lucide-react';

interface UploadRecord {
  id: number;
  name: string;
  url: string;
  display_url: string;
  thumb: string;
  type: string;
  category: string;
  uploaded_at: string;
}

const CATEGORIES = [
  { id: 'all',         label: 'All Media' },
  { id: 'general',     label: 'General' },
  { id: 'gallery',     label: 'Gallery' },
  { id: 'before-after',label: 'Before / After' },
  { id: 'team',        label: 'Team' },
  { id: 'services',    label: 'Services' },
  { id: 'blog',        label: 'Blog' },
];

export default function FileUpload() {
  const [uploads, setUploads]       = useState<UploadRecord[]>([]);
  const [dragging, setDragging]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(false);
  const [error, setError]           = useState('');
  const [copied, setCopied]         = useState<string | null>(null);
  const [search, setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [videoUrl, setVideoUrl]     = useState('');
  const [videoName, setVideoName]   = useState('');
  const [videoSaving, setVideoSaving] = useState(false);
  const [selected, setSelected]     = useState<number[]>([]);
  const [deleting, setDeleting]     = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const loadUploads = useCallback(async () => {
    setFetching(true);
    try {
      const url = activeCategory === 'all'
        ? '/api/admin/upload'
        : `/api/admin/upload?category=${activeCategory}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.uploads) setUploads(data.uploads);
    } catch { /* silent */ }
    finally { setFetching(false); }
  }, [token, activeCategory]);

  useEffect(() => { loadUploads(); }, [loadUploads]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res((r.result as string).split(',')[1]);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files are supported for direct upload. Use Video URL tab for videos.'); return; }
    if (file.size > 24 * 1024 * 1024) { setError('File size must be under 24MB.'); return; }
    setLoading(true); setError(''); setUploadProgress(10);
    try {
      const base64 = await toBase64(file);
      setUploadProgress(40);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          image: base64,
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'image',
          category: uploadCategory,
        }),
      });
      setUploadProgress(80);
      const data = await res.json();
      if (data.success && data.url) {
        setUploadProgress(100);
        await loadUploads();
      } else {
        setError(data.error || data.message || 'Upload failed. Check IMGBB_API_KEY in Vercel settings.');
      }
    } catch { setError('Upload failed. Check your internet connection.'); }
    finally { setLoading(false); setTimeout(() => setUploadProgress(0), 600); }
  }, [token, loadUploads, uploadCategory]);

  const saveVideoUrl = async () => {
    if (!videoUrl.trim()) return;
    setVideoSaving(true); setError('');
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: 'video',
          videoUrl: videoUrl.trim(),
          name: videoName.trim() || 'video',
          category: uploadCategory,
        }),
      });
      const data = await res.json();
      if (data.success) { setVideoUrl(''); setVideoName(''); await loadUploads(); }
      else setError(data.error || 'Could not save video URL.');
    } catch { setError('Network error saving video URL.'); }
    finally { setVideoSaving(false); }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    Array.from(e.dataTransfer.files).forEach(uploadFile);
  }, [uploadFile]);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
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
    setSelected(s => s.filter(x => x !== id));
  };

  const deleteSelected = async () => {
    if (!selected.length) return;
    setDeleting(true);
    await Promise.all(selected.map(id =>
      fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      })
    ));
    setUploads(u => u.filter(x => !selected.includes(x.id)));
    setSelected([]);
    setDeleting(false);
  };

  const toggleSelect = (id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const filtered = uploads.filter(f => {
    if (!search) return true;
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.category?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-black text-white text-xl mb-0.5">Media Library</h2>
          <p className="text-gray-500 text-sm">Upload images · Add video URLs · Organise by category</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button onClick={deleteSelected} disabled={deleting}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/15 text-sm font-bold transition-all disabled:opacity-50">
              {deleting ? <Loader2 size={13} className="animate-spin"/> : <Trash2 size={13}/>}
              Delete {selected.length}
            </button>
          )}
          <button onClick={loadUploads} disabled={fetching}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white text-sm transition-all">
            <RefreshCw size={13} className={fetching ? 'animate-spin' : ''}/> Refresh
          </button>
        </div>
      </div>

      {/* Upload type tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.07] w-fit">
        {(['image', 'video'] as const).map(t => (
          <button key={t} onClick={() => setUploadType(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${uploadType === t ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-white'}`}>
            {t === 'image' ? <ImageIcon size={13}/> : <Video size={13}/>}
            {t === 'image' ? 'Image Upload' : 'Video URL'}
          </button>
        ))}
      </div>

      {/* Category selector for upload */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <FolderOpen size={11}/>Category:
        </span>
        {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
          <button key={cat.id} onClick={() => setUploadCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              uploadCategory === cat.id
                ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400'
                : 'border-white/[0.08] text-gray-500 hover:text-white hover:border-white/[0.15]'
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {uploadType === 'image' ? (
          <motion.div key="image" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
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

              {/* Progress bar */}
              {uploadProgress > 0 && (
                <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl overflow-hidden bg-white/[0.05]">
                  <div className="h-full bg-yellow-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }}/>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={36} className="text-yellow-400 animate-spin" />
                  <p className="text-gray-400 text-sm">Uploading to ImgBB… {uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
                    <Upload size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Drop images here or tap to upload</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG, WebP, GIF · Max 24MB · Multiple files OK</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="video" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center gap-2 text-violet-400 mb-1">
              <Link2 size={15}/><span className="text-sm font-bold">Log a Video URL</span>
            </div>
            <p className="text-gray-500 text-xs">Paste an MP4 link (YouTube embed, Vimeo, CDN, or any direct URL). The URL is saved in your library for use across the site.</p>
            <input type="text" placeholder="Video name (optional)"
              value={videoName} onChange={e => setVideoName(e.target.value)}
              className="w-full bg-black/20 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400/30 transition-all"
              style={{ fontSize: 'max(16px,0.875rem)' }}/>
            <div className="flex gap-2">
              <input type="url" placeholder="https://example.com/video.mp4"
                value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveVideoUrl(); }}
                className="flex-1 bg-black/20 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-400/30 transition-all"
                style={{ fontSize: 'max(16px,0.875rem)' }}/>
              <button onClick={saveVideoUrl} disabled={!videoUrl.trim() || videoSaving}
                className="px-5 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg,#9B59FF,#7C3AED)', color: 'white' }}>
                {videoSaving ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>}
                {videoSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
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

      {/* Library filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input type="text" placeholder="Search by name or category…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400/30 transition-all"
            style={{ fontSize: 'max(16px,0.875rem)' }}/>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <Filter size={12} className="text-gray-500 shrink-0"/>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white/[0.04] text-gray-500 hover:text-white'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      {fetching && !uploads.length ? (
        <div className="flex items-center justify-center py-16 text-gray-500 gap-2">
          <Loader2 size={18} className="animate-spin"/> Loading library…
        </div>
      ) : filtered.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-white text-sm">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              {search ? ` matching "${search}"` : activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
            </h3>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} className="text-xs text-gray-500 hover:text-white transition-colors">
                Clear selection
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(f => {
              const isSelected = selected.includes(f.id);
              const isVideo = f.type === 'video';
              return (
                <motion.div key={f.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className={`group relative rounded-xl overflow-hidden border bg-white/[0.02] aspect-square cursor-pointer transition-all ${
                    isSelected ? 'border-yellow-400/60 ring-2 ring-yellow-400/30' : 'border-white/[0.07]'
                  }`}
                  onClick={() => toggleSelect(f.id)}>
                  {/* Thumbnail */}
                  {isVideo ? (
                    <div className="w-full h-full bg-gradient-to-br from-violet-900/40 to-purple-900/20 flex flex-col items-center justify-center gap-2">
                      <Video size={28} className="text-violet-400"/>
                      <p className="text-[10px] text-gray-400 px-2 text-center line-clamp-2">{f.name}</p>
                    </div>
                  ) : (
                    <img src={f.thumb || f.display_url} alt={f.name} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                  )}

                  {/* Selection check */}
                  <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-yellow-400 border-yellow-400'
                      : 'border-white/40 bg-black/40 opacity-0 group-hover:opacity-100'
                  }`}>
                    {isSelected && <Check size={10} className="text-black"/>}
                  </div>

                  {/* Category pill */}
                  {f.category && f.category !== 'general' && (
                    <div className="absolute top-2 right-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/60 text-yellow-400 border border-yellow-400/20 backdrop-blur-sm">
                        {f.category}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-2" onClick={e => e.stopPropagation()}>
                    <p className="text-white text-[10px] font-medium text-center line-clamp-2">{f.name}</p>
                    <button onClick={() => copyUrl(f.url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-all w-full justify-center">
                      {copied === f.url ? <><CheckCircle size={11}/>Copied!</> : <><Copy size={11}/>Copy URL</>}
                    </button>
                    <div className="flex items-center gap-3 mt-0.5">
                      <a href={f.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-white transition-colors">
                        <ExternalLink size={9}/> Open
                      </a>
                      <button onClick={() => deleteUpload(f.id)}
                        className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={9}/> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-600 text-sm">
          {search ? `No results for "${search}"` : 'No uploads yet. Upload your first image above.'}
        </div>
      )}

      {/* Setup note */}
      <div className="rounded-xl border border-yellow-400/15 bg-yellow-400/5 p-4">
        <p className="text-yellow-400 font-bold text-xs mb-2">📸 One-time Setup Required</p>
        <ol className="space-y-1 text-gray-400 text-xs list-decimal list-inside">
          <li>Sign up free at <a href="https://api.imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">api.imgbb.com</a></li>
          <li>Copy your API key</li>
          <li>Add to Vercel env: <code className="bg-black/40 text-yellow-300 px-1 rounded">IMGBB_API_KEY=your_key</code></li>
          <li>Also add <code className="bg-black/40 text-yellow-300 px-1 rounded">DATABASE_URL</code> (NeonDB) to persist the library</li>
        </ol>
      </div>
    </div>
  );
}
