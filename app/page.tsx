'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Zap, BarChart3, Bell, User, ArrowUpRight, Globe2, 
  RefreshCw, Trophy, Activity, Radio, Skull, Timer, Menu, Bookmark, 
  Star, PenTool, Award, Crown, Calculator, Volume2
} from 'lucide-react';

// --- UI 컴포넌트 ---
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

  // 스블(블로거) 가짜 데이터 생성
  const bloggers = Array.from({length: 20}, (_, i) => ({
    id: i + 1, rank: i + 1, name: `User_${1000 + i}`, points: 50000 - (i * 1000)
  }));

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setDropTimer(prev => (prev > 0 ? prev - 1 : 299)), 1000);
    const l = setInterval(() => setBallPos({ x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 }), 3000);
    return () => { clearInterval(t); clearInterval(l); };
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen">
      <style jsx global>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: ticker 30s linear infinite; }
      `}</style>

      {/* 헤더 */}
      <nav className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-800/50 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <Menu className="text-slate-400 cursor-pointer" />
          <h1 className="text-xl font-black italic">SPICKER <span className="text-emerald-500 text-xs">스픽커</span></h1>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"><User className="text-white w-5 h-5" /></div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 왼쪽: 폭락 레이더 */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="p-5 border-rose-500/40">
            <h3 className="text-xs font-black text-rose-400 uppercase mb-4 flex items-center gap-2"><Timer className="w-4 h-4" /> 배당 폭락 감지</h3>
            <div className="text-4xl font-mono font-black text-rose-500 text-center py-6">
              {Math.floor(dropTimer/60)}:{(dropTimer%60).toString().padStart(2,'0')}
            </div>
            <button className="w-full py-4 bg-rose-600 rounded-xl font-black text-xs">실시간 매치 진입</button>
          </Card>
        </aside>

        {/* 중앙: 트래커 + 스블 랭킹 */}
        <div className="lg:col-span-6 space-y-6">
          {/* AI 트래커 */}
          <Card live className="bg-[#060b18] overflow-hidden">
            <div className="p-4 border-b border-indigo-500/30 flex justify-between items-center bg-indigo-950/20">
              <span className="text-xs font-black uppercase flex items-center gap-2"><Radio className="w-4 h-4 text-rose-500" /> AI 라이브 트래커</span>
              <Badge variant="live">LIVE 72'</Badge>
            </div>
            <div className="h-56 bg-emerald-900/10 relative">
               <div className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_yellow] transition-all duration-1000" style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }} />
            </div>
          </Card>

          {/* 스블 랭킹 전광판 (새로 추가) */}
          <div className="overflow-hidden bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
            <h3 className="text-xs font-black text-fuchsia-400 uppercase mb-3 px-2">스블 TOP 랭킹 전광판</h3>
            <div className="animate-ticker">
              <div className="flex gap-4">
                {bloggers.map(b => (
                  <div key={b.id} className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-48">
                    <span className="text-emerald-500 font-black text-xs">{b.rank}</span>
                    <span className="text-white text-xs font-bold truncate">{b.name}</span>
                    <span className="text-[10px] text-slate-500">{b.points}P</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 스마트 머니 */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="p-5 border-indigo-500/20">
            <h3 className="text-xs font-black text-indigo-400 uppercase mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> 스마트 머니 흐름</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
                LAL VS 보스턴 <span className="float-right text-indigo-400">$1.24M</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
                아스널 VS 맨시티 <span className="float-right text-indigo-400">$850K</span>
              </div>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}