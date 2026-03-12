import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2,
  LayoutDashboard, Image, FileText, LogOut, Bot, Loader2,
  Calendar, Users, DollarSign, CheckCircle,
  Clock, BarChart2, Star, Settings, Menu, X,
  Bell, Eye, Phone, MapPin, Activity, Shield, Zap,
  Edit3, Plus, Download, ArrowUpRight, ArrowDownRight,
  Sparkles, Search, Trash2, ChevronDown, ChevronRight,
  RefreshCw, Send, MessageSquare, Volume2, Globe,
  Camera, AlertCircle, TrendingUp, Package, Filter,
  Save, Upload, Copy, ExternalLink, Check, MoreVertical,
  Mic, MicOff, VolumeX, RotateCcw, User
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import ContentEditor from '../components/ContentEditor';

type TabId = 'overview' | 'bookings' | 'analytics' | 'media' | 'content' | 'yusra' | 'settings';

interface Booking {
  id: string; name: string; service: string; date: string; time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: string; phone: string; address: string; notes?: string;
}

// ── Mock Data ─────────────────────────────────────────────────────
const MOCK_BOOKINGS: Booking[] = [
  { id:'ALF-001', name:'Mohammed Al-Rashidi',  service:'Full Home Deep Clean',  date:'2025-03-10', time:'09:00', status:'confirmed',  amount:'SAR 650', phone:'+966 55 123 4567', address:'Al Malqa, Riyadh',          notes:'3-bedroom villa, has cats' },
  { id:'ALF-002', name:'Fatima Al-Zahrani',    service:'Post-Construction',      date:'2025-03-10', time:'14:00', status:'pending',    amount:'SAR 900', phone:'+966 50 987 6543', address:'Al Olaya, Riyadh',          notes:'New apartment, 2nd floor' },
  { id:'ALF-003', name:'Abdullah Hassan',      service:'Move-In / Move-Out',     date:'2025-03-11', time:'10:00', status:'completed',  amount:'SAR 750', phone:'+966 54 456 7890', address:'Al Nakheel, Riyadh',        notes:'' },
  { id:'ALF-004', name:'Sara Al-Mutairi',      service:'Full Home Deep Clean',   date:'2025-03-11', time:'13:00', status:'confirmed',  amount:'SAR 500', phone:'+966 56 321 0987', address:'Al Yarmouk, Riyadh',       notes:'Monthly recurring' },
  { id:'ALF-005', name:'Khalid Al-Dawsari',   service:'Post-Construction',      date:'2025-03-12', time:'08:00', status:'pending',    amount:'SAR 1200',phone:'+966 58 654 3210', address:'Diplomatic Quarter, Riyadh', notes:'Large villa, 5 rooms' },
  { id:'ALF-006', name:'Nora Al-Harbi',        service:'Move-In / Move-Out',     date:'2025-03-12', time:'11:00', status:'cancelled',  amount:'SAR 600', phone:'+966 59 789 0123', address:'Al Hamra, Riyadh',         notes:'' },
  { id:'ALF-007', name:'Omar Al-Shammari',     service:'Full Home Deep Clean',   date:'2025-03-13', time:'09:30', status:'confirmed',  amount:'SAR 480', phone:'+966 55 234 5678', address:'King Fahd District, Riyadh',notes:'' },
  { id:'ALF-008', name:'Reem Al-Qahtani',      service:'Post-Construction',      date:'2025-03-14', time:'10:00', status:'pending',    amount:'SAR 1050',phone:'+966 50 876 5432', address:'Al Wadi, Riyadh',           notes:'Commercial space' },
  { id:'ALF-009', name:'Ahmed Al-Dossari',     service:'Kitchen Deep Clean',     date:'2025-03-14', time:'15:00', status:'confirmed',  amount:'SAR 180', phone:'+966 54 111 2222', address:'Al Muruj, Riyadh',          notes:'' },
  { id:'ALF-010', name:'Lina Al-Otaibi',       service:'Sofa & Upholstery',      date:'2025-03-15', time:'11:00', status:'pending',    amount:'SAR 220', phone:'+966 56 333 4444', address:'Al Rabwah, Riyadh',         notes:'3 sofas + 2 chairs' },
];

const WEEK_DATA = [
  { day:'Sat', bookings:5,  revenue:3200 },
  { day:'Sun', bookings:8,  revenue:5800 },
  { day:'Mon', bookings:6,  revenue:4100 },
  { day:'Tue', bookings:9,  revenue:6500 },
  { day:'Wed', bookings:4,  revenue:2900 },
  { day:'Thu', bookings:11, revenue:7800 },
  { day:'Fri', bookings:3,  revenue:2100 },
];

const MONTH_DATA = [
  { month:'Oct', revenue:38000 }, { month:'Nov', revenue:42000 },
  { month:'Dec', revenue:55000 }, { month:'Jan', revenue:48000 },
  { month:'Feb', revenue:61000 }, { month:'Mar', revenue:48250 },
];

const SERVICE_DIST = [
  { label:'Full Home Deep Clean',  pct:38, color:'#FFD166', count:33 },
  { label:'Post-Construction',     pct:27, color:'#06D6A0', count:23 },
  { label:'Move-In / Move-Out',    pct:20, color:'#9B59FF', count:17 },
  { label:'Kitchen Deep Clean',    pct:9,  color:'#FF6B6B', count:8  },
  { label:'Sofa & Upholstery',     pct:6,  color:'#C8F4FF', count:5  },
];

