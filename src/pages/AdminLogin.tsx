import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, LogIn, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#030307' }}>
      {/* Glassmorphic background orbs */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none animate-glow-beat"
        style={{ background: 'rgba(255,209,102,0.08)' }} />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none animate-glow-beat"
        style={{ background: 'rgba(6,214,160,0.06)', animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(155,89,255,0.05)' }} />

      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring' }}
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5 relative glass-gold"
            style={{ boxShadow: '0 0 48px rgba(255,209,102,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            <Shield size={32} className="text-amber-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#030307] animate-pulse" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Admin Access</h1>
          <p className="text-gray-600 text-sm">Alpha Ultimate Dashboard · Secure Login</p>
        </div>

        {/* Glass login card */}
        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  required className="input-field !pl-10" placeholder="admin" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required className="input-field !pl-10 !pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center bg-red-500/10 border border-red-400/20 py-2.5 px-3 rounded-xl">
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? <div className="neon-spinner !w-5 !h-5 !border-2" /> : <LogIn size={15} />}
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 pt-5 border-t border-white/[0.05] flex items-center gap-2 justify-center">
            <Lock size={11} className="text-gray-700" />
            <p className="text-gray-700 text-[10px] tracking-wider uppercase">256-bit encrypted · Admin only</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
