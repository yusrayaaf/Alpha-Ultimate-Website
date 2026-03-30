import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide after fonts + first paint settle
    const t = setTimeout(() => setVisible(false), 1400);
    // Also hide immediately when DOM is fully interactive
    const onLoad = () => setVisible(false);
    window.addEventListener('load', onLoad);
    return () => { clearTimeout(t); window.removeEventListener('load', onLoad); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: '#030307' }}
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#FFD166,#06D6A0)', boxShadow: '0 0 40px rgba(255,209,102,0.4)' }}
            >
              <span className="text-black font-black text-2xl" style={{ fontFamily: 'Urbanist, sans-serif' }}>A</span>
            </motion.div>
            <div className="neon-spinner mx-auto" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
