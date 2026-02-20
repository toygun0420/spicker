'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Bell, ChevronRight, Crown, Globe2, Menu, PenTool, Radio, RefreshCw, Search, Timer, User, Volume2
} from 'lucide-react';

// --- [High-End UI Components - 안전한 버전] ---
// 타입 에러 방지를 위해 모든 props에 any 적용
const GlassCard = ({ children, className = "", highlight = false, trap = false, live = false }: any) => (
  <div className={`relative backdrop-blur-3xl border transition-all duration-1000 group rounded-[2.5rem] overflow-hidden ${
    live ? 'bg-indigo-500/[0.03] border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.2)]' : 
    trap ? 'bg-rose-500/[0.03] border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.15)]' : 
    highlight ? 'bg-amber-500/[0.03] border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : 
    'bg-slate-900/30 border-slate-800/80 shadow-2xl'
  } hover:border-slate-500/50 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    {children}
  </div>
);

const ProBadge = ({ children, variant = "default" }: any) => {
  const styles: any = {
    default: "bg-slate-800/50 text-slate-400 border-slate-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    primary: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    live: "bg-rose-600 text-white border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.5)] animate-pulse"
  };
  return <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${styles[variant]}`}>{children}</span>;
};

// --- [Main Application] ---
export default function App() {
  const [mounted, setMounted] = useState(false);
  const [dropTimer, setDropTimer] = useState(299);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [liveOdds, setLiveOdds] = useState({ home: 3.45, draw: 2.10, away: 1.85 });

  const bloggers = Array.from({length: 40}, (_, i) => ({
    id: i + 1, rank: i + 1, name: `Master_${1000 + i}`, points: 98500 - (i * 1420),
    level: i < 3 ? 'Master Class' : i < 10 ? 'Elite' : 'Pro'
  }));

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setDropTimer(prev => (prev > 0 ? prev - 1 : 299)), 1000);
    const l = setInterval(() => {
      setBallPos({ x: Math.random() * 60 + 20, y: Math.random() * 50 + 25 });
      setLiveOdds(prev => ({
        home: +(prev.home + (Math.random() * 0.08 - 0.04)).toFixed(2),
        draw: +(prev.draw + (Math.random() * 0.04 - 0.02)).toFixed(2),
        away: +(prev.away + (Math.random() * 0.08 - 0.04)).toFixed(2),
      }));
    }, 3000);
    return () => { clearInterval(t); clearInterval(l); };
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#010409] text-slate-200 min-h-screen font-sans tracking-tight selection:bg-emerald-500/30 relative overflow-hidden">
      {/* 안전한 스타일 주입 */}
      <style jsx global>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: ticker 50s linear infinite; }
        .pitch-pattern { background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 30px 30px; }
      `}</style>

      {/* 배경: 외부 이미지 대신 안전한 그라데이션 사용 */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#010409] via-slate-950 to-[#010409] z-0" />

      {/* 헤더 */}
      <nav className="sticky top-0 z-50 bg-[#010409]/80 backdrop-blur-2xl border-b border-white/[0.05] h-24 flex items-center px-4 md:px-10 justify-between">
        <div className="flex items-center gap-10">
          <Menu className="text-slate-500 cursor-pointer hover:text-white transition-all" />
          <div className="flex items-center gap-4 group cursor-pointer">
             <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:rotate-6 transition-all duration-500">
                <Volume2 className="text-white w-6 h-6" />
             </div>
             <div className="flex flex-col">
                <h1 className="text-2xl font-black italic tracking-tighter text-white leading-none">SPICKER</h1>
                <span className="text-emerald-500 text-[9px] font-black tracking-[0.3em] mt-1 ml-0.5 uppercase">Intelligence</span>
             </div>
          </div>
        </div>
        {/* 검색창 (모바일 숨김) */}
        <div className="hidden xl:flex items-center gap-4 bg-white/[0.03] px-8 py-3 rounded-2xl border border-white/[0.05] w-[600px] focus-within:border-emerald-500/40 focus-within:bg-white/[0.06] transition-all duration-500 shadow-2xl">
          <Search className="w-4 h-4 text-slate-500" />
          <input type="text" placeholder="검색어를 입력하세요..." className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-200 placeholder:text-slate-600 font-medium" />
        </div>
        {/* 우측 메뉴 */}
        <div className="flex items-center gap-8">
          <button className="p-3.5 text-slate-400 hover:text-white bg-white/[0.03] rounded-2xl border border-white/[0.05] transition-all relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#010409]" />
          </button>
          <div className="flex items-center gap-5 pl-8 border-l border-white/[0.05]">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-white tracking-wide uppercase">Master_Axon</p>
              <div className="flex items-center gap-2 justify-end mt-1">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <p className="text-[9px] text-emerald-500 font-black tracking-widest uppercase">Node Connected</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center shadow-2xl border border-white/[0.1] cursor-pointer hover:border-emerald-500/50 transition-all p-1">
               <div className="w-full h-full rounded-[1rem] bg-emerald-500 flex items-center justify-center shadow-inner">
                  <User className="text-white w-6 h-6" />
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-[1800px] mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* 폭락 레이더 */}
        <aside className="lg:col-span-3">
          <GlassCard className="p-10 border-rose-500/30">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-3"><Timer className="w-5 h-5" /> Drop Radar</h3>
              <ProBadge variant="live">Critical</ProBadge>
            </div>
            <div className="text-7xl font-mono font-black text-rose-500 text-center tracking-tighter drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] mb-10">
              {Math.floor(dropTimer/60)}:{(dropTimer%60).toString().padStart(2,'0')}
            </div>
            <button className="w-full py-5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-rose-900/40">Secure Entry Now</button>
          </GlassCard>
        </aside>

        {/* 중앙 트래커 및 랭킹 */}
        <div className="lg:col-span-6 space-y-10">
          <GlassCard live className="p-0 border-indigo-500/30">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4"><Radio className="w-5 h-5 text-rose-500 animate-pulse" /><span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">AI Real-time Tracker</span></div>
              <ProBadge variant="primary">Match Day 28</ProBadge>
            </div>
            <div className="h-80 relative pitch-pattern overflow-hidden">
               <div className="absolute w-5 h-5 bg-yellow-400 rounded-full shadow-[0_0_40px_rgba(250,204,21,1)] transition-all duration-[3000ms] ease-in-out z-10 blur-[1px]" style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }} />
            </div>
            <div className="p-8 bg-black/40 grid grid-cols-3 gap-6 border-t border-white/[0.05]">
               {Object.entries(liveOdds).map(([key, value]) => (
                 <div key={key} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-[1.5rem] text-center group hover:bg-indigo-500/[0.05] transition-all cursor-pointer">
                    <p className="text-[9px] text-slate-500 font-black uppercase mb-2 tracking-widest">{key}</p>
                    <p className="text-2xl font-mono font-black text-white tracking-tighter">{value}</p>
                 </div>
               ))}
            </div>
          </GlassCard>
          {/* 스블 랭킹 */}
          <div className="bg-white/[0.02] p-10 rounded-[3.5rem] border border-white/[0.05] relative overflow-hidden shadow-3xl">
            <div className="flex justify-between items-center mb-8 px-4"><h3 className="text-xs font-black text-fuchsia-400 uppercase tracking-[0.3em] flex items-center gap-4"><PenTool className="w-6 h-6" /> S-Blogger Top 100</h3></div>
            <div className="animate-ticker group"><div className="flex gap-8">{bloggers.map(b => (<div key={b.id} className="flex items-center gap-5 bg-slate-900/60 p-6 rounded-[2rem] border border-white/[0.05] w-72 shadow-2xl"><span className={`font-black text-lg w-8 text-center ${b.rank <= 3 ? 'text-amber-400' : 'text-slate-700'}`}>{b.rank}</span><div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center">{b.rank <= 3 ? <Crown className="w-6 h-6 text-amber-400" /> : <User className="w-5 h-5 text-slate-500" />}</div><div className="flex flex-col"><span className="text-white text-sm font-black tracking-tight">{b.name}</span><span className="text-[9px] text-fuchsia-400 font-black uppercase tracking-widest mt-1.5">{b.level}</span></div></div>))}</div></div>
          </div>
        </div>

        {/* 스마트 머니 */}
        <aside className="lg:col-span-3">
          <GlassCard className="p-10 border-indigo-500/20 h-full flex flex-col">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3"><Activity className="w-5 h-5" /> Whale Tracker</h3>
            <div className="space-y-6 flex-1">
              {[{ m: 'LAL VS PHX', v: '$1.24M', t: 'Under' }, { m: 'ARS VS MCI', v: '$850K', t: 'Home' }, { m: 'TOT VS CHE', v: '$620K', t: 'Draw' }].map((w, i) => (
                <div key={i} className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/[0.05] shadow-xl"><div className="flex justify-between items-center mb-4"><span className="text-xs font-black text-white">{w.m}</span></div><div className="bg-black/40 px-5 py-4 rounded-[1.25rem] border border-white/[0.03] flex justify-between items-center"><span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{w.t}</span><span className="text-sm font-mono font-black text-indigo-400">{w.v}</span></div></div>
              ))}
            </div>
            <button className="mt-10 pt-10 border-t border-white/[0.05] flex items-center justify-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">Full Report <ChevronRight className="w-4 h-4" /></button>
          </GlassCard>
        </aside>
      </main>
    </div>
  );
}