const REVIEWS = [
  { name:'Mohammed R.',   rating:5, text:'Absolutely spotless! Team was professional and on time.', date:'Mar 8' },
  { name:'Fatima Z.',     rating:5, text:'Amazing service. Will definitely book again next month.',   date:'Mar 7' },
  { name:'Sara M.',       rating:4, text:'Very good work. Minor missed spot in bathroom corner.',     date:'Mar 5' },
  { name:'Khalid D.',     rating:5, text:'Post-construction clean was exceptional. Highly recommend.', date:'Mar 4' },
];

// ── Helpers ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Booking['status'] }) {
  const cfg = {
    pending:   { cls:'bg-amber-400/10 text-amber-400 border-amber-400/20',  label:'Pending'   },
    confirmed: { cls:'bg-teal-400/10 text-teal-400 border-teal-400/20',     label:'Confirmed' },
    completed: { cls:'bg-emerald-400/10 text-emerald-400 border-emerald-400/20', label:'Completed' },
    cancelled: { cls:'bg-red-400/10 text-red-400 border-red-400/20',        label:'Cancelled' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"/>
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, change, positive, icon: Icon, color, sub }:
  { label:string; value:string; change:string; positive:boolean; icon:any; color:string; sub?:string }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      className="relative overflow-hidden rounded-2xl p-5 border border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12] transition-all group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
        style={{ background:`radial-gradient(circle,${color}20,transparent)`, filter:'blur(20px)' }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background:`${color}15` }}>
          <Icon size={20} style={{ color }}/>
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${positive?'text-emerald-400 bg-emerald-400/10':'text-red-400 bg-red-400/10'}`}>
          {positive?<ArrowUpRight size={11}/>:<ArrowDownRight size={11}/>}{change}
        </span>
      </div>
      <div className="text-2xl font-black text-white mb-0.5 font-display">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </motion.div>
  );
}

// ── Admin AI Chat (Yusra) ─────────────────────────────────────────
interface AMsg { role:'user'|'assistant'; content:string; id:string; }
function YusraAdminPanel() {
  const [msgs, setMsgs] = useState<AMsg[]>([{
    role:'assistant',
    content:"**مرحباً!** I'm Yusra — your admin AI assistant.\n\nI can help you with:\n• **Booking insights** and reporting\n• **Content suggestions** for the website\n• **Client communication** drafts\n• **Business analytics** questions\n• Any operational questions\n\nWhat do you need?",
    id:'init'
  }]);
  const [input,setInput] = useState('');
  const [loading,setLoading]=useState(false);
  const [ttsOn,setTtsOn]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs]);

  const send=useCallback(async()=>{
    if(!input.trim()||loading)return;
    const userMsg:AMsg={role:'user',content:input.trim(),id:Date.now()+'u'};
    const hist=[...msgs,userMsg];
    setMsgs(hist); setInput(''); setLoading(true);
    try{
      const res=await fetch('/api/yusra',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          messages:hist.map(m=>({role:m.role,content:m.content})),
          lang:'en',
        }),
      });
      const d=await res.json();
      const reply=d.reply||d.error||'Unable to respond. Check your API configuration.';
      const aMsg:AMsg={role:'assistant',content:reply,id:Date.now()+'a'};
      setMsgs(h=>[...h,aMsg]);
      if(ttsOn){setSpeaking(true);window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(reply.replace(/\*\*/g,'').replace(/•/g,''));u.lang='en-US';u.onend=()=>setSpeaking(false);window.speechSynthesis.speak(u);}
    }catch{
      setMsgs(h=>[...h,{role:'assistant',content:'API error. Make sure `ANTHROPIC_API_KEY` is set in your Vercel environment.',id:'err'}]);
    }finally{setLoading(false);}
  },[input,loading,msgs,ttsOn]);

  const QUICK=['Summarize today\'s bookings','Draft a promo message','Top service this week','Suggest a follow-up for cancelled bookings'];

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[500px] flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-yellow-400/8 to-transparent flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD166] to-[#06D6A0] flex items-center justify-center shadow-lg shadow-yellow-400/30 text-sm font-black text-[#050508]" style={{fontFamily:'var(--font-display)'}}>ي</div>
          <div>
            <div className="font-display font-black text-white text-sm">Yusra — Admin AI</div>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/><span className="text-[10px] text-gray-500">Powered by Claude AI · Secure</span></div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={()=>setTtsOn(t=>!t)} title="Toggle voice" className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${ttsOn?'text-yellow-400 bg-yellow-400/10':'text-gray-600 hover:text-gray-400'}`}>{ttsOn?<Volume2 size={14}/>:<VolumeX size={14}/>}</button>
          <button onClick={()=>{setMsgs([{role:'assistant',content:"**مرحباً!** I'm Yusra — your admin AI assistant.\n\nHow can I help you today?",id:'init'}]);window.speechSynthesis.cancel();setSpeaking(false);}} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-400 transition-all"><RotateCcw size={13}/></button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {msgs.map(m=>(
          <motion.div key={m.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={`flex gap-2.5 ${m.role==='user'?'flex-row-reverse':''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black ${m.role==='assistant'?'bg-gradient-to-br from-[#FFD166] to-[#06D6A0] text-[#050508]':'bg-gradient-to-br from-violet-600 to-purple-700 text-white'}`}>
              {m.role==='assistant'?'ي':<User size={11}/>}
            </div>
            <div className={`max-w-[83%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role==='assistant'?'bg-white/[0.04] border border-white/[0.07] text-gray-200 rounded-tl-sm':'bg-gradient-to-br from-[#FFD166] to-[#e8b94a] text-[#050508] font-semibold rounded-tr-sm'}`}>
              {m.role==='assistant'
                ?<div className="prose prose-sm prose-invert max-w-none [&_strong]:text-yellow-400 [&_ul]:mt-1 [&_li]:marker:text-yellow-400/60" dangerouslySetInnerHTML={{__html:m.content.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>')}}/>
                :m.content}
            </div>
          </motion.div>
        ))}
        {msgs.length===1&&(
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK.map((q,i)=><button key={i} onClick={()=>{setInput(q);setTimeout(()=>send(),100);}} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all">{q}</button>)}
          </div>
        )}
        {loading&&(
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD166] to-[#06D6A0] flex items-center justify-center flex-shrink-0 text-xs font-black text-[#050508]">ي</div>
            <div className="bg-white/[0.04] border border-white/[0.07] px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
              {[0,1,2].map(i=><motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" animate={{y:[0,-5,0]}} transition={{duration:0.5,repeat:Infinity,delay:i*0.12}}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-white/[0.06]">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Ask Yusra anything about your business…"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-400/40 transition-all"
            style={{fontSize:'max(16px,0.875rem)'}}/>
          <button onClick={send} disabled={!input.trim()||loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
            style={{background:'linear-gradient(135deg,#FFD166,#06D6A0)'}}>
            <Send size={15} className="text-[#050508]"/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────
function OverviewTab({ setActiveTab }: { setActiveTab:(t:TabId)=>void }) {
  const pending = MOCK_BOOKINGS.filter(b=>b.status==='pending');
  const maxRev  = Math.max(...WEEK_DATA.map(d=>d.revenue));
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Revenue (Month)"  value="SAR 48,250" change="+18.4%" positive icon={DollarSign} color="#FFD166" sub="vs SAR 40,750 last month"/>
        <StatCard label="Bookings (Month)" value="87"          change="+12.7%" positive icon={Calendar}   color="#06D6A0" sub="3 pending right now"/>
        <StatCard label="Active Clients"   value="214"         change="+5.2%"  positive icon={Users}      color="#9B59FF" sub="28 new this month"/>
        <StatCard label="Avg. Rating"      value="4.93 ★"      change="+0.08"  positive icon={Star}       color="#FFD166" sub="From 312 reviews"/>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Weekly revenue bar chart */}
        <div className="xl:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="font-display font-bold text-white text-base">Weekly Revenue</h3>
              <p className="text-gray-500 text-xs mt-0.5">Last 7 days · SAR 32,400 total</p>
            </div>
            <span className="text-xs text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3 py-1 rounded-full font-bold">↑ 18.4% vs last week</span>
          </div>
          <div className="flex items-end gap-2 h-36">
            {WEEK_DATA.map((d,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full" style={{height:'120px'}}>
                  <motion.div
                    initial={{height:0}} animate={{height:`${(d.revenue/maxRev)*100}%`}}
                    transition={{duration:0.6,delay:i*0.08,ease:[.34,1.56,.64,1]}}
                    className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-yellow-600/80 to-yellow-400 hover:to-yellow-300 transition-all cursor-pointer"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-yellow-400 text-[10px] px-2 py-1 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-10 border border-yellow-400/20">
                    SAR {d.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service distribution */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <h3 className="font-display font-bold text-white text-base mb-1">Service Split</h3>
          <p className="text-gray-500 text-xs mb-5">This month · 87 total</p>
          <div className="space-y-3.5">
            {SERVICE_DIST.map((s,i)=>(
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400 truncate pr-2">{s.label}</span>
                  <span className="font-bold text-white shrink-0">{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{width:0}} animate={{width:`${s.pct}%`}} transition={{duration:0.7,delay:i*0.1}}
                    className="h-full rounded-full" style={{background:s.color}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly revenue trend */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="font-display font-bold text-white text-base">6-Month Revenue Trend</h3>
            <p className="text-gray-500 text-xs mt-0.5">Oct 2024 – Mar 2025</p>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full font-bold">↑ 27% overall growth</span>
        </div>
        <div className="flex items-end gap-3 h-28">
          {MONTH_DATA.map((d,i)=>{
            const maxR=Math.max(...MONTH_DATA.map(m=>m.revenue));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="relative w-full" style={{height:'90px'}}>
                  <motion.div
                    initial={{height:0}} animate={{height:`${(d.revenue/maxR)*100}%`}}
                    transition={{duration:0.6,delay:i*0.1,ease:[.34,1.56,.64,1]}}
                    className="absolute bottom-0 w-full rounded-t-lg cursor-pointer transition-all"
                    style={{background:`linear-gradient(to top,rgba(6,214,160,0.6),rgba(6,214,160,0.9))`}}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-teal-400 text-[10px] px-2 py-1 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 border border-teal-400/20">
                    SAR {(d.revenue/1000).toFixed(0)}K
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom grid: Pending + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending bookings */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-amber-400/10 rounded-xl flex items-center justify-center"><Clock size={15} className="text-amber-400"/></div>
              <div><h3 className="font-display font-bold text-white text-sm">Pending Bookings</h3><p className="text-[11px] text-gray-500">{pending.length} need attention</p></div>
            </div>
            <button onClick={()=>setActiveTab('bookings')} className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors font-medium">
              All <ChevronRight size={13}/>
            </button>
          </div>
          <div className="space-y-2.5">
            {pending.slice(0,4).map(b=>(
              <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05] hover:border-amber-400/20 transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0"><span className="text-yellow-400 font-black text-xs">{b.name[0]}</span></div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-xs truncate">{b.name}</p>
                    <p className="text-gray-500 text-[10px] truncate">{b.service} · {b.date} {b.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-white font-bold text-xs">{b.amount}</span>
                  <StatusBadge status={b.status}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reviews */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-yellow-400/10 rounded-xl flex items-center justify-center"><Star size={15} className="text-yellow-400"/></div>
            <div><h3 className="font-display font-bold text-white text-sm">Recent Reviews</h3><p className="text-[11px] text-gray-500">4.93 avg from 312 reviews</p></div>
          </div>
          <div className="space-y-2.5">
            {REVIEWS.map((r,i)=>(
              <div key={i} className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-xs font-bold">{r.name}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_,j)=><Star key={j} size={9} className="fill-yellow-400 text-yellow-400"/>)}
                    <span className="text-[10px] text-gray-600 ml-1">{r.date}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Manage Bookings', icon:Calendar, tab:'bookings' as TabId, color:'#FFD166' },
          { label:'Edit Content',   icon:Edit3,    tab:'content'  as TabId, color:'#06D6A0' },
          { label:'Upload Media',   icon:Camera,   tab:'media'    as TabId, color:'#9B59FF' },
          { label:'Ask Yusra AI',   icon:Bot,      tab:'yusra'    as TabId, color:'#FF6B6B' },
        ].map((a,i)=>(
          <button key={i} onClick={()=>setActiveTab(a.tab)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-yellow-400/20 hover:bg-white/[0.04] transition-all group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{background:`${a.color}15`}}>
              <a.icon size={18} style={{color:a.color}}/>
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium text-center">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Bookings Tab ─────────────────────────────────────────────────

// ── Bookings Tab (REAL DATA from NeonDB) ─────────────────────────
function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [dbNote, setDbNote]     = useState('');
  const [filter, setFilter]     = useState<'all'|Booking['status']>('all');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<Booking|null>(null);
  const [updating, setUpdating] = useState<string|null>(null);
  const token = localStorage.getItem('admin_token') || '';

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
      if (data.note) setDbNote(data.note);
    } catch { setDbNote('Failed to load bookings. Check your connection.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadBookings(); }, []);

  const updateStatus = async (id: string, status: Booking['status']) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
        if (selected?.id === id) setSelected(s => s ? { ...s, status } : s);
      }
    } catch { /* silent */ }
    finally { setUpdating(null); }
  };

  const filtered = bookings.filter(b => {
    const mf = filter === 'all' || b.status === filter;
    const q  = search.toLowerCase();
    const ms = !q || b.name.toLowerCase().includes(q) || b.service.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    return mf && ms;
  });

  const counts: Record<string, number> = { all: bookings.length };
  for (const s of ['pending','confirmed','completed','cancelled']) {
    counts[s] = bookings.filter(b => b.status === s).length;
  }

  return (
    <div className="space-y-5">
      {/* DB note */}
      {dbNote && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-400/8 border border-yellow-400/20 text-yellow-400 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0"/>
          <span>{dbNote}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input type="text" placeholder="Search by name, service, ID…" value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-yellow-400/30 transition-all"
            style={{fontSize:'max(16px,0.875rem)'}}/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all','pending','confirmed','completed','cancelled'] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filter===f?'bg-yellow-400 text-black':'bg-white/[0.03] border border-white/[0.07] text-gray-400 hover:border-yellow-400/20'}`}>
              {f[0].toUpperCase()+f.slice(1)} ({counts[f]??0})
            </button>
          ))}
        </div>
        <button onClick={loadBookings}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-white/[0.07] text-gray-400 hover:text-white transition-all bg-white/[0.02]">
          <RefreshCw size={13}/> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
              <Loader2 size={18} className="animate-spin text-yellow-400"/> Loading bookings…
            </div>
          ) : (
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['ID','Client','Service','Date & Time','Status','Actions'].map(h=>(
                  <th key={h} className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length===0?(
                <tr><td colSpan={6} className="text-center py-14 text-gray-500 text-sm">
                  {bookings.length === 0 ? 'No bookings yet. Bookings submitted through the website will appear here.' : 'No bookings match your search.'}
                </td></tr>
              ):filtered.map(b=>(
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4 text-xs font-mono text-yellow-400/80">{b.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
                        <span className="text-yellow-400 font-black text-xs">{b.name?.[0]}</span>
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium whitespace-nowrap">{b.name}</div>
                        <div className="text-[10px] text-gray-600">{b.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap max-w-[160px] truncate">{b.service}</td>
                  <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                    {b.date}<br/><span className="text-gray-600">{b.time}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={b.status}/></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={()=>setSelected(b)}
                        className="text-[10px] text-yellow-400 hover:text-yellow-300 px-2 py-1 rounded-lg bg-yellow-400/10 transition-all flex items-center gap-1">
                        <Eye size={11}/>View
                      </button>
                      {b.status==='pending'&&(
                        <button onClick={()=>updateStatus(b.id,'confirmed')} disabled={updating===b.id}
                          className="text-[10px] text-teal-400 hover:text-teal-300 px-2 py-1 rounded-lg bg-teal-400/10 transition-all flex items-center gap-1 disabled:opacity-50">
                          {updating===b.id?<Loader2 size={11} className="animate-spin"/>:<Check size={11}/>}Confirm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selected&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={()=>setSelected(null)}>
            <motion.div initial={{scale:0.93,y:20}} animate={{scale:1,y:0}} exit={{scale:0.93,y:20}}
              onClick={e=>e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0c0c14] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-gradient-to-r from-yellow-400/8 to-transparent">
                <div>
                  <div className="font-display font-black text-white">{selected.id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{selected.service}</div>
                </div>
                <button onClick={()=>setSelected(null)} className="text-gray-600 hover:text-white transition-colors"><X size={18}/></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  {icon:User,    label:'Client',   value:selected.name},
                  {icon:Phone,   label:'Phone',    value:selected.phone},
                  ...(selected.email ? [{icon:Bell, label:'Email', value:selected.email}] : []),
                  {icon:MapPin,  label:'Address',  value:selected.address||'—'},
                  {icon:Calendar,label:'Date',     value:`${selected.date}${selected.time?` at ${selected.time}`:''}`},
                ].map(({icon:Icon,label,value},i)=>(
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-yellow-400/8 flex items-center justify-center shrink-0 mt-0.5"><Icon size={14} className="text-yellow-400"/></div>
                    <div><div className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</div><div className="text-sm text-white font-medium mt-0.5">{value}</div></div>
                  </div>
                ))}
                {selected.notes&&<div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-gray-400"><span className="text-gray-600">Notes: </span>{selected.notes}</div>}
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Update Status</div>
                  <div className="flex gap-2 flex-wrap">
                    {(['pending','confirmed','completed','cancelled'] as const).map(s=>(
                      <button key={s} onClick={()=>updateStatus(selected.id,s)} disabled={updating===selected.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${selected.status===s?'bg-yellow-400 text-black':'bg-white/[0.04] text-gray-400 hover:bg-white/[0.07] border border-white/[0.07]'}`}>
                        {s[0].toUpperCase()+s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2.5 pt-2">
                  <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-400/10 text-teal-400 text-sm font-bold hover:bg-teal-400/20 transition-all border border-teal-400/20">
                    <Phone size={14}/> Call
                  </a>
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-400/10 text-green-400 text-sm font-bold hover:bg-green-400/20 transition-all border border-green-400/20">
                    <MessageSquare size={14}/> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Analytics Tab ────────────────────────────────────────────────
function AnalyticsTab({ bookings }: { bookings: Booking[] }) {
  const total    = bookings.length;
  const confirmed= bookings.filter(b=>b.status==='confirmed'||b.status==='completed').length;
  const cancelled= bookings.filter(b=>b.status==='cancelled').length;
  const convRate = total > 0 ? ((confirmed/total)*100).toFixed(1) : '0';
  const cancelRate = total > 0 ? ((cancelled/total)*100).toFixed(1) : '0';

  const serviceCounts: Record<string,number> = {};
  for (const b of bookings) serviceCounts[b.service] = (serviceCounts[b.service]||0)+1;
  const topServices = Object.entries(serviceCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const COLORS = ['#FFD166','#06D6A0','#9B59FF','#FF6B6B','#C8F4FF'];

  const TRAFFIC = [
    { source:'WhatsApp',      visits:342, pct:48, color:'#25D366' },
    { source:'Google Search', visits:201, pct:28, color:'#4285F4' },
    { source:'Direct / URL',  visits:108, pct:15, color:'#FFD166' },
    { source:'Social Media',  visits:64,  pct:9,  color:'#9B59FF' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Bookings"    value={String(total)}       change={total>0?'+'+total:'0'} positive icon={Calendar}    color="#FFD166"/>
        <StatCard label="Confirmed"         value={String(confirmed)}   change={confirmed>0?'+'+confirmed:'0'} positive icon={CheckCircle} color="#06D6A0"/>
        <StatCard label="Conversion Rate"   value={convRate+'%'}        change={convRate+'%'} positive={parseFloat(convRate)>50} icon={TrendingUp}  color="#9B59FF"/>
        <StatCard label="Cancellation Rate" value={cancelRate+'%'}      change={cancelRate+'%'} positive={parseFloat(cancelRate)<10} icon={AlertCircle} color="#FF6B6B"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-yellow-400/10 flex items-center justify-center"><Package size={15} className="text-yellow-400"/></div>
            <div><h3 className="font-display font-bold text-white text-sm">Top Services</h3>
            <p className="text-gray-500 text-xs">By booking count</p></div>
          </div>
          {topServices.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No bookings yet</p>
          ) : topServices.map(([name,count],i)=>(
            <div key={i} className="mb-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300 font-medium truncate pr-2">{name}</span>
                <span className="font-bold text-white shrink-0">{count} bookings</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{width:0}} animate={{width:`${(count/Math.max(...topServices.map(s=>s[1])))*100}%`}}
                  transition={{duration:0.7,delay:i*0.1}} className="h-full rounded-full" style={{background:COLORS[i]}}/>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-violet-400/10 flex items-center justify-center"><Globe size={15} className="text-violet-400"/></div>
            <div><h3 className="font-display font-bold text-white text-sm">Traffic Sources</h3>
            <p className="text-gray-500 text-xs">How clients find you</p></div>
          </div>
          {TRAFFIC.map((t,i)=>(
            <div key={i} className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300 font-medium">{t.source}</span>
                <span className="font-bold text-white">{t.pct}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{width:0}} animate={{width:`${t.pct}%`}} transition={{duration:0.7,delay:i*0.1}}
                  className="h-full rounded-full" style={{background:t.color}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Settings Tab (REAL — saves to NeonDB) ────────────────────────
function SettingsTab() {
  const [form, setForm] = useState({
    businessName:'Elevate Builders Ltd',
    phone1:'+966 57 8695494', phone2:'+966 56 3906822',
    email:'info@alpha-01.com', whatsapp:'+966 56 3906822',
    address:'Riyadh, Saudi Arabia',
    metaTitle:'Elevate Builders Ltd — Construction Services Riyadh',
    metaDesc:"Riyadh's #1 premium cleaning service. Deep clean, move-in/out, post-construction. Book online 24/7.",
    bookingNotif:'true', reviewReminder:'true', whatsappNotif:'true', emailNotif:'false',
    currency:'SAR', language:'en', timezone:'Asia/Riyadh',
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('admin_token') || '';

  useEffect(() => {
    fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setForm(f => ({ ...f, ...data })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (res.ok && d.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else { setError(d.error || 'Save failed. Check DATABASE_URL in Vercel env vars.'); }
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
      <Loader2 size={20} className="animate-spin text-yellow-400"/> Loading settings…
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-400/8 border border-red-400/20 text-red-400 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0"/>
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h3 className="font-display font-bold text-white text-base mb-5 flex items-center gap-2"><Shield size={16} className="text-yellow-400"/>Business Information</h3>
        <div className="space-y-4">
          {[
            {label:'Business Name', key:'businessName'},
            {label:'Primary Phone', key:'phone1'},
            {label:'Secondary Phone', key:'phone2'},
            {label:'Email Address', key:'email'},
            {label:'WhatsApp Number', key:'whatsapp'},
            {label:'Address', key:'address'},
          ].map(({label,key})=>(
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{label}</label>
              <input value={(form as any)[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-400/30 transition-all"
                style={{fontSize:'max(16px,0.875rem)'}}/>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h3 className="font-display font-bold text-white text-base mb-5 flex items-center gap-2"><Globe size={16} className="text-teal-400"/>SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Meta Title</label>
            <input value={form.metaTitle} onChange={e=>setForm(f=>({...f,metaTitle:e.target.value}))}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-400/30 transition-all"
              style={{fontSize:'max(16px,0.875rem)'}}/>
            <p className="text-[10px] text-gray-600 mt-1">{form.metaTitle.length}/60 characters</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Meta Description</label>
            <textarea value={form.metaDesc} onChange={e=>setForm(f=>({...f,metaDesc:e.target.value}))} rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-400/30 transition-all resize-none"
              style={{fontSize:'max(16px,0.875rem)'}}/>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h3 className="font-display font-bold text-white text-base mb-5 flex items-center gap-2"><Bell size={16} className="text-violet-400"/>Notifications</h3>
        <div className="space-y-3">
          {[
            {label:'New Booking Alerts',     sub:'Notified when a new booking arrives',    key:'bookingNotif'},
            {label:'Review Reminders',       sub:'Send review requests after completion',  key:'reviewReminder'},
            {label:'WhatsApp Notifications', sub:'Receive alerts via WhatsApp',            key:'whatsappNotif'},
            {label:'Email Notifications',    sub:'Receive alerts via email',               key:'emailNotif'},
          ].map(({label,sub,key})=>(
            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.025] border border-white/[0.05]">
              <div><div className="text-sm font-medium text-white">{label}</div><div className="text-[11px] text-gray-500 mt-0.5">{sub}</div></div>
              <button onClick={()=>setForm(f=>({...f,[key]:(f as any)[key]==='true'?'false':'true'}))}
                className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${(form as any)[key]==='true'?'bg-yellow-400':'bg-white/10'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${(form as any)[key]==='true'?'right-0.5':'left-0.5'}`}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h3 className="font-display font-bold text-white text-base mb-5 flex items-center gap-2"><Settings size={16} className="text-teal-400"/>Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {label:'Currency', key:'currency', opts:['SAR','USD','EUR']},
            {label:'Default Language', key:'language', opts:['en','ar','bn']},
            {label:'Timezone', key:'timezone', opts:['Asia/Riyadh','UTC','Europe/London']},
          ].map(({label,key,opts})=>(
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{label}</label>
              <select value={(form as any)[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-400/30 transition-all">
                {opts.map(o=><option key={o} value={o} className="bg-[#0c0c14]">{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 hover:opacity-90"
        style={{background:'linear-gradient(135deg,#FFD166,#06D6A0)',color:'#050508',boxShadow:saved?'0 0 40px rgba(6,214,160,0.4)':undefined}}>
        {saving?<Loader2 size={15} className="animate-spin"/>:saved?<Check size={15}/>:<Save size={15}/>}
        {saving?'Saving…':saved?'Saved to NeonDB ✅':'Save Settings'}
      </button>
    </div>
  );
}
// ── Assets Manager ────────────────────────────────────────────────
import { useSiteAssets, invalidateAssets } from '../hooks/useSiteAssets';

function AssetsManager() {
  const token = localStorage.getItem('admin_token') || '';
  const assets = useSiteAssets();
  const [uploading, setUploading] = useState<string|null>(null);
  const [saved, setSaved]         = useState<string|null>(null);
  const [error, setError]         = useState('');

  const SLOTS = [
    { key: 'logo',       label: 'Website Logo',         hint: 'PNG/SVG with transparency · shown in header & footer', accept: 'image/*', w: 'w-16', h: 'h-16', circle: false },
    { key: 'yusra_icon', label: 'Yusra AI Icon',         hint: 'Square image · shown in chat avatar (recommended 200×200)', accept: 'image/*', w: 'w-16', h: 'h-16', circle: true  },
    { key: 'favicon',    label: 'Favicon',               hint: '32×32 or 64×64 ICO/PNG', accept: 'image/*', w: 'w-10', h: 'h-10', circle: false },
    { key: 'hero_video', label: 'Hero Background Video', hint: 'MP4 · max ~50MB — upload via ImgBB first, paste URL below', accept: null, w: '', h: '', circle: false },
  ] as const;

  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => { const r = new FileReader(); r.onload=()=>res((r.result as string).split(',')[1]); r.onerror=rej; r.readAsDataURL(file); });

  const uploadAndSave = async (key: string, file: File) => {
    setUploading(key); setError('');
    try {
      // Upload to ImgBB
      const base64 = await toBase64(file);
      const upRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image: base64, name: key, type: 'asset' }),
      });
      const upData = await upRes.json();
      if (!upData.success || !upData.url) throw new Error(upData.error || 'Upload failed');
      // Save URL to assets
      const saveRes = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [key]: upData.url }),
      });
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.error || 'Save failed');
      invalidateAssets();
      setSaved(key); setTimeout(() => setSaved(null), 3000);
    } catch(e: any) { setError(e.message); }
    finally { setUploading(null); }
  };

  const saveVideoUrl = async (url: string) => {
    setUploading('hero_video'); setError('');
    try {
      const res = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ hero_video: url }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error || 'Save failed');
      invalidateAssets();
      setSaved('hero_video'); setTimeout(() => setSaved(null), 3000);
    } catch(e: any) { setError(e.message); }
    finally { setUploading(null); }
  };

  const [videoUrl, setVideoUrl] = useState('');

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5">
      <div>
        <h2 className="font-display font-black text-white text-lg mb-1">Site Assets</h2>
        <p className="text-gray-500 text-sm">Upload logo, Yusra icon, hero video and favicon. Changes go live immediately site-wide.</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-400/8 border border-red-400/20 text-red-400 text-sm">
          <AlertCircle size={14} className="mt-0.5 shrink-0"/>{error}
          <button onClick={()=>setError('')} className="ml-auto"><X size={13}/></button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SLOTS.map(slot => {
          const currentUrl: string = (assets as any)[slot.key] || '';
          const isLoading = uploading === slot.key;
          const isDone    = saved === slot.key;

          if (slot.key === 'hero_video') return (
            <div key={slot.key} className="sm:col-span-2 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
              <div>
                <div className="text-sm font-bold text-white mb-0.5">{slot.label}</div>
                <div className="text-xs text-gray-500">{slot.hint}</div>
              </div>
              {currentUrl && (
                <video src={currentUrl} className="w-full max-h-32 object-cover rounded-lg border border-white/[0.07]" muted playsInline/>
              )}
              <div className="text-xs text-gray-500 mb-1">Current: <span className="text-gray-400 break-all">{currentUrl || 'using default /assets/hero-video.mp4'}</span></div>
              <div className="flex gap-2">
                <input type="url" placeholder="Paste MP4 URL (e.g. from ImgBB or CDN)…"
                  value={videoUrl} onChange={e=>setVideoUrl(e.target.value)}
                  className="flex-1 bg-black/20 border border-white/[0.07] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-yellow-400/30 transition-all"
                  style={{fontSize:'max(16px,0.75rem)'}}/>
                <button onClick={()=>saveVideoUrl(videoUrl)} disabled={!videoUrl||isLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                  style={{background:'linear-gradient(135deg,#FFD166,#06D6A0)',color:'#050508'}}>
                  {isLoading?<Loader2 size={12} className="animate-spin"/>:isDone?<Check size={12}/>:<Save size={12}/>}
                </button>
              </div>
            </div>
          );

          return (
            <div key={slot.key} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-3">
                {/* Preview */}
                <div className={`${slot.w} ${slot.h} ${slot.circle?'rounded-full':'rounded-xl'} bg-white/[0.05] border border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0`}>
                  {currentUrl
                    ? <img src={currentUrl} alt={slot.label} className="w-full h-full object-cover"/>
                    : <Upload size={16} className="text-gray-600"/>
                  }
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">{slot.label}</div>
                  <div className="text-xs text-gray-500">{slot.hint}</div>
                </div>
              </div>
              <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                isDone
                  ? 'bg-green-400/10 border-green-400/20 text-green-400'
                  : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/15'
              } ${isLoading?'opacity-60 pointer-events-none':''}`}>
                <input type="file" accept={slot.accept || 'image/*'} className="hidden"
                  onChange={e=>{const f=e.target.files?.[0]; if(f) uploadAndSave(slot.key,f); e.target.value='';}}/>
                {isLoading?<><Loader2 size={12} className="animate-spin"/>Uploading…</>
                :isDone?<><Check size={12}/>Saved!</>
                :<><Upload size={12}/>Upload {slot.label}</>}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate  = useNavigate();
  const [active, setActive] = useState<TabId>('overview');
  const [sideOpen, setSideOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [liveBookings, setLiveBookings] = useState<Booking[]>([]);
  const pendingCount = liveBookings.filter(b=>b.status==='pending').length;

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }, [navigate]);

  const NAV: { id:TabId; label:string; icon:React.ElementType; badge?:number }[] = [
    { id:'overview',  label:'Overview',   icon:LayoutDashboard },
    { id:'bookings',  label:'Bookings',   icon:Calendar, badge:pendingCount },
    { id:'analytics', label:'Analytics',  icon:BarChart2 },
    { id:'media',     label:'Media',      icon:Camera },
    { id:'content',   label:'Content',    icon:FileText },
    { id:'yusra',     label:'Yusra AI',   icon:Bot },
    { id:'settings',  label:'Settings',   icon:Settings },
  ];

  const NOTIFS = [
    { msg:'New booking: Mohammed Al-Rashidi — Full Home Deep Clean', time:'2m ago', type:'booking' },
    { msg:'Pending approval: Reem Al-Qahtani — Post-Construction',   time:'18m ago', type:'pending' },
    { msg:'Review received: 5★ from Sara Al-Mutairi',                time:'1h ago',  type:'review'  },
    { msg:'Payment confirmed: ALF-003 — SAR 750',                    time:'3h ago',  type:'payment' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white flex">
      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0a0a10] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ${sideOpen?'translate-x-0':'-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center">
              <img src="/assets/alpha-logo.png" alt="Elevate Builders" className="h-8 w-auto object-contain" onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>
            </div>
            <div>
              <div className="font-display font-black text-white text-xs tracking-[0.12em]">ELEVATE BUILDERS LTD</div>
              <div className="text-[9px] text-gray-600 tracking-[0.1em]">Admin Dashboard</div>
            </div>
          </div>
          <button onClick={()=>setSideOpen(false)} className="lg:hidden text-gray-600 hover:text-white"><X size={16}/></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>{setActive(item.id);setSideOpen(false);}}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all group text-sm font-medium ${
                active===item.id
                  ?'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                  :'text-gray-500 hover:text-white hover:bg-white/[0.04]'
              }`}>
              <div className="flex items-center gap-2.5">
                <item.icon size={16}/>
                {item.label}
              </div>
              {item.badge && item.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-[#050508] text-[10px] font-black flex items-center justify-center">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-2 bg-white/[0.02]">
            <div className="w-7 h-7 rounded-full bg-yellow-400/20 flex items-center justify-center"><Shield size={13} className="text-yellow-400"/></div>
            <div className="flex-1 min-w-0"><div className="text-xs font-bold text-white truncate">Admin</div><div className="text-[10px] text-gray-600">Authenticated</div></div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/8 transition-all text-sm">
            <LogOut size={15}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sideOpen&&<div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={()=>setSideOpen(false)}/>}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 border-b border-white/[0.06] bg-[#050508]/95 backdrop-blur-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSideOpen(true)} className="lg:hidden text-gray-500 hover:text-white p-1 transition-colors"><Menu size={20}/></button>
            <div>
              <h1 className="font-display font-black text-white text-base capitalize">{active}</h1>
              <p className="text-gray-600 text-[11px] hidden sm:block">
                {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button onClick={()=>setNotifOpen(n=>!n)}
                className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-white transition-all relative">
                <Bell size={16}/>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-yellow-400 text-[#050508] text-[9px] font-black flex items-center justify-center">{NOTIFS.length}</span>
              </button>
              <AnimatePresence>
                {notifOpen&&(
                  <motion.div initial={{opacity:0,scale:0.93,y:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.93,y:8}}
                    className="absolute right-0 top-11 w-80 rounded-2xl border border-white/[0.08] bg-[#0a0a10]/98 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                      <div className="font-display font-bold text-white text-sm">Notifications</div>
                      <button onClick={()=>setNotifOpen(false)} className="text-gray-600 hover:text-white"><X size={14}/></button>
                    </div>
                    {NOTIFS.map((n,i)=>(
                      <div key={i} className="px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all cursor-pointer">
                        <p className="text-xs text-gray-300 leading-relaxed">{n.msg}</p>
                        <p className="text-[10px] text-gray-600 mt-1">{n.time}</p>
                      </div>
                    ))}
                    <div className="px-4 py-3 text-center">
                      <button className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">Mark all as read</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Live badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-400/8 border border-green-400/20 text-[10px] font-bold text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Live
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
              {active==='overview'  && <OverviewTab setActiveTab={setActive}/>}
              {active==='bookings'  && <BookingsTab/>}
              {active==='analytics' && <AnalyticsTab bookings={liveBookings}/>}
              {active==='media'     && <div className="max-w-3xl space-y-8"><AssetsManager/><FileUpload/></div>}
              {active==='content'   && <ContentEditor/>}
              {active==='yusra'     && <YusraAdminPanel/>}
              {active==='settings'  && <SettingsTab/>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
