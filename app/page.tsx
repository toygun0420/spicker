'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  TrendingUp, Globe, Zap, Target, BarChart3, Search, Bell, User, 
  ArrowUpRight, ShieldCheck, Globe2, RefreshCw, ChevronRight, Plus, 
  Trophy, Filter, Activity, Monitor, Menu, Home, MessageSquare, 
  AlertTriangle, X, Bookmark, Star, PenTool, Medal, Award, Crown, 
  Calculator, Volume2, Skull, Timer, Radio, Sun, Moon 
} from 'lucide-react';

export default function App() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans min-h-screen transition-colors duration-500">
      {/* 상단 네비게이션 */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
              {isDrawerOpen ? <X /> : <Menu />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Volume2 className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter italic">
                SPICKER <span className="text-emerald-500 text-sm ml-1">스픽커</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* ☀️/🌙 테마 토글 버튼 */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="relative p-2.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#020617]"></span>
            </button>
            
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xl">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-20">
        <div className="text-center space-y-4">
           <h2 className="text-4xl md:text-6xl font-black text-emerald-500 tracking-tighter">
             SPICKER LIVE DEPLOYED
           </h2>
           <p className="text-xl text-slate-500 dark:text-slate-400 font-bold">
             상단의 해/달 버튼을 눌러 테마 전환을 확인하세요.
           </p>
           <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <Zap className="w-10 h-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-black mb-2">슈퍼벳 레이더</h3>
                <p className="text-sm text-slate-500">실시간 무위험 배당 스캔 가동 중</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <Skull className="w-10 h-10 text-rose-500 mb-4" />
                <h3 className="text-xl font-black mb-2">대중의 함정</h3>
                <p className="text-sm text-slate-500">스마트 머니 역배팅 데이터 분석</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <PenTool className="w-10 h-10 text-fuchsia-500 mb-4" />
                <h3 className="text-xl font-black mb-2">스블 (블로거)</h3>
                <p className="text-sm text-slate-500">상위 1% 팁스터 랭킹 추적</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}