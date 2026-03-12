import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Volume2, VolumeX, Mic, MicOff, Sparkles, User, RotateCcw, Phone } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { useSiteAssets } from '../hooks/useSiteAssets';

interface Msg { role: 'user' | 'assistant'; content: string; id: string; }

// Language detection helpers
function detectLang(text: string): 'ar' | 'bn' | 'en' {
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  return 'en';
}

// TTS voice selector — neutral female voices per language
// Bangla note: most browsers don't ship a bn-BD voice natively.
// Priority: bn-BD → bn-IN → hi-IN female (closest prosody) → en-US female slow
function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const femaleKeywords = ['female','woman','girl','samira','lailah','hoda','fatima',
    'zira','susan','linda','victoria','karen','moira','nora','ava','allison',
    'hazel','tessa','kate','raveena','lekha','heera','kalpana'];

  const isFemale = (v: SpeechSynthesisVoice) =>
    femaleKeywords.some(k => v.name.toLowerCase().includes(k));

  if (lang === 'bn') {
    // 1. Native Bangla female
    const bnFemale = voices.find(v => v.lang.startsWith('bn') && isFemale(v));
    if (bnFemale) return bnFemale;
    // 2. Any Bangla voice
    const bn = voices.find(v => v.lang.startsWith('bn'));
    if (bn) return bn;
    // 3. Hindi female — closest prosody and rhythm to Bangla
    const hiFemale = voices.find(v => v.lang.startsWith('hi') && isFemale(v));
    if (hiFemale) return hiFemale;
    // 4. Any Hindi
    const hi = voices.find(v => v.lang.startsWith('hi'));
    if (hi) return hi;
    // 5. English female slow (last resort — still intelligible for Bangla script via TTS)
    return voices.find(v => v.lang.startsWith('en') && isFemale(v)) || voices[0];
  }

  const langMap: Record<string, string[]> = {
    ar: ['ar-SA', 'ar-EG', 'ar'],
    en: ['en-US', 'en-GB', 'en-AU', 'en'],
  };
  const targets = langMap[lang] || langMap.en;

  for (const t of targets) {
    const v = voices.find(v => v.lang.startsWith(t) && isFemale(v));
    if (v) return v;
  }
  for (const t of targets) {
    const v = voices.find(v => v.lang.startsWith(t));
    if (v) return v;
  }
  return voices.find(isFemale) || voices[0] || null;
}

