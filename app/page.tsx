'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Globe, Zap, Target, BarChart3, Search, Bell, User, 
  ArrowUpRight, ShieldCheck, Globe2, RefreshCw, ChevronRight, Plus, 
  Trophy, Filter, Activity, Monitor, Menu, Home, MessageSquare, 
  AlertTriangle, X, Bookmark, Star, PenTool, Medal, Award, Crown, 
  Calculator, Volume2, Skull, Timer, Radio 
} from 'lucide-react';

// --- UI Utility Components (TypeScript 에러 방지를 위해 any 타입 적용) ---
const Card = ({ children, className = "", highlight = false, trap = false, live = false }: any) => (
  <div className={`relative bg-slate-900/40 backdrop-blur-xl border ${
    live ? 'border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2)]' : 
    trap ? 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : 
    highlight ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 
    'border-slate-800/60'
  } rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:border-slate-500 group ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className="" }: any) => {
  const styles: any = {
    default: "bg-slate-800 text-slate-300",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    danger: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    primary: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    live: "bg-rose-600 text-white border border-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.6)] animate-pulse"
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap ${styles[variant] || styles.default} ${className}`}>
      {children}
    </span>
  );
};

const LiveIndicator = ({ color = "rose" }: any) => (
  <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${color}-500`}></span>
  </span>
);

const PitchBackground = ({ sport, opacity = "opacity-[0.03]" }: any) => {
  if (sport === '축구') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${opacity} pointer-events-none`} viewBox="0 0 400 200" preserveAspectRatio="none">
        <rect x="10" y="10" width="380" height="180" fill="none" stroke="white" strokeWidth="2" />
        <line x1="200" y1="10" x2="200" y2="190" stroke="white" strokeWidth="2" />
        <circle cx="200" cy="100" r="30" fill="none" stroke="white" strokeWidth="2" />
        <rect x="10" y="50" width="60" height="100" fill="none" stroke="white" strokeWidth="2" />
        <rect x="330" y="50" width="60" height="100" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    );
  }
  // 농구/야구 생략 (동일 로직)
  return null;
};

