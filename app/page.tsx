'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Bell, ChevronRight, Crown, Globe2, Menu, Radio, 
  RefreshCw, Search, Timer, User, Volume2, Zap 
} from 'lucide-react';

// --- [신버전 최적화: 아날로그 숫자 컴포넌트] ---
const AnalogDigit = ({ n, color = "#f59e0b", size = 40 }: any) => {
  const segs: any = {
    top: [0,2,3,5,6,7,8,9], tl: [0,4,5,6,8,9], tr: [0,1,2,3,4,7,8,9],
    mid: [2,3,4,5,6,8,9], bl: [0,2,6,8], br: [0,1,3,4,5,6,7,8,9], bot: [0,2,3,5,6,8,9]
  };
  const isActive = (s: string) => segs[s].includes(n);
  const dim = "rgba(255,255,255,0.03)";
  
  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 30 50">
      <rect x="5" y="2" width="20" height="4" rx="2" fill={isActive('top') ? color : dim} />
      <rect x="2" y="7" width="4" height="15" rx="2" fill={isActive('tl') ? color : dim} />
      <rect x="24" y="7" width="4" height="15" rx="2" fill={isActive('tr') ? color : dim} />
      <rect x="5" y="23" width="20" height="4" rx="2" fill={isActive('mid') ? color : dim} />
      <rect x="2" y="28" width="4" height="15" rx="2" fill={isActive('bl') ? color : dim} />
      <rect x="24" y="28" width="4" height="15" rx="2" fill={isActive('br') ? color : dim} />
      <rect x="5" y="44" width="20" height="4" rx="2" fill={isActive('bot') ? color : dim} />
    </svg>
  );
};

export default function SpickerFinal() {
  const [mounted, setMounted] = useState(false);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [odds, setOdds] = useState({ h: 3.53, d: 2.06, a: 1.88 });

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBallPos({ x: Math.random() * 60 + 20, y: Math.random() * 40 + 30 });
      setOdds(prev => ({
        h: +(prev.h + (Math.random() * 0.1 - 0.05)).toFixed(2),
        d: +(prev.d + (Math.random() * 0.04 - 0.02)).toFixed(2),
        a: +(prev.a + (Math.random() * 0.1 - 0.05)).toFixed(2),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#010409] text-slate-300 font-sans overflow-hidden">
      {/* 스타일 강제 주입: 신버전 충돌 방지 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: ticker 35s linear infinite; }
        .glass-effect { background: rgba(13, 17, 23, 0.7); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.05); }
      `}} />

      {/* --- 고정 헤더 --- */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#010409]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu className="w-5 h-5 text-slate-500 cursor-pointer" />
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"><Volume2 className="text-white w-5 h-5" /></div>
            <h1 className="text-xl font-black italic tracking-tighter text-white">SPICKER</h1>
          </div>
        </div>
        <div className="hidden md:flex flex-1 mx-10 max-w-2xl bg-white/5 rounded-xl border border-white/5 px-4 py-2 items-center gap-3">
          <Search className="w-4 h-4 text-slate-600" />
          <input type="text" placeholder="Intelligence Search..." className="bg-transparent border-none outline-none text-xs w-full" />
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-slate-500" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><User className="text-white w-5 h-5" /></div>
        </div>
      </header>

      {/* --- 메인 컨텐츠 영역: 스크롤 가능 --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: DROP RADAR */}
          <div className="lg:col-span-3">
            <div className="glass-effect p-6 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black text-rose-500 tracking-widest">
                <span>DROP RADAR</span>
                <span className="px-2 py-0.5 bg-rose-500 text-white rounded">CRITICAL</span>
              </div>
              <div className="text-6xl font-mono font-black text-rose-500 text-center py-4 drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]">04:50</div>
              <div className="space-y-3">
                {['ARS vs MCI', 'PSG vs BAY'].map(match => (
                  <div key={match} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-[11px] font-bold">{match}</span>
                    <span className="text-rose-500 font-black text-xs">-22.9%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: AI ENGINE */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-effect rounded-[2rem] overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2"><Radio className="w-4 h-4 text-rose-500 animate-pulse" /><span className="text-[10px] font-black uppercase">AI Tracker</span></div>
                <span className="text-[10px] text-rose-500 font-black">72' LIVE</span>
              </div>
              <div className="h-64 bg-[#060b18] relative overflow-hidden">
                {/* 경기장 격자 */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                {/* 아날로그 스코어보드 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 bg-black/60 p-4 rounded-2xl border border-white/5 z-10 backdrop-blur-md">
                  <AnalogDigit n={0} size={50} />
                  <div className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full animate-pulse shadow-[0_0_10px_#f59e0b]" />
                  <AnalogDigit n={1} size={50} />
                </div>
                {/* 매치볼 */}
                <div className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_#facc15] transition-all duration-1000" style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }} />
              </div>
              <div className="p-6 grid grid-cols-3 gap-4 bg-black/20">
                {['HOME', 'DRAW', 'AWAY'].map((l, i) => (
                  <div key={l} className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                    <div className="text-[9px] text-slate-500 font-black mb-1">{l}</div>
                    <div className="text-xl font-mono font-black text-emerald-400">{i===0?odds.h:i===1?odds.d:odds.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TICKER MARQUEE */}
            <div className="glass-effect p-6 rounded-[2rem] overflow-hidden">
              <div className="animate-ticker gap-6">
                {Array.from({length: 10}).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 w-64 shadow-xl">
                    <span className="text-xs font-black text-slate-600">#{i+1}</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center"><User className="w-4 h-4 text-emerald-400" /></div>
                    <div className="text-xs font-black">MASTER_{100+i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: WHALE TRACKER */}
          <div className="lg:col-span-3">
            <div className="glass-effect p-6 rounded-[2rem] h-full space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black text-indigo-400 tracking-widest">
                <span>WHALE TRACKER</span>
                <Activity className="w-4 h-4" />
              </div>
              <div className="space-y-4">
                {['$2.14M', '$1.38M', '$980K'].map((vol, i) => (
                  <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="text-[11px] font-black text-white">LAL VS PHX</div>
                    <div className="text-2xl font-mono font-black text-indigo-400">{vol}</div>
                    <div className="flex justify-between text-[9px] text-slate-600 font-bold"><span>CONFIDENCE</span><span>94%</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- 고정 푸터 --- */}
      <footer className="h-10 border-t border-white/5 bg-[#010409]/95 flex items-center justify-between px-10 text-[9px] font-bold text-slate-700 z-50">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 text-emerald-500" /> SYNCING DATA</span>
          <span>32 GLOBAL BOOKIES</span>
        </div>
        <span className="font-mono">SPICKER PROTOCOL v1.1.0-NEW</span>
      </footer>
    </div>
  );
}