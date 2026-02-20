'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Globe, Zap, Target, BarChart3, Search, Bell, User, 
  ArrowUpRight, ShieldCheck, Globe2, RefreshCw, ChevronRight, Plus, 
  Trophy, Filter, Activity, Monitor, Menu, Home, MessageSquare, 
  AlertTriangle, X, Bookmark, Star, PenTool, Medal, Award, Crown, 
  Calculator, Volume2, Skull, Timer, Radio, Sun, Moon 
} from 'lucide-react';

// --- UI 유틸리티 컴포넌트 (에러 방지를 위해 any 타입 적용) ---
const Card = ({ children, className = "", highlight = false, trap = false, live = false }: any) => (
  <div className={`relative bg-slate-900/40 backdrop-blur-xl border ${live ? 'border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2)]' : trap ? 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : highlight ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-slate-800/60'} rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:border-slate-500 group ${className}`}>
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

const PitchBackground = ({ sport, opacity = "opacity-[0.03]" }: any) => {
  if (sport === '축구') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${opacity} pointer-events-none`} viewBox="0 0 400 200" preserveAspectRatio="none">
        <rect x="10" y="10" width="380" height="180" fill="none" stroke="white" strokeWidth="2" />
        <line x1="200" y1="10" x2="200" y2="190" stroke="white" strokeWidth="2" />
        <circle cx="200" cy="100" r="30" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    );
  }
  return null;
};

// --- 메인 애플리케이션 ---
export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [dropTimer, setDropTimer] = useState(299);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBallPos({ x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 });
    }, 3000);
    const timer = setInterval(() => {
      setDropTimer(prev => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen relative">
      {/* 전광판 애니메이션 스타일 */}
      <style jsx global>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: ticker 40s linear infinite; }
      `}</style>

      {/* 상단바 */}
      <nav className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-800/50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="p-2 text-slate-400">
              <Menu />
            </button>
            <h1 className="text-xl md:text-2xl font-black italic">SPICKER <span className="text-emerald-500 text-xs">스픽커</span></h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center border border-emerald-400/30">
            <User className="text-white w-5 h-5" />
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 왼쪽 섹션 */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="p-5 border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-transparent">
            <h3 className="text-xs font-black text-rose-400 uppercase mb-4 flex items-center gap-2"><Timer className="w-4 h-4" /> 배당 폭락 감지</h3>
            <div className="text-3xl font-mono font-black text-rose-500 text-center py-4 tracking-widest">
              {Math.floor(dropTimer/60).toString().padStart(2,'0')}:{(dropTimer%60).toString().padStart(2,'0')}
            </div>
            <button className="w-full py-3 bg-rose-600 rounded-xl font-black text-xs animate-pulse">실시간 매치 진입</button>
          </Card>
        </aside>

        {/* 중앙 섹션 */}
        <div className="lg:col-span-6 space-y-6">
          <Card live className="p-0 bg-[#060b18]">
            <div className="p-4 border-b border-indigo-500/30 flex justify-between items-center">
              <span className="text-xs font-black uppercase flex items-center gap-2"><Radio className="w-4 h-4 text-rose-500" /> AI 라이브 트래커</span>
              <Badge variant="live">LIVE 72'</Badge>
            </div>
            <div className="h-48 bg-emerald-900/10 relative overflow-hidden">
              <PitchBackground sport="축구" opacity="opacity-[0.1]" />
              <div className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_yellow] transition-all duration-1000" style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }} />
            </div>
          </Card>
        </div>

        {/* 오른쪽 섹션 */}
        <aside className="lg:col-span-3">
          <Card className="p-5 border-indigo-500/20">
            <h3 className="text-xs font-black text-indigo-400 uppercase mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> 스마트 머니 흐름</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-bold text-indigo-400">
                LAL VS 보스턴 <span className="float-right text-white">$1.24M</span>
              </div>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}