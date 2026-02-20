'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Zap, BarChart3, Bell, User, ArrowUpRight, Globe2, 
  RefreshCw, Trophy, Activity, Radio, Skull, Timer, Menu, Bookmark, 
  Star, PenTool, Award, Crown, Calculator, Volume2, Search, X
} from 'lucide-react';

// --- UI 유틸리티 컴포넌트 ---
const Card = ({ children, className = "", highlight = false, trap = false, live = false }: any) => (
  <div className={`relative bg-slate-900/40 backdrop-blur-xl border ${live ? 'border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2)]' : trap ? 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : highlight ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-slate-800/60'} rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:border-slate-500 group ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }: any) => {
  const styles: any = {
    default: "bg-slate-800 text-slate-300",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    live: "bg-rose-600 text-white border border-rose-500 animate-pulse"
  };
  return <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${styles[variant]}`}>{children}</span>;
};

// --- 메인 페이지 ---
export default function App() {
  const [mounted, setMounted] = useState(false);
  const [dropTimer, setDropTimer] = useState(299);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [liveOdds, setLiveOdds] = useState({ home: 3.45, draw: 2.10, away: 1.85 });

  const bloggers = Array.from({length: 20}, (_, i) => ({
    id: i + 1, rank: i + 1, name: `User_${1000 + i}`, points: 50000 - (i * 1000)
  }));

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setDropTimer(prev => (prev > 0 ? prev - 1 : 299)), 1000);
    const l = setInterval(() => {
      setBallPos({ x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 });
      setLiveOdds(prev => ({
        home: +(prev.home + (Math.random() * 0.2 - 0.1)).toFixed(2),
        draw: +(prev.draw + (Math.random() * 0.1 - 0.05)).toFixed(2),
        away: +(prev.away + (Math.random() * 0.2 - 0.1)).toFixed(2),
      }));
    }, 3000);
    return () => { clearInterval(t); clearInterval(l); };
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen selection:bg-emerald-500/30">
      <style jsx global>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: ticker 30s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
      `}</style>

      {/* --- 복구된 헤더 (검색창/알림/유저 프로필 포함) --- */}
      <nav className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-2xl border-b border-slate-800/50 h-16 flex items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-6">
          <Menu className="text-slate-400 cursor-pointer hover:text-white transition-colors" />
          <div className="flex items-center gap-2">
             <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"><Volume2 className="text-white w-5 h-5" /></div>
             <h1 className="text-xl font-black italic tracking-tighter">SPICKER <span className="text-emerald-500 text-[10px] ml-1">스픽커</span></h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 bg-slate-900/50 px-4 py-1.5 rounded-xl border border-slate-800 w-96 group focus-within:border-emerald-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
          <input type="text" placeholder="스블 닉네임, 경기 검색..." className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-200" />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-white bg-slate-900/50 rounded-xl border border-slate-800">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-black text-white">Master_Axon</p>
              <p className="text-[9px] text-emerald-400 font-bold">PRO NODE</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xl border border-emerald-400/30"><User className="text-white w-5 h-5" /></div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 왼쪽 섹션 */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="p-6 border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-transparent">
            <h3 className="text-xs font-black text-rose-400 uppercase mb-4 flex items-center gap-2"><Timer className="w-4 h-4" /> 배당 폭락 감지 레이더</h3>
            <div className="text-4xl font-mono font-black text-rose-500 text-center py-6 tracking-widest drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
              {Math.floor(dropTimer/60)}:{(dropTimer%60).toString().padStart(2,'0')}
            </div>
            <button className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-xs transition-all shadow-lg shadow-rose-600/20">폭락 전 당장 진입하기</button>
          </Card>
        </aside>

        {/* 중앙 섹션 */}
        <div className="lg:col-span-6 space-y-8">
          {/* 복구된 AI 트래커 (상세 배당률 포함) */}
          <Card live className="bg-[#060b18] overflow-hidden">
            <div className="p-4 border-b border-indigo-500/30 flex justify-between items-center bg-indigo-950/20">
              <span className="text-xs font-black uppercase flex items-center gap-2"><Radio className="w-4 h-4 text-rose-500" /> AI 라이브 트래커</span>
              <Badge variant="live">LIVE 72'</Badge>
            </div>
            <div className="h-56 bg-emerald-900/10 relative">
               <div className="absolute inset-0 opacity-10"><svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="5" y="5" width="90" height="90" fill="none" stroke="white" strokeWidth="0.5"/><line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.5"/><circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.5"/></svg></div>
               <div className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_yellow] transition-all duration-1000" style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }} />
            </div>
            <div className="p-4 bg-slate-900/80 grid grid-cols-3 gap-3">
               {Object.entries(liveOdds).map(([key, value]) => (
                 <div key={key} className="bg-[#020617] border border-slate-800 p-2.5 rounded-xl text-center">
                    <p className="text-[9px] text-slate-500 font-black uppercase mb-1">{key === 'home' ? 'Home' : key === 'draw' ? 'Draw' : 'Away'}</p>
                    <p className="text-xs font-mono font-black text-emerald-400">{value}</p>
                 </div>
               ))}
            </div>
          </Card>

          {/* 스블 랭킹 전광판 */}
          <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60">
            <h3 className="text-xs font-black text-fuchsia-400 uppercase mb-4 px-2">스블 (스픽커 블로거) TOP 100</h3>
            <div className="animate-ticker">
              <div className="flex gap-4">
                {bloggers.map(b => (
                  <div key={b.id} className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 w-52 hover:border-fuchsia-500/50 transition-colors cursor-pointer">
                    <span className="text-emerald-500 font-black text-xs w-4">{b.rank}</span>
                    <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center"><User className="w-3 h-3 text-slate-400" /></div>
                    <div className="flex flex-col">
                      <span className="text-white text-[11px] font-black truncate w-24">{b.name}</span>
                      <span className="text-[9px] text-fuchsia-400 font-bold uppercase tracking-tighter">Gold Trophy</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="p-6 border-indigo-500/20">
            <h3 className="text-xs font-black text-indigo-400 uppercase mb-5 flex items-center gap-2"><Activity className="w-4 h-4" /> 스마트 머니 흐름</h3>
            <div className="space-y-4">
              {[
                { m: 'LAL VS 보스턴', v: '$1.24M', t: 'Under' },
                { m: '아스널 VS 맨시티', v: '$850K', t: 'Home' },
                { m: '토트넘 VS 첼시', v: '$620K', t: 'Draw' }
              ].map((w, i) => (
                <div key={i} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 group hover:border-indigo-500/40 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-white">{w.m}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Live</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold italic">{w.t}</span>
                    <span className="text-xs font-mono font-black text-indigo-400">{w.v}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}