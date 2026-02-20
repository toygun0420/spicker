'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Bell, ChevronRight, Crown, Globe2, Menu, PenTool, Radio, 
  RefreshCw, Search, Timer, User, Volume2, Zap, ArrowUpRight, ShieldCheck 
} from 'lucide-react';

// --- [Ultimate UI Components] ---
const GlassCard = ({ children, className = "", variant = "default", live = false }: any) => {
  const borderStyle = live ? 'border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.15)]' : 
                      variant === 'danger' ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 
                      'border-white/[0.05] shadow-2xl';
  return (
    <div className={`relative bg-[#0d1117]/80 backdrop-blur-3xl border ${borderStyle} rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-white/20 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

const StatusBadge = ({ children, variant = "default" }: any) => {
  const styles: any = {
    default: "bg-slate-800 text-slate-400 border-slate-700",
    danger: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    live: "bg-rose-600 text-white border-rose-500 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.4)]"
  };
  return <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${styles[variant]}`}>{children}</span>;
};

export default function SpickerApp() {
  const [mounted, setMounted] = useState(false);
  const [dropTimer, setDropTimer] = useState(285);
  const [ballPos, setBallPos] = useState({ x: 55, y: 40 });

  const bloggers = Array.from({length: 20}, (_, i) => ({
    id: i + 1, rank: i + 1, name: `Master_${1000 + i}`, level: i < 3 ? 'LEGEND' : 'ELITE'
  }));

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setDropTimer(prev => (prev > 0 ? prev - 1 : 285)), 1000);
    const l = setInterval(() => setBallPos({ x: Math.random() * 50 + 25, y: Math.random() * 40 + 30 }), 3500);
    return () => { clearInterval(t); clearInterval(l); };
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#010409] text-slate-300 min-h-screen font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* 스타일 강제 주입 */}
      <style jsx global>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: ticker 40s linear infinite; }
        .pitch-grid { background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 25px 25px; }
      `}</style>

      {/* --- 헤더: 로고/검색/유저 완벽 배치 --- */}
      <nav className="sticky top-0 z-50 bg-[#010409]/90 backdrop-blur-xl border-b border-white/[0.03] h-20 flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-10">
          <Menu className="text-slate-500 cursor-pointer hover:text-white transition-all" />
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Volume2 className="text-white w-5 h-5" />
             </div>
             <div className="flex flex-col leading-none">
                <h1 className="text-xl font-black italic tracking-tighter text-white">SPICKER</h1>
                <span className="text-emerald-500 text-[8px] font-black tracking-[0.3em] mt-1.5 uppercase">Intelligence</span>
             </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 bg-white/[0.03] px-6 py-2.5 rounded-2xl border border-white/[0.05] w-[500px] focus-within:border-emerald-500/30 transition-all">
          <Search className="w-4 h-4 text-slate-600" />
          <input type="text" placeholder="검색어를 입력하세요..." className="bg-transparent border-none text-xs focus:outline-none w-full placeholder:text-slate-700" />
        </div>

        <div className="flex items-center gap-8">
          <Bell className="w-5 h-5 text-slate-500 cursor-pointer" />
          <div className="flex items-center gap-4 pl-6 border-l border-white/[0.05]">
             <div className="text-right hidden md:block">
                <p className="text-[11px] font-black text-white uppercase">Master_Axon</p>
                <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest leading-none">• Online</span>
             </div>
             <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-all">
                <User className="text-white w-5 h-5" />
             </div>
          </div>
        </div>
      </nav>

      {/* --- 메인 바디 --- */}
      <main className="max-w-[1800px] mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        
        {/* 왼쪽: DROP RADAR */}
        <aside className="lg:col-span-3 space-y-8">
          <GlassCard className="p-10 border-rose-500/20" variant="danger">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <Timer className="w-4 h-4 text-rose-500" /> Drop Radar
              </h3>
              <StatusBadge variant="danger">Critical</StatusBadge>
            </div>
            <div className="text-[75px] font-black text-rose-500 text-center tracking-tighter leading-none mb-12 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]">
               {Math.floor(dropTimer/60)}:{(dropTimer%60).toString().padStart(2, '0')}
            </div>
            <button className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/20 active:scale-95">
               Secure Entry Now
            </button>
          </GlassCard>
        </aside>

        {/* 중앙: ENGINE & RANKING */}
        <div className="lg:col-span-6 space-y-8">
          {/* AI Tracker */}
          <GlassCard live className="p-0 border-indigo-500/20">
            <div className="p-5 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-3 text-white">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" /> AI Real-time Tracker
              </span>
              <StatusBadge variant="success">72' In-Play</StatusBadge>
            </div>
            <div className="h-72 bg-slate-900/10 relative overflow-hidden pitch-grid">
               <div className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_25px_#facc15] transition-all duration-1000 z-10" 
                    style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }} />
               <div className="absolute inset-0 border border-white/5 m-8" />
            </div>
            <div className="p-8 grid grid-cols-3 gap-6 border-t border-white/[0.05]">
               {['HOME', 'DRAW', 'AWAY'].map((l, i) => (
                 <div key={l} className="bg-black/20 border border-white/[0.03] p-5 rounded-2xl text-center group cursor-pointer hover:border-indigo-500/40 transition-all">
                    <p className="text-[9px] text-slate-600 font-black mb-2 uppercase tracking-widest">{l}</p>
                    <p className="text-xl font-mono font-black text-white">{i === 0 ? '3.53' : i === 1 ? '2.06' : '1.88'}</p>
                 </div>
               ))}
            </div>
          </GlassCard>

          {/* S-Blogger 전광판 */}
          <div className="bg-white/[0.01] p-10 rounded-[2.5rem] border border-white/[0.05] overflow-hidden">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
              <PenTool className="w-5 h-5 text-fuchsia-400" /> S-Blogger Top 100
            </h3>
            <div className="animate-ticker">
               <div className="flex gap-6">
                 {bloggers.map(b => (
                   <div key={b.id} className="flex items-center gap-5 bg-[#161b22]/50 p-5 rounded-2xl border border-white/[0.03] w-64 shadow-xl">
                      <span className="font-black text-slate-700 text-sm">{b.rank}</span>
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center"><User className="w-4 h-4 text-slate-500" /></div>
                      <div className="flex flex-col">
                         <span className="text-white text-xs font-black truncate w-28">{b.name}</span>
                         <span className="text-[9px] text-fuchsia-400 font-black mt-1.5 uppercase tracking-widest">{b.level}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: WHALE TRACKER */}
        <aside className="lg:col-span-3 space-y-8">
          <GlassCard className="p-8 h-full flex flex-col">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
              <Activity className="w-4 h-4 text-indigo-400" /> Whale Tracker
            </h3>
            <div className="space-y-6 flex-1">
               {[{m: 'LAL VS PHX', v: '$1.24M', t: 'UNDER'}, {m: 'ARS VS MCI', v: '$850K', t: 'HOME'}].map((w, i) => (
                 <div key={i} className="p-6 bg-[#161b22]/40 rounded-[1.5rem] border border-white/[0.03] shadow-lg group hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-center mb-4 font-black text-xs text-white">{w.m}</div>
                    <div className="bg-black/30 px-5 py-4 rounded-xl border border-white/[0.02] flex justify-between items-center">
                       <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase">{w.t}</span>
                       <span className="text-xs font-mono font-black text-indigo-400">{w.v}</span>
                    </div>
                 </div>
               ))}
            </div>
            <button className="mt-10 pt-10 border-t border-white/[0.03] flex items-center justify-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
               Detailed Report <ChevronRight className="w-4 h-4" />
            </button>
          </GlassCard>
        </aside>
      </main>

      {/* --- 푸터: 데이터 무결성 --- */}
      <footer className="fixed bottom-0 w-full bg-[#010409]/90 backdrop-blur-2xl border-t border-white/[0.02] h-14 flex items-center px-10 justify-between text-[9px] font-black text-slate-600">
          <div className="flex gap-10 items-center">
            <span className="flex items-center gap-2 uppercase tracking-[0.15em]"><RefreshCw className="w-3 h-3 text-emerald-500" /> Syncing Global Markets</span>
            <span className="flex items-center gap-2 uppercase tracking-[0.15em] text-emerald-500/40"><Globe2 className="w-3 h-3" /> 128 Nodes Active</span>
          </div>
          <div className="font-mono tracking-[0.4em] uppercase text-white/10 italic">Spicker Alpha v1.0.5</div>
      </footer>
    </div>
  );
}