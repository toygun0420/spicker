'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Zap, BarChart3, Bell, User, ArrowUpRight, Globe2, 
  RefreshCw, Trophy, Activity, Radio, Skull, Timer, Menu, Bookmark, 
  Star, PenTool, Award, Crown, Calculator, Volume2, Search, X, Monitor, ShieldCheck
} from 'lucide-react';

// 타입 에러 완벽 차단
const Card = ({ children, className = "", highlight = false, trap = false, live = false }: any) => (
  <div className={`relative bg-slate-900/40 backdrop-blur-2xl border transition-all duration-700 hover:border-slate-500 group rounded-3xl overflow-hidden ${
    live ? 'border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.2)]' : 
    trap ? 'border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.15)]' : 
    highlight ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 
    'border-slate-800/60'
  } ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }: any) => {
  const styles: any = {
    default: "bg-slate-800 text-slate-300",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    primary: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    live: "bg-rose-600 text-white border border-rose-500 animate-pulse"
  };
  return <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-transparent ${styles[variant]}`}>{children}</span>;
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [dropTimer, setDropTimer] = useState(299);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [liveOdds, setLiveOdds] = useState({ home: 3.45, draw: 2.10, away: 1.85 });

  const bloggers = Array.from({length: 40}, (_, i) => ({
    id: i + 1, rank: i + 1, name: `User_${1000 + i}`, points: 85200 - (i * 1250)
  }));

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setDropTimer(prev => (prev > 0 ? prev - 1 : 299)), 1000);
    const l = setInterval(() => {
      setBallPos({ x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 });
      setLiveOdds(prev => ({
        home: +(prev.home + (Math.random() * 0.1 - 0.05)).toFixed(2),
        draw: +(prev.draw + (Math.random() * 0.06 - 0.03)).toFixed(2),
        away: +(prev.away + (Math.random() * 0.1 - 0.05)).toFixed(2),
      }));
    }, 2500);
    return () => { clearInterval(t); clearInterval(l); };
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen selection:bg-emerald-500/30 font-sans tracking-tight">
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] grayscale mix-blend-overlay z-0">
        <img src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="" />
      </div>

      {/* 헤더 */}
      <nav className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-3xl border-b border-slate-800/50 h-20 flex items-center px-4 md:px-10 justify-between">
        <div className="flex items-center gap-8">
          <Menu className="text-slate-500 cursor-pointer hover:text-emerald-400 transition-all w-6 h-6" />
          <div className="flex items-center gap-3 group cursor-pointer">
             <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-all">
                <Volume2 className="text-white w-6 h-6" />
             </div>
             <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">SPICKER <span className="text-emerald-500 text-xs ml-1 not-italic font-bold">스픽커</span></h1>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-6 bg-slate-900/40 px-6 py-2.5 rounded-2xl border border-slate-800/80 w-[500px] focus-within:border-emerald-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-500" />
          <input type="text" placeholder="스블 닉네임, 경기 검색..." className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-200 placeholder:text-slate-600" />
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-3 text-slate-400 hover:text-white bg-slate-900/50 rounded-2xl border border-slate-800 transition-all hover:bg-slate-800">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
          </button>
          <div className="flex items-center gap-4 pl-6 border-l border-slate-800/80">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-white tracking-tight uppercase">Master_Axon</p>
              <p className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase">Pro Node Active</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center border border-emerald-400/30 shadow-2xl"><User className="text-white w-6 h-6" /></div>
          </div>
        </div>
      </nav>

      {/* 메인 레이아웃 */}
      <main className="max-w-[1700px] mx-auto p-4 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <aside className="lg:col-span-3 space-y-8">
          <Card className="p-8 border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-transparent to-transparent">
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2 mb-6"><Timer className="w-4 h-4" /> 배당 폭락 감지 레이더</h3>
            <div className="text-5xl font-mono font-black text-rose-500 text-center py-8 tracking-[0.2em] drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]">
              {Math.floor(dropTimer/60)}:{(dropTimer%60).toString().padStart(2,'0')}
            </div>
            <button className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs uppercase transition-all">폭락 전 당장 진입하기</button>
          </Card>
        </aside>

        <div className="lg:col-span-6 space-y-10">
          <Card live className="bg-[#060b18]/80">
            <div className="p-5 border-b border-indigo-500/30 flex justify-between items-center bg-indigo-950/30 backdrop-blur-xl">
              <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white"><Radio className="w-4 h-4 text-rose-500 animate-pulse" /> AI 실시간 경기 추적기</span>
              <Badge variant="live">72' LIVE</Badge>
            </div>
            <div className="h-64 bg-emerald-950/20 relative">
               <div className="absolute inset-0 opacity-10 flex items-center justify-center"><div className="w-full h-full border border-white/20 m-6"></div></div>
               <div className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_25px_yellow] transition-all duration-1000 ease-in-out z-10" style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }} />
            </div>
            <div className="p-6 bg-slate-900/60 grid grid-cols-3 gap-4 border-t border-slate-800">
               {Object.entries(liveOdds).map(([key, value]) => (
                 <div key={key} className="bg-[#020617] border border-slate-800 p-4 rounded-2xl text-center shadow-inner hover:border-emerald-500/50 transition-all cursor-pointer">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1.5 tracking-widest">{key}</p>
                    <p className="text-xl font-mono font-black text-emerald-400">{value}</p>
                 </div>
               ))}
            </div>
          </Card>

          {/* 스블 랭킹 전광판 (Tailwind 애니메이션 활용) */}
          <div className="bg-slate-900/40 p-8 rounded-[40px] border border-slate-800/60 relative overflow-hidden">
            <h3 className="text-sm font-black text-fuchsia-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><PenTool className="w-5 h-5" /> 스블 TOP 100 랭킹</h3>
            <div className="flex overflow-hidden group">
              <div className="flex gap-6 animate-marquee whitespace-nowrap">
                {bloggers.map(b => (
                  <div key={b.id} className="flex items-center gap-4 bg-slate-950/90 p-5 rounded-[24px] border border-slate-800 w-64 shadow-xl">
                    <span className={`font-black text-sm w-6 text-center ${b.rank <= 3 ? 'text-amber-400' : 'text-slate-600'}`}>{b.rank}</span>
                    <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center"><User className="w-4 h-4 text-slate-400" /></div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-black truncate w-28">{b.name}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{b.rank <= 3 ? 'Master Class' : 'Professional'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-3">
          <Card className="p-8 border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 to-transparent">
            <h3 className="text-xs font-black text-indigo-400 uppercase mb-6 flex items-center gap-2 tracking-widest"><Activity className="w-4 h-4" /> 글로벌 스마트 머니 흐름</h3>
            <div className="space-y-5">
              {[
                { m: 'LAL VS 보스턴', v: '$1.24M', t: 'Under 224.5' },
                { m: '아스널 VS 맨시티', v: '$850K', t: 'Home Win' }
              ].map((w, i) => (
                <div key={i} className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800/80 shadow-lg">
                  <div className="flex justify-between items-center mb-3 text-xs font-black text-white">{w.m}</div>
                  <div className="flex justify-between items-center bg-[#020617] px-4 py-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{w.t}</span>
                    <span className="text-sm font-mono font-black text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">{w.v}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </main>

      {/* 푸터 */}
      <footer className="fixed bottom-0 w-full bg-[#020617]/95 backdrop-blur-3xl border-t border-slate-900 h-12 flex items-center px-10 justify-between text-[10px] font-black text-slate-600 z-50">
          <div className="flex gap-10 items-center">
            <span className="flex items-center gap-2 uppercase tracking-widest"><RefreshCw className="w-3.5 h-3.5 text-emerald-500" /> Real-time Data Sync</span>
          </div>
          <div className="text-emerald-500/50 font-mono tracking-[0.4em] uppercase">Spicker Alpha v1.0.2</div>
      </footer>
    </div>
  );
}