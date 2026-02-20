'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes'; // 테마 훅 추가
import { 
  TrendingUp, Globe, Zap, Target, BarChart3, Search, Bell, User, 
  ArrowUpRight, ShieldCheck, Globe2, RefreshCw, ChevronRight, Plus, 
  Trophy, Filter, Activity, Monitor, Menu, Home, MessageSquare, 
  AlertTriangle, X, Bookmark, Star, PenTool, Medal, Award, Crown, 
  Calculator, Volume2, Skull, Timer, Radio, Sun, Moon // Sun, Moon 아이콘 추가
} from 'lucide-react';

// --- CSS Injector ---
const injectStyles = () => {
  if (typeof window !== 'undefined' && !document.getElementById('spicker-styles')) {
    const style = document.createElement('style');
    style.id = 'spicker-styles';
    style.innerHTML = `
      @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-ticker { display: flex; width: max-content; animation: ticker 40s linear infinite; }
      .animate-ticker:hover { animation-play-state: paused; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes flash-green { 0%, 100% { color: inherit; text-shadow: none; } 50% { color: #34d399; text-shadow: 0 0 10px rgba(52,211,153,0.8); } }
      .flash-number { animation: flash-green 1s ease-in-out; }
      @keyframes flash-red { 0%, 100% { color: inherit; text-shadow: none; } 50% { color: #f43f5e; text-shadow: 0 0 10px rgba(244,63,94,0.8); } }
      .flash-number-red { animation: flash-red 1s ease-in-out; }
    `;
    document.head.appendChild(style);
  }
};

// --- Utilities ---
const Card = ({ children, className = "", highlight = false, trap = false, live = false }) => (
  <div className={`relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border ${live ? 'border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2)]' : trap ? 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : highlight ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-slate-200 dark:border-slate-800/60'} rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:border-slate-300 dark:hover:border-slate-500 group ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className="" }) => {
  const styles = {
    default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    success: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
    danger: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30",
    warning: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    primary: "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30",
    live: "bg-rose-600 text-white border border-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.6)] animate-pulse"
  };
  return <span className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap ${styles[variant] || styles.default} ${className}`}>{children}</span>;
};

// ... (중간의 PitchBackground, getLevelData 로직은 기존과 동일하므로 공간상 생략 없이 그대로 유지됩니다. 파일에 붙여넣으실 때 기존 함수들을 이 자리에 두시면 됩니다)

export default function App() {
  injectStyles();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState([0, 2]); 
  
  useEffect(() => {
    setMounted(true); // 테마 마운트 확인
  }, []);

  // ... (기존 useEffect 타이머 로직 동일하게 유지)

  // SSR 에러 방지를 위해 마운트 전에는 빈 화면 렌더링
  if (!mounted) return null;

  return (
    // 배경을 화이트모드(slate-50) / 다크모드(#020617)로 분기
    <div className="bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden relative min-h-screen text-[15px] transition-colors duration-500">
      
      {/* 글로벌 네비게이션바 */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/50 transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-10">
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-500" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
              {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsDrawerOpen(false)}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Volume2 className="text-white w-4 h-4 md:w-5 md:h-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white italic flex items-baseline">
                SPICKER <span className="text-emerald-500 text-[11px] md:text-sm italic font-black ml-1.5 tracking-tight">스픽커</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            {/* ☀️/🌙 테마 토글 버튼 추가 */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2 md:p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="relative p-2 md:p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#020617] animate-pulse"></span>
            </button>
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xl cursor-pointer">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* 중앙 메인 콘텐츠 예시 (기존 코드의 요소들을 감싸는 부분) */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        {/* ... (이 위치에 기존의 Drop Radar, Live Tracker 등 세팅하신 본문을 그대로 넣으시면 모두 테마 전환 효과를 받습니다) ... */}
        
        <div className="col-span-1 lg:col-span-12 w-full text-center py-20">
           <h2 className="text-2xl font-black text-emerald-500">테마 적용 완료! (여기에 본문 코드가 들어갑니다)</h2>
           <p className="text-slate-500 mt-2">상단의 해/달 버튼을 눌러보세요.</p>
        </div>
      </main>
    </div>
  );
}