// --- 메인 애플리케이션 ---
export default function App() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropTimer, setDropTimer] = useState(299); 
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [liveOdds, setLiveOdds] = useState({ home: 3.45, draw: 2.10, away: 1.85 });

  // 스블 데이터 생성
  const bloggers = Array.from({length: 40}, (_, i) => ({
    id: i + 1, rank: i + 1, name: `User_${1000 + i}`, points: 100000 - (i * 1000)
  }));

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setDropTimer(prev => (prev > 0 ? prev - 1 : 299)), 1000);
    const live = setInterval(() => {
      setBallPos({ x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 });
      setLiveOdds(prev => ({
        home: +(prev.home + (Math.random() * 0.1 - 0.05)).toFixed(2),
        draw: +(prev.draw + (Math.random() * 0.06 - 0.03)).toFixed(2),
        away: +(prev.away + (Math.random() * 0.1 - 0.05)).toFixed(2),
      }));
    }, 3000);
    return () => { clearInterval(timer); clearInterval(live); };
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen relative overflow-x-hidden">
      <style jsx global>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: ticker 40s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
      `}</style>

      {/* 헤더 네비게이션 */}
      <nav className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-800/50 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-6">
          <Menu className="text-slate-400 cursor-pointer" onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
          <div className="flex items-center gap-2">
             <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg"><Volume2 className="text-white w-5 h-5" /></div>
             <h1 className="text-xl font-black italic tracking-tighter">SPICKER <span className="text-emerald-500 text-xs ml-1">스픽커</span></h1>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 bg-slate-900/50 px-4 py-1.5 rounded-xl border border-slate-800 w-96">
          <Search className="w-4 h-4 text-slate-500" />
          <input type="text" placeholder="경기, 스블 검색..." className="bg-transparent border-none text-xs focus:outline-none w-full" />
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-slate-500" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center border border-emerald-400/30"><User className="text-white w-5 h-5" /></div>
        </div>
      </nav>

      {/* 메인 레이아웃 */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 왼쪽: 배당 폭락 */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="p-6 border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-transparent">
            <h3 className="text-xs font-black text-rose-400 uppercase mb-4 flex items-center gap-2"><Timer className="w-4 h-4" /> 배당 폭락 레이더</h3>
            <div className="text-4xl font-mono font-black text-rose-500 text-center py-6 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
              {Math.floor(dropTimer/60)}:{(dropTimer%60).toString().padStart(2,'0')}
            </div>
            <button className="w-full py-4 bg-rose-600 rounded-xl font-black text-xs">폭락 전 당장 진입하기</button>
          </Card>
          
          <Card className="p-5 bg-gradient-to-br from-amber-600/10 to-transparent border-amber-500/20">
             <h3 className="text-xs font-black text-amber-400 flex items-center gap-2 uppercase mb-4"><Zap className="w-4 h-4 fill-amber-400" /> 슈퍼벳 레이더</h3>
             <div className="space-y-3">
                {['리버풀 vs 맨시티', 'LAL vs PHO'].map((m, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-slate-950/50 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-black">{m}</span>
                    <span className="text-amber-400 font-mono text-[10px]">+13.1%</span>
                  </div>
                ))}
             </div>
          </Card>
        </aside>

        {/* 중앙: 트래커 + 전광판 */}
        <div className="lg:col-span-6 space-y-8">
          <Card live className="bg-[#060b18]">
            <div className="p-4 border-b border-indigo-500/30 flex justify-between items-center bg-indigo-950/20">
              <span className="text-xs font-black uppercase flex items-center gap-2 text-white"><Radio className="w-4 h-4 text-rose-500 animate-pulse" /> AI 실시간 트래커</span>
              <Badge variant="live">LIVE 72'</Badge>
            </div>
            <div className="h-56 bg-emerald-950/10 relative">
               <PitchBackground sport="축구" opacity="opacity-[0.1]" />
               <div className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_yellow] transition-all duration-1000" style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }} />
            </div>
            <div className="p-4 bg-slate-900/60 grid grid-cols-3 gap-3">
               {Object.entries(liveOdds).map(([key, value]) => (
                 <div key={key} className="bg-[#020617] border border-slate-800 p-2.5 rounded-xl text-center">
                    <p className="text-[9px] text-slate-500 font-black uppercase mb-1">{key}</p>
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
                  <div key={b.id} className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 w-52">
                    <span className="text-emerald-500 font-black text-xs">{b.rank}</span>
                    <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center"><User className="w-3 h-3 text-slate-400" /></div>
                    <div className="flex flex-col leading-none">
                      <span className="text-white text-[11px] font-black truncate w-24">{b.name}</span>
                      <span className="text-[8px] text-slate-500 font-bold mt-1 uppercase">Gold Trophy</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 스마트 머니 */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="p-6 border-indigo-500/20">
            <h3 className="text-xs font-black text-indigo-400 uppercase mb-5 flex items-center gap-2"><Activity className="w-4 h-4" /> 스마트 머니 흐름</h3>
            <div className="space-y-4">
              {[
                { m: 'LAL VS PHX', v: '$1.24M', t: 'Under' },
                { m: 'ARS VS MCI', v: '$850K', t: 'Home' }
              ].map((w, i) => (
                <div key={i} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-white">{w.m}</span>
                    <Badge variant="primary">LIVE</Badge>
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

      {/* 푸터 티커 */}
      <footer className="fixed bottom-0 w-full bg-[#020617]/95 backdrop-blur-3xl border-t border-slate-900 h-12 flex items-center px-10 justify-between text-[10px] font-black text-slate-600">
          <div className="flex gap-10 items-center">
            <span className="flex items-center gap-2 uppercase tracking-widest"><RefreshCw className="w-3.5 h-3.5 text-emerald-500" /> Data Sync Active</span>
            <span className="flex items-center gap-2 uppercase tracking-widest"><Globe2 className="w-3.5 h-3.5" /> 32 Global Bookies</span>
          </div>
          <div className="text-emerald-500/50 font-mono tracking-widest uppercase">Spicker Alpha v1.0.2</div>
      </footer>
    </div>
  );
}