function speak(text: string, lang: string, onEnd?: () => void) {
  window.speechSynthesis.cancel();
  // Strip markdown for cleaner speech
  const clean = text
    .replace(/\*\*/g, '').replace(/#{1,6}\s/g, '')
    .replace(/\n/g, ' ').replace(/•/g, '').trim();
  const utter = new SpeechSynthesisUtterance(clean);

  // Language + voice tuning per language
  if (lang === 'bn') {
    utter.lang   = 'bn-BD';
    utter.rate   = 0.82;   // slightly slower for clear Bangla
    utter.pitch  = 1.12;   // slightly raised — feminine, warm
    utter.volume = 1;
  } else if (lang === 'ar') {
    utter.lang   = 'ar-SA';
    utter.rate   = 0.88;
    utter.pitch  = 1.05;
    utter.volume = 1;
  } else {
    utter.lang   = 'en-US';
    utter.rate   = 0.92;
    utter.pitch  = 1.05;
    utter.volume = 1;
  }

  // Voices load async — wait for them, then assign
  const assignAndSpeak = () => {
    const voice = getBestVoice(lang);
    if (voice) utter.voice = voice;
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  };

  if (window.speechSynthesis.getVoices().length) {
    assignAndSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => { assignAndSpeak(); };
  }
}

const GREETINGS: Record<string, string> = {
  en: "Hello! I'm **Yusra** ✨ — your dedicated assistant at Alpha Ultimate.\n\nI'm here to help you with:\n• **Service information** and pricing\n• **Booking** a cleaning session\n• **Availability** and scheduling\n• Any **cleaning questions** you have\n\nHow can I assist you today?",
  ar: "أهلاً وسهلاً! أنا **يُسرى** ✨ — مساعدتك الخاصة في ألفا ألتيميت.\n\nأنا هنا لمساعدتك في:\n• **معلومات الخدمات** والأسعار\n• **حجز** جلسة تنظيف\n• **المواعيد** والجدول الزمني\n• أي **أسئلة تنظيف** لديك\n\nكيف يمكنني مساعدتك اليوم؟",
  bn: "স্বাগতম! আমি **ইউসরা** ✨ — আলফা আল্টিমেটের আপনার বিশেষ সহকারী।\n\nআমি আপনাকে সাহায্য করতে এখানে আছি:\n• **সেবা তথ্য** এবং মূল্য\n• **বুকিং** করতে\n• **সময়সূচী** সম্পর্কে\n• যেকোনো **পরিষ্কার প্রশ্নের** উত্তরে\n\nআজ আমি কীভাবে আপনার সাহায্য করতে পারি?",
};

const QUICK_QUESTIONS: Record<string, string[]> = {
  en: ['Service pricing', 'Book a clean', 'What areas do you cover?', 'Eco-safe products?'],
  ar: ['أسعار الخدمات', 'احجز الآن', 'ما هي المناطق؟', 'منتجات آمنة؟'],
  bn: ['সেবার মূল্য', 'বুকিং করুন', 'কোন এলাকায় সেবা?', 'পরিবেশবান্ধব?'],
};

export default function YusraAssistant() {
  const { i18n } = useTranslation();
  const assets = useSiteAssets();
  // Render Yusra avatar: custom icon if uploaded, else gradient with Arabic ي
  const YusraAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
    const cls = size === 'sm'
      ? 'w-7 h-7 rounded-full text-xs'
      : 'w-10 h-10 rounded-2xl text-base';
    return assets.yusra_icon ? (
      <img src={assets.yusra_icon} alt="Yusra"
        className={`${cls} object-cover bg-gradient-to-br from-[#FFD166] to-[#06D6A0] flex-shrink-0`} />
    ) : (
      <div className={`${cls} bg-gradient-to-br from-[#FFD166] to-[#06D6A0] flex items-center justify-center shadow-lg shadow-yellow-400/30 font-black text-[#050508] flex-shrink-0`}
        style={{ fontFamily: 'var(--font-display)' }}>ي</div>
    );
  };
  const uiLang = (i18n.language || 'en').slice(0, 2) as 'en' | 'ar' | 'bn';
  const greeting = GREETINGS[uiLang] || GREETINGS.en;

  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<Msg[]>([{ role: 'assistant', content: greeting, id: 'init' }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [ttsOn, setTtsOn]     = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [msgLang, setMsgLang] = useState<string>(uiLang);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll on new message
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  // Update greeting on lang change
  useEffect(() => {
    setMsgs([{ role: 'assistant', content: GREETINGS[uiLang] || GREETINGS.en, id: 'init' }]);
    setMsgLang(uiLang);
  }, [uiLang]);

  // Voice recognition
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = uiLang === 'ar' ? 'ar-SA' : uiLang === 'bn' ? 'bn-BD' : 'en-US';
    r.continuous = false;
    r.interimResults = false;
    r.onstart  = () => setListening(true);
    r.onend    = () => setListening(false);
    r.onerror  = () => setListening(false);
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInput(t);
      setTimeout(() => sendMsg(t), 200);
    };
    r.start();
    recognitionRef.current = r;
  }, [uiLang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const sendMsg = useCallback(async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    const detectedLang = detectLang(content);
    setMsgLang(detectedLang);
    const userMsg: Msg = { role: 'user', content, id: Date.now().toString() };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/yusra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
          lang: detectedLang,
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || 'I apologize, I encountered an issue. Please call us at +966 57 8695494.';
      const aMsg: Msg = { role: 'assistant', content: reply, id: Date.now().toString() + 'a' };
      setMsgs(h => [...h, aMsg]);
      if (ttsOn) {
        setSpeaking(true);
        speak(reply, detectedLang, () => setSpeaking(false));
      }
    } catch {
      const fallback = uiLang === 'ar'
        ? 'آسف، هناك مشكلة. يرجى الاتصال على +966 57 8695494'
        : uiLang === 'bn'
        ? 'দুঃখিত, সমস্যা হয়েছে। +966 57 8695494 এ কল করুন।'
        : 'Sorry, I\'m having trouble. Please call **+966 57 8695494** or WhatsApp **+966 56 3906822**.';
      setMsgs(h => [...h, { role: 'assistant', content: fallback, id: 'err' }]);
    } finally { setLoading(false); }
  }, [input, loading, msgs, ttsOn, uiLang]);

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } };
  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  const quickQ = QUICK_QUESTIONS[uiLang] || QUICK_QUESTIONS.en;
  const isRTL  = uiLang === 'ar';

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label="Open Yusra AI assistant"
        className="fixed z-50 flex items-center gap-2.5 text-sm font-bold text-[#050508]"
        style={{
          bottom: `calc(1.5rem + env(safe-area-inset-bottom,0px))`,
          right: `calc(1.5rem + env(safe-area-inset-right,0px))`,
          background: 'linear-gradient(135deg,#FFD166,#06D6A0)',
          padding: '0.85rem 1.5rem 0.85rem 1.1rem',
          borderRadius: '9999px',
          boxShadow: '0 0 50px rgba(255,209,102,0.6),0 0 20px rgba(6,214,160,0.3),0 8px 32px rgba(0,0,0,0.5)',
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={open ? {} : { y: [0,-5,0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          {open ? <X size={16} /> : <Sparkles size={16} />}
        </motion.div>
        <span className="font-display">{open ? 'Close' : 'Ask Yusra'}</span>
        {!open && speaking && (
          <span className="flex gap-0.5 items-end h-4">
            {[1,2,3].map(i=><motion.span key={i} className="w-0.5 bg-[#050508] rounded-full" animate={{height:['4px','12px','4px']}} transition={{duration:0.6,repeat:Infinity,delay:i*0.12}} />)}
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, scale:0.88, y:24 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.88, y:24 }}
            transition={{ type:'spring', damping:24, stiffness:300 }}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="fixed z-50 flex flex-col"
            style={{
              bottom: `calc(5.5rem + env(safe-area-inset-bottom,0px))`,
              right: `calc(1.5rem + env(safe-area-inset-right,0px))`,
              width: 'min(400px,calc(100vw - 2rem))',
              height: 'min(580px,calc(100svh - 8.5rem))',
              background: 'rgba(5,5,8,0.97)',
              backdropFilter: 'blur(40px) saturate(200%)',
              border: '1px solid rgba(255,209,102,0.25)',
              borderRadius: '1.75rem',
              overflow: 'hidden',
              boxShadow: '0 32px 90px rgba(0,0,0,0.7),0 0 0 1px rgba(255,209,102,0.08),inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* ── Header ── */}
            <div className="flex-shrink-0 px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-[rgba(255,209,102,0.07)] to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <YusraAvatar size="md" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#050508]" />
                  </div>
                  <div>
                    <div className="font-display font-black text-white text-sm leading-tight">Yusra</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {speaking
                        ? <><span className="flex gap-0.5 items-end h-3">{[1,2,3].map(i=><motion.span key={i} className="w-0.5 bg-green-400 rounded-full" animate={{height:['3px','10px','3px']}} transition={{duration:0.5,repeat:Infinity,delay:i*0.1}} />)}</span><span className="text-[10px] text-green-400">Speaking…</span></>
                        : <><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><span className="text-[10px] text-gray-500">Alpha Ultimate AI · Online</span></>
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* TTS toggle */}
                  <button onClick={() => { setTtsOn(t=>!t); if (speaking) stopSpeaking(); }}
                    title={ttsOn ? 'Mute voice' : 'Enable voice'}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${ttsOn ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-600 hover:text-gray-400'}`}>
                    {ttsOn ? <Volume2 size={14}/> : <VolumeX size={14}/>}
                  </button>
                  {/* Reset */}
                  <button onClick={() => { setMsgs([{role:'assistant',content:greeting,id:'init'}]); stopSpeaking(); }}
                    title="Reset conversation"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-400 transition-all">
                    <RotateCcw size={13}/>
                  </button>
                  {/* Close */}
                  <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-all">
                    <X size={16}/>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {msgs.map((m) => (
                <motion.div key={m.id}
                  initial={{ opacity:0, y:10, scale:0.97 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ duration:0.25 }}
                  className={`flex gap-2.5 ${m.role==='user'?(isRTL?'':'flex-row-reverse'):''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 mt-0.5 ${
                    m.role==='user'
                      ? 'w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center text-xs font-black'
                      : ''
                  }`}>
                    {m.role==='assistant'
                      ? <YusraAvatar size="sm" />
                      : <User size={11}/>
                    }
                  </div>
                  {/* Bubble */}
                  <div className={`max-w-[83%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role==='assistant'
                      ? 'bg-white/[0.04] border border-white/[0.07] text-gray-200 rounded-tl-sm'
                      : 'bg-gradient-to-br from-[#FFD166] to-[#e8b94a] text-[#050508] font-semibold rounded-tr-sm'
                  }`}>
                    {m.role==='assistant'
                      ? <ReactMarkdown
                          className="prose prose-sm prose-invert max-w-none [&_strong]:text-yellow-400 [&_a]:text-yellow-400 [&_ul]:mt-1 [&_ul]:space-y-0.5 [&_li]:marker:text-yellow-400/60"
                          components={{ p: ({children})=><p className="mb-1.5 last:mb-0">{children}</p> }}
                        >{m.content}</ReactMarkdown>
                      : m.content
                    }
                    {/* Speak this message button */}
                    {m.role==='assistant' && ttsOn && (
                      <button onClick={() => { if(speaking){stopSpeaking();}else{setSpeaking(true);speak(m.content,msgLang,()=>setSpeaking(false));} }}
                        className="mt-2 flex items-center gap-1 text-[10px] text-gray-600 hover:text-yellow-400 transition-colors">
                        <Volume2 size={10}/> {speaking ? 'Stop' : 'Play'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quick questions (show after init only) */}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickQ.map((q, i) => (
                    <button key={i} onClick={() => sendMsg(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex gap-2.5">
                  <YusraAvatar size="sm" />
                  <div className="bg-white/[0.04] border border-white/[0.07] px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                    {[0,1,2].map(i=>(
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400/60"
                        animate={{ y:[0,-5,0] }} transition={{ duration:0.5,repeat:Infinity,delay:i*0.12 }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* ── Input Bar ── */}
            <div className="flex-shrink-0 p-4 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-black/20">
              <div className="flex items-center gap-2">
                {/* Mic button */}
                <button
                  onMouseDown={startListening} onMouseUp={stopListening}
                  onTouchStart={startListening} onTouchEnd={stopListening}
                  title="Hold to speak"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    listening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/[0.05] text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10'
                  }`}
                >
                  {listening ? <MicOff size={14}/> : <Mic size={14}/>}
                </button>

                <input
                  type="text" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={uiLang==='ar'?'اكتب رسالتك…':uiLang==='bn'?'আপনার বার্তা লিখুন…':'Type your message…'}
                  dir={isRTL?'rtl':'ltr'}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400/40 focus:bg-yellow-400/[0.02] transition-all"
                  style={{ fontSize:'max(16px,0.875rem)' }}
                />

                <button onClick={() => sendMsg()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background:'linear-gradient(135deg,#FFD166,#06D6A0)', boxShadow:'0 0 20px rgba(255,209,102,0.3)' }}>
                  <Send size={15} className="text-[#050508]"/>
                </button>
              </div>

              {/* WhatsApp quick link */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Phone size={10} className="text-gray-700"/>
                <a href="https://wa.me/966563906822" target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-gray-700 hover:text-green-400 transition-colors">
                  Prefer WhatsApp? +966 56 3906822
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
