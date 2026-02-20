import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Globe, 
  Zap, 
  Target, 
  BarChart3, 
  Search, 
  Bell, 
  User, 
  ArrowUpRight, 
  ShieldCheck, 
  Globe2,
  RefreshCw,
  ChevronRight,
  Plus,
  Trophy,
  Filter,
  Activity,
  Monitor,
  Menu,
  Home,
  MessageSquare,
  AlertTriangle,
  X,
  Bookmark,
  Star,
  PenTool,
  Medal,
  Award,
  Crown,
  Calculator,
  Volume2,
  Skull,
  Timer,
  Radio
} from 'lucide-react';

// --- Global CSS for Marquee & Animations ---
const injectStyles = () => {
  if (typeof window !== 'undefined' && !document.getElementById('spicker-styles')) {
    const style = document.createElement('style');
    style.id = 'spicker-styles';
    style.innerHTML = `
      @keyframes ticker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-ticker {
        display: flex;
        width: max-content;
        animation: ticker 40s linear infinite;
      }
      .animate-ticker:hover {
        animation-play-state: paused;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      @keyframes flash-green {
        0%, 100% { color: inherit; text-shadow: none; }
        50% { color: #34d399; text-shadow: 0 0 10px rgba(52,211,153,0.8); }
      }
      .flash-number {
        animation: flash-green 1s ease-in-out;
      }
      @keyframes flash-red {
        0%, 100% { color: inherit; text-shadow: none; }
        50% { color: #f43f5e; text-shadow: 0 0 10px rgba(244,63,94,0.8); }
      }
      .flash-number-red {
        animation: flash-red 1s ease-in-out;
      }
    `;
    document.head.appendChild(style);
  }
};

// --- UI Utility Components ---

const Card = ({ children, className = "", highlight = false, trap = false, live = false }) => (
  <div className={`relative bg-slate-900/40 backdrop-blur-xl border ${live ? 'border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.2)]' : trap ? 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : highlight ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-slate-800/60'} rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:border-slate-500 group ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className="" }) => {
  const styles = {
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

const LiveIndicator = ({ color = "rose" }) => (
  <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${color}-500`}></span>
  </span>
);

const PitchBackground = ({ sport, opacity = "opacity-[0.03]" }) => {
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
  } else if (sport === '농구') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${opacity} pointer-events-none`} viewBox="0 0 400 200" preserveAspectRatio="none">
        <rect x="10" y="10" width="380" height="180" fill="none" stroke="white" strokeWidth="2" />
        <line x1="200" y1="10" x2="200" y2="190" stroke="white" strokeWidth="2" />
        <circle cx="200" cy="100" r="20" fill="none" stroke="white" strokeWidth="2" />
        <path d="M 10 30 Q 100 30 100 100 Q 100 170 10 170" fill="none" stroke="white" strokeWidth="2" />
        <path d="M 390 30 Q 300 30 300 100 Q 300 170 390 170" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    );
  } else if (sport === '야구') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${opacity} pointer-events-none`} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <path d="M 200 180 L 100 90 L 200 10 L 300 90 Z" fill="none" stroke="white" strokeWidth="2" />
        <path d="M 100 90 Q 200 130 300 90" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="200" cy="90" r="5" fill="white" />
      </svg>
    );
  }
  return null;
};

const getLevelData = (rank) => {
  if (rank <= 3) return { levelName: '크리스탈', icon: <Crown className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"/>, color: 'text-cyan-300' };
  if (rank <= 10) return { levelName: '금트로피', icon: <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]"/>, color: 'text-yellow-400' };
  if (rank <= 20) return { levelName: '은트로피', icon: <Trophy className="w-5 h-5 text-slate-300"/>, color: 'text-slate-300' };
  if (rank <= 30) return { levelName: '동트로피', icon: <Award className="w-5 h-5 text-orange-600"/>, color: 'text-orange-600' };
  return { levelName: '루키', icon: <Activity className="w-5 h-5 text-emerald-500"/>, color: 'text-emerald-500' };
};

const bloggers = Array.from({length: 40}, (_, i) => ({
   id: i + 1,
   rank: i + 1,
   name: `User_${Math.floor(1000 + Math.random() * 9000)}`,
   points: Math.floor(100000 / (i + 1)) + Math.floor(Math.random() * 100),
   ...getLevelData(i + 1)
}));

const chunkedBloggers = [];
for (let i = 0; i < bloggers.length; i += 4) {
   chunkedBloggers.push(bloggers.slice(i, i + 4));
}
const doubleChunkedBloggers = [...chunkedBloggers, ...chunkedBloggers];

export default function App() {
  injectStyles();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState([0, 2]); 
  
  const [volume, setVolume] = useState(8.4);
  const [whaleMoney, setWhaleMoney] = useState(1.2);
  const [flashTick, setFlashTick] = useState(0);
  const [oddsPulse, setOddsPulse] = useState(false);
  const [dropTimer, setDropTimer] = useState(299); 
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [liveEventText, setLiveEventText] = useState("중원 싸움 (Midfield)");
  const [liveOdds, setLiveOdds] = useState({ home: 3.45, draw: 2.10, away: 1.85 });

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(prev => +(prev + Math.random() * 0.05).toFixed(2));
      setWhaleMoney(prev => +(prev + Math.random() * 0.02).toFixed(2));
      setFlashTick(prev => prev + 1);
      setOddsPulse(prev => !prev);
    }, 2500);

    const timerInterval = setInterval(() => {
      setDropTimer(prev => (prev > 0 ? prev - 1 : 299));
    }, 1000);

    const liveEngine = setInterval(() => {
      const events = [
        { text: "위험한 공격 (Dangerous Attack)", x: Math.random() * 30 + 70, y: Math.random() * 80 + 10 },
        { text: "코너킥 (Corner Kick)", x: 95, y: 5 },
        { text: "볼 점유 (Possession)", x: Math.random() * 40 + 30, y: Math.random() * 40 + 30 },
        { text: "역습 (Counter Attack)", x: Math.random() * 30, y: Math.random() * 80 + 10 }
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setBallPos({ x: randomEvent.x, y: randomEvent.y });
      setLiveEventText(randomEvent.text);

      if (randomEvent.x > 70) {
        setLiveOdds(prev => ({ ...prev, home: +(prev.home - 0.1).toFixed(2), away: +(prev.away + 0.05).toFixed(2) }));
      } else if (randomEvent.x < 30) {
        setLiveOdds(prev => ({ ...prev, home: +(prev.home + 0.1).toFixed(2), away: +(prev.away - 0.05).toFixed(2) }));
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
      clearInterval(liveEngine);
    };
  }, []);

  const toggleBookmark = (id) => {
    setBookmarkedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden relative min-h-screen text-[15px]">
      
      {/* --- OFFCANVAS DRAWER MENU --- */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#060b18] border-r border-slate-800 p-6 z-50 flex flex-col justify-between transition-transform duration-700 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="flex items-center gap-3 mb-10 mt-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Volume2 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white italic">
              SPICKER <span className="text-emerald-500 text-sm italic font-bold ml-1 tracking-tight">스픽커</span>
            </h1>
          </div>

          <nav className="space-y-6">
            {[
              { title: '스블 (블로거)', icon: <PenTool className="w-5 h-5 text-fuchsia-400" />, subtitle: '나만의 픽과 정보 공유' },
              { title: '배당 폭락 레이더', icon: <Timer className="w-5 h-5 text-rose-500" />, subtitle: '실시간 폭락 5분 전 감지' },
              { title: '대중의 함정 (Trap)', icon: <Skull className="w-5 h-5 text-amber-500" />, subtitle: '스마트 머니 역배팅 스캔' },
              { title: '라이브 AI 트래커', icon: <Radio className="w-5 h-5 text-indigo-400" />, subtitle: '실시간 2D 경기 분석' },
              { title: '슈퍼벳 레이더', icon: <Zap className="w-5 h-5 text-emerald-400" />, subtitle: '실시간 무위험 배당 스캔' },
              { title: '나의 관심 픽', icon: <Bookmark className="w-5 h-5 text-amber-400" />, subtitle: '저장된 쉐어벳 & 조합' }
            ].map((menu, idx) => (
              <a key={idx} href="#" className="flex items-center gap-4 group">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:border-emerald-500/50 transition-colors">
                  {menu.icon}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-200 group-hover:text-emerald-400 transition-colors">{menu.title}</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">{menu.subtitle}</p>
                </div>
              </a>
            ))}
          </nav>
        </div>
        
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-xl"></div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">VIP Membership</span>
            <LiveIndicator color="emerald" />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight font-bold mb-4 relative z-10">현재 모든 해외 프리미엄 데이터 및 라이브 트래커에 접근 가능합니다.</p>
          <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-[#020617] text-[11px] font-black uppercase rounded-xl transition-colors relative z-10">
            등급 업그레이드
          </button>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsDrawerOpen(false)}></div>
      )}

      {/* --- MAIN APP CONTAINER --- */}
      <div className={`relative z-10 bg-[#020617] min-h-screen transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pb-20 md:pb-8 ${isDrawerOpen ? 'lg:translate-x-72 lg:rounded-l-[2.5rem] lg:overflow-hidden lg:border-l lg:border-slate-800' : 'translate-x-0'}`}>
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] grayscale contrast-125 mix-blend-overlay z-0 fixed">
           <img src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover" />
        </div>

        {/* Global Navigation */}
        <nav className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-800/50">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-10">
              <button className="p-2 text-slate-400 hover:text-white" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                {isDrawerOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsDrawerOpen(false)}>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-500">
                  <Volume2 className="text-white w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex flex-col leading-none">
                  <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white italic flex items-baseline">
                    SPICKER <span className="text-emerald-500 text-[11px] md:text-sm italic font-black ml-1.5 tracking-tight">스픽커</span>
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="hidden xl:flex items-center gap-8 text-xs font-black uppercase tracking-[0.2em] absolute left-1/2 -translate-x-1/2">
              {['스블 (블로거)', '라이브 트래커', '대중의 함정', '배당 폭락 레이더'].map((item, idx) => (
                <a key={item} href="#" className={`relative transition-all group py-2 ${idx === 1 ? 'text-rose-400' : 'text-slate-500 hover:text-white'}`}>
                  {item}
                  {idx === 1 && <span className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>}
                  <span className={`absolute bottom-0 left-0 h-0.5 transition-all ${idx === 1 ? 'w-full bg-rose-400' : 'w-0 bg-white group-hover:w-full'}`}></span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="스블 닉네임, 경기, 결장 검색..." className="pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all w-64 placeholder:text-slate-600" />
              </div>
              <button className="relative p-2 md:p-2.5 text-slate-400 hover:text-white bg-slate-900/50 rounded-xl border border-slate-800">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
              </button>
              <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-white uppercase tracking-tight">Master_Axon</p>
                  <p className="text-[10px] text-emerald-400 font-mono font-bold">PRO NODE</p>
                </div>
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xl cursor-pointer border border-emerald-400/30">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className={`max-w-[1600px] mx-auto px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 relative z-10 transition-opacity duration-300 ${isDrawerOpen ? 'lg:opacity-50' : 'opacity-100'}`}>
          
          {/* ==========================================
              LEFT SIDE: Drop Radar & Surebet 
          ========================================== */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5">
            
            {/* Drop Radar (배당 폭락 카운트다운) */}
            <Card className="p-4 md:p-5 relative overflow-hidden border-rose-500/40 bg-gradient-to-br from-rose-950/40 to-transparent">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               
               <div className="flex items-center justify-between mb-4 relative z-10">
                 <h3 className="text-xs font-black text-rose-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Timer className="w-4 h-4 text-rose-500" /> 배당 폭락 감지 레이더
                 </h3>
                 <Badge variant="live">EMERGENCY</Badge>
               </div>
              
              <div className="bg-slate-950/80 rounded-xl border border-rose-500/30 p-4 text-center relative z-10">
                 <p className="text-[11px] font-black text-slate-300 mb-2">맨시티 홀란드 결장 <span className="text-rose-400">오피셜 확정</span></p>
                 <p className="text-[10px] text-slate-400 break-keep leading-snug mb-3">글로벌 배팅 사이트들이 배당률을 수정하기 전입니다. 홈 승리 배당이 <span className="text-white font-bold">1.85 ➔ 1.40</span>으로 폭락할 예정입니다.</p>
                 
                 <div className="flex items-center justify-center gap-3">
                   <div className="text-3xl font-mono font-black text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)] tracking-widest">
                     {formatTime(dropTimer)}
                   </div>
                   <div className="flex flex-col text-left">
                     <span className="text-[9px] text-rose-400/80 font-black uppercase">Time Left</span>
                     <span className="text-[10px] text-white font-bold">To Drop</span>
                   </div>
                 </div>
              </div>
              <button className="w-full mt-4 py-3 text-[11px] font-black uppercase bg-rose-600 text-white hover:bg-rose-500 rounded-xl transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)] relative z-10 animate-pulse">
                폭락 전 당장 진입하기
              </button>
            </Card>

            {/* 슈퍼벳 레이더 (Surebet Radar) */}
            <Card className="p-4 md:p-5 bg-gradient-to-br from-amber-600/10 to-transparent border-amber-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-amber-400 flex items-center gap-2 uppercase tracking-widest">
                  <Zap className="w-4 h-4 fill-amber-400" /> 슈퍼벳 레이더
                </h3>
                <LiveIndicator color="amber" />
              </div>
              <div className="space-y-3">
                {[
                  { match: '리버풀 vs 맨시티', profit: '+13.10%', bookies: 'Pin / B365', trend: 'up' },
                  { match: 'LAL vs PHO', profit: '+3.28%', bookies: 'Bov / 1x', trend: 'stable' },
                  { match: '뉴욕Y vs LA다저스', profit: '+8.45%', bookies: 'Uni / Betf', trend: 'up' }
                ].map((bet, i) => (
                  <div key={i} className="group cursor-pointer p-2.5 hover:bg-slate-800/40 rounded-xl transition-all border border-transparent hover:border-amber-500/20">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[11px] font-black truncate pr-2 group-hover:text-amber-400 transition-colors">{bet.match}</p>
                      <span className="text-amber-400 font-mono text-xs font-black">{bet.profit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{bet.bookies}</p>
                      {bet.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-amber-400">
                무위험 수익 포착 리스트
              </button>
            </Card>

          </aside>

          {/* ==========================================
              CENTER: Main Intelligence Hub (Live Tracker)
          ========================================== */}
          <div className="col-span-1 lg:col-span-6 space-y-5 md:space-y-6 flex flex-col w-full overflow-hidden">
            
            {/* Live Match AI Tracker (Bet365 Style) */}
            <Card live={true} className="p-0 overflow-hidden flex flex-col w-full bg-[#060b18]">
              <div className="px-5 py-3 flex items-center justify-between bg-indigo-950/40 border-b border-indigo-500/30">
                 <div className="flex items-center gap-2">
                   <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                   <h3 className="text-xs font-black text-white uppercase tracking-widest">AI 선정 라이브 탑 매치</h3>
                 </div>
                 <Badge variant="live">LIVE 72'</Badge>
              </div>
              
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">A</div>
                  <span className="text-base font-black text-white">아스널</span>
                </div>
                <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="text-2xl font-black text-white font-mono">0</span>
                  <span className="text-slate-600 font-black">-</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">1</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-white">맨시티</span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">M</div>
                </div>
              </div>

              <div className="px-5 pb-4">
                <div className="relative w-full h-32 md:h-40 bg-emerald-900/30 border border-emerald-500/30 rounded-xl overflow-hidden shadow-inner">
                   <PitchBackground sport="축구" opacity="opacity-[0.1]" />
                   <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-rose-500/10 to-transparent"></div>
                   <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent"></div>

                   <div 
                     className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,1)] transition-all duration-1000 ease-in-out z-10"
                     style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%`, transform: 'translate(-50%, -50%)' }}
                   />

                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                     <span key={liveEventText} className="bg-[#020617]/80 px-4 py-1.5 rounded-full text-xs md:text-sm font-black text-white uppercase tracking-widest backdrop-blur-md border border-slate-700 animate-pulse shadow-xl">
                       {liveEventText}
                     </span>
                   </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-3">
                 <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest whitespace-nowrap">실시간 배당</div>
                 <div className="flex gap-2 w-full">
                    <div className="flex-1 bg-[#020617] border border-slate-800 rounded-lg py-1.5 px-3 flex justify-between items-center group cursor-pointer hover:border-indigo-500/50">
                      <span className="text-[10px] text-slate-500 font-bold">1 (Home)</span>
                      <span key={liveOdds.home} className={`text-xs font-mono font-black text-white transition-all ${oddsPulse ? 'flash-number-red' : ''}`}>{liveOdds.home.toFixed(2)}</span>
                    </div>
                    <div className="flex-1 bg-[#020617] border border-slate-800 rounded-lg py-1.5 px-3 flex justify-between items-center group cursor-pointer hover:border-indigo-500/50">
                      <span className="text-[10px] text-slate-500 font-bold">X (Draw)</span>
                      <span key={liveOdds.draw} className={`text-xs font-mono font-black text-white transition-all ${oddsPulse ? 'flash-number' : ''}`}>{liveOdds.draw.toFixed(2)}</span>
                    </div>
                    <div className="flex-1 bg-[#020617] border border-slate-800 rounded-lg py-1.5 px-3 flex justify-between items-center group cursor-pointer hover:border-indigo-500/50">
                      <span className="text-[10px] text-slate-500 font-bold">2 (Away)</span>
                      <span key={liveOdds.away} className={`text-xs font-mono font-black text-white transition-all ${oddsPulse ? 'flash-number' : ''}`}>{liveOdds.away.toFixed(2)}</span>
                    </div>
                 </div>
              </div>
            </Card>

            {/* SBLOGGER TOP 100 (Seamless Marquee) */}
            <div className="w-full flex flex-col gap-2 shrink-0 overflow-hidden">
               <div className="flex items-center justify-between px-2 mb-1">
                  <h3 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                    <PenTool className="w-4 h-4 md:w-5 md:h-5 text-fuchsia-400" /> 스블 (스픽커 블로거) TOP 100
                  </h3>
                  <Badge variant="primary" className="border-none bg-fuchsia-500/20 text-fuchsia-400">Live Ranking</Badge>
               </div>
               
               <div className="flex overflow-hidden w-full relative">
                  <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="animate-ticker flex gap-4 w-max">
                    {doubleChunkedBloggers.map((chunk, colIdx) => (
                      <div key={colIdx} className="w-[280px] sm:w-[320px] flex flex-col gap-1.5 bg-slate-900/50 p-2.5 rounded-2xl border border-slate-800/80">
                         {chunk.map(blogger => (
                            <div key={`${colIdx}-${blogger.id}`} className="flex items-center justify-between p-2 hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer group">
                               <div className="flex items-center gap-2.5">
                                  <span className={`font-black text-xs md:text-sm w-5 text-center ${blogger.rank <= 3 ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]' : 'text-slate-500'}`}>
                                    {blogger.rank}
                                  </span>
                                  <div className={`w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner group-hover:scale-110 transition-transform ${blogger.rank <= 3 ? 'border-amber-500/30' : ''}`}>
                                     {blogger.icon}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-xs md:text-sm font-black text-white group-hover:text-fuchsia-400 transition-colors truncate w-24 md:w-32">{blogger.name}</span>
                                     <span className={`text-[10px] font-black mt-0.5 tracking-tighter ${blogger.color}`}>{blogger.levelName}</span>
                                  </div>
                               </div>
                               <div className="flex flex-col items-end">
                                  <span className="text-[10px] md:text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                    {blogger.points.toLocaleString()} P
                                  </span>
                               </div>
                            </div>
                         ))}
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Match List Filters */}
            <div className="flex items-center justify-between px-2 border-b border-slate-800/50 pb-3 mt-1 w-full">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto pr-4">
                {['ALL', '축구', '농구', '야구', 'E-SPORTS'].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 md:px-5 py-2 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Matches List (Public Trap Highlighted) */}
            <div className="space-y-5 md:space-y-6 flex-1 w-full pb-4">
              {[
                { id: 0, sport: '축구', league: '프리미어리그', home: '첼시', away: '토트넘', time: '04:00', hOdds: 2.15, dOdds: 3.65, aOdds: 2.30, aiPick: 'Home Win', confidence: 94, surebet: true, surebetData: { home: 461500, draw: 0, away: 538500, profit: 130675 } },
                { id: 1, sport: '농구', league: 'NBA 파이널', home: 'LA 레이커스', away: '보스턴', time: '09:00', hOdds: 1.85, dOdds: null, aOdds: 1.95, aiPick: 'Away Handicap', confidence: 88, surebet: false, isTrap: true }
              ].map((m, i) => (
                <Card key={i} className="p-4 md:p-6 relative flex flex-col w-full" highlight={m.surebet} trap={m.isTrap}>
                  <PitchBackground sport={m.sport} />
                  <div className="relative z-10 w-full">
                    
                    <div className="flex flex-wrap items-center justify-between mb-5 w-full gap-3">
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="primary">{m.league}</Badge>
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <LiveIndicator color={m.isTrap ? "rose" : "slate"} />
                          <span className="text-[10px] md:text-xs text-slate-400 font-mono font-bold uppercase tracking-widest">{m.time} LIVE</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-auto shrink-0">
                        {m.isTrap && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                            <Skull className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[10px] md:text-xs font-black text-rose-400 uppercase tracking-widest">대중의 함정 (Trap) 감지</span>
                          </div>
                        )}
                        {m.surebet && (
                          <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1 md:py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-[10px] md:text-xs font-black text-amber-400 uppercase tracking-widest md:tracking-[0.1em]">슈퍼벳 +₩{m.surebetData.profit.toLocaleString()} 확정</span>
                          </div>
                        )}
                        <button onClick={() => toggleBookmark(m.id)} className="p-2 bg-slate-900/80 rounded-full hover:bg-slate-800 transition-colors border border-slate-700/50 z-20">
                          <Bookmark className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${bookmarkedItems.includes(m.id) ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500'}`} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 mb-6 bg-slate-950/40 rounded-2xl border border-slate-800/50 py-5 md:py-6 px-4 w-full">
                      <div className="flex items-center justify-center gap-3 md:gap-5 w-full">
                        <div className="text-right flex-1">
                          <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none tracking-tighter break-keep">{m.home}</h4>
                        </div>
                        <div className="flex flex-col items-center justify-center px-2 md:px-4 shrink-0">
                          <span className="text-slate-600 font-black text-lg md:text-xl italic tracking-widest">VS</span>
                        </div>
                        <div className="text-left flex-1">
                          <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none tracking-tighter break-keep">{m.away}</h4>
                        </div>
                      </div>
                      
                      {m.isTrap && (
                         <div className="w-full mt-4 bg-[#020617] border border-rose-500/30 p-3 rounded-xl flex flex-col gap-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-rose-400">개미 (Public) 92%</span>
                             <span className="text-indigo-400">고래 (Whale) 8%</span>
                           </div>
                           <div className="w-full h-2 rounded-full overflow-hidden flex">
                             <div className="bg-rose-500 h-full w-[92%]"></div>
                             <div className="bg-indigo-500 h-full w-[8%]"></div>
                           </div>
                           <p className="text-slate-400 text-[11px] font-bold text-center mt-1 break-keep">
                             🚨 일반인 92%가 홈 승리에 물려있습니다. AI는 <span className="text-indigo-400">스마트머니(고래)</span>를 따라 원정 역배를 추천합니다.
                           </p>
                         </div>
                      )}
                    </div>

                    <div className="w-full flex items-center justify-between p-3 md:p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mb-4 group hover:bg-emerald-500/10 transition-colors">
                       <div className="flex items-center gap-3">
                         <Monitor className="w-5 h-5 text-emerald-500/50" />
                         <div className="flex flex-col">
                           <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-none mb-1">AI 딥러닝 예측</p>
                           <p className="text-base font-black text-white uppercase leading-none">{m.aiPick}</p>
                         </div>
                       </div>
                       <div className="flex flex-col items-end w-1/3">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1.5">Certainty: {m.confidence}%</p>
                         <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-[2000ms] shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${m.confidence}%` }}></div>
                         </div>
                       </div>
                    </div>

                    {m.surebet && m.surebetData && (
                      <div className="mb-4 w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 md:p-4">
                        <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-2">
                           <span className="text-[11px] md:text-xs font-black text-amber-400 tracking-widest flex items-center gap-2">
                             <Calculator className="w-4 h-4" /> 100만 원 분산 배팅 가이드 (무위험)
                           </span>
                           <span className="text-[10px] text-amber-500/70 font-bold uppercase">슈퍼벳 적중</span>
                        </div>
                        <div className="flex gap-2">
                           <div className="flex-1 bg-[#020617] border border-slate-800 rounded-lg p-2 text-center">
                             <p className="text-[10px] text-slate-500 font-bold mb-1">승 (Pin)</p>
                             <p className="text-xs font-mono font-black text-white">₩ {m.surebetData.home.toLocaleString()}</p>
                           </div>
                           {m.surebetData.draw > 0 && (
                             <div className="flex-1 bg-[#020617] border border-slate-800 rounded-lg p-2 text-center">
                               <p className="text-[10px] text-slate-500 font-bold mb-1">무 (Betf)</p>
                               <p className="text-xs font-mono font-black text-white">₩ {m.surebetData.draw.toLocaleString()}</p>
                             </div>
                           )}
                           <div className="flex-1 bg-[#020617] border border-slate-800 rounded-lg p-2 text-center">
                             <p className="text-[10px] text-slate-500 font-bold mb-1">패 (B365)</p>
                             <p className="text-xs font-mono font-black text-white">₩ {m.surebetData.away.toLocaleString()}</p>
                           </div>
                           <div className="flex-1 bg-amber-500/20 border border-amber-500/40 rounded-lg p-2 text-center flex flex-col justify-center">
                             <p className="text-[10px] text-amber-500 font-black mb-0.5">확정 수익</p>
                             <p className="text-sm font-mono font-black text-amber-400">+₩ {m.surebetData.profit.toLocaleString()}</p>
                           </div>
                        </div>
                      </div>
                    )}

                    {!m.surebet && (
                      <div className="flex gap-2 w-full">
                        {[
                          { label: 'Home', odds: m.hOdds },
                          { label: 'Draw', odds: m.dOdds },
                          { label: 'Away', odds: m.aOdds }
                        ].filter(o => o.odds !== null).map((item, idx) => (
                          <div key={idx} className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl p-3 md:p-4 text-center transition-all hover:border-emerald-500/50 hover:-translate-y-1 cursor-pointer group/odds">
                            <p className="text-[10px] md:text-xs text-slate-500 font-black mb-1 md:mb-2 uppercase tracking-tighter">{item.label}</p>
                            <p className={`text-lg md:text-xl font-mono font-black transition-all duration-700 ${oddsPulse && idx === 0 ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'text-white'}`}>
                              {item.odds.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 md:mt-5 pt-4 border-t border-slate-800/40 flex items-center justify-between w-full">
                       <div className="flex gap-4 md:gap-8 overflow-hidden">
                          <div className="flex items-center gap-1.5 md:gap-2.5 text-[10px] md:text-xs text-slate-500 uppercase font-black tracking-widest whitespace-nowrap">
                            <Globe2 className="w-4 h-4 text-emerald-500/50" /> 38 Bookies
                          </div>
                          <div className="flex items-center gap-1.5 md:gap-2.5 text-[10px] md:text-xs text-slate-500 uppercase font-black tracking-widest whitespace-nowrap">
                            <BarChart3 className="w-4 h-4 text-emerald-500/50" /> Vol: <span key={flashTick} className="flash-number">${volume}M</span>
                          </div>
                       </div>
                       <button className="flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-widest hover:text-white transition-colors shrink-0 whitespace-nowrap">
                          정밀 리포트 보기 <ArrowUpRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* ==========================================
              RIGHT SIDE: Whale Tracker -> Watchlist -> Injury
          ========================================== */}
          <aside className="col-span-1 lg:col-span-3 space-y-5 md:space-y-6 flex flex-col h-fit">
            
            {/* 1. 고래 자금 흐름 추적 (Whale Tracker) - Moved to Right Top */}
            <Card className="p-4 md:p-5 relative overflow-hidden border-indigo-500/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               
               <div className="flex items-center justify-between mb-4 relative z-10">
                 <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" /> 스마트 머니 흐름
                 </h3>
                 <Badge variant="primary">LIVE</Badge>
               </div>
              
              <div className="space-y-3 relative z-10">
                {[
                  { match: 'LAL VS 보스턴', amount: `$${whaleMoney.toFixed(2)}M`, target: 'LAL 언더 (Under)', time: '방금 전', type: 'Sharp' },
                  { match: '아스널 VS 맨시티', amount: '$850K', target: '아스널 승 (Home)', time: '12분 전', type: 'Syndicate' },
                  { match: '토트넘 VS 첼시', amount: '$620K', target: '무승부 (Draw)', time: '18분 전', type: 'Sharp' }
                ].map((w, i) => (
                  <div key={i} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col gap-1.5 group cursor-pointer hover:border-indigo-500/30 transition-colors">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-black text-white group-hover:text-indigo-400 transition-colors tracking-tighter">{w.match}</p>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{w.time}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#020617] px-2.5 py-1.5 rounded-lg border border-slate-800 mt-1">
                      <span className="text-[11px] font-black text-slate-300">{w.target}</span>
                      <span key={flashTick} className={`text-xs font-mono font-black text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)] ${i===0 ? 'flash-number' : ''}`}>{w.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 text-xs font-black uppercase text-indigo-400 hover:text-indigo-300 transition-all border-t border-slate-800/50 pt-3 relative z-10 flex justify-center items-center gap-1">
                글로벌 자본 추적기 <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </Card>

            {/* 2. VIP Watchlist (나의 관심 픽) - Dynamic Height (No flex-1) */}
            <Card className="flex flex-col p-4 md:p-5 bg-[#0a0f1e]/90 border-slate-800 h-fit relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"></div>
               
               <div className="flex justify-between items-center mb-5">
                  <h4 className="text-[11px] md:text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-emerald-500 fill-emerald-500" /> 나의 관심 픽
                  </h4>
                  <Badge variant="success">VIP ONLY</Badge>
               </div>

               <div className="space-y-4">
                  <div className="p-3 md:p-4 bg-slate-950 rounded-2xl border border-amber-500/40 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-xs md:text-sm font-black text-white tracking-tighter">리버풀 VS 맨시티</span>
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="bg-[#020617] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between mt-3">
                         <div className="flex flex-col">
                           <span className="text-[9px] text-slate-500 font-bold uppercase">100만 원 양방 배팅</span>
                           <span className="text-[10px] font-black text-amber-500 tracking-tighter mt-1">경기 후 확정 수익</span>
                         </div>
                         <span className="font-black text-amber-400 text-sm md:text-base font-mono drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">+₩ 130,675</span>
                      </div>
                  </div>

                  <div className="p-3 md:p-4 bg-slate-950 rounded-2xl border border-slate-800 relative cursor-pointer hover:border-emerald-500/40 transition-colors">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] md:text-xs font-black text-white">뉴욕Y VS LA다저스</span>
                          <Bookmark className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs shadow-inner">🇺🇸</div>
                        <div className="flex flex-col">
                          <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">VegasShark VIP 픽</span>
                          <span className="text-[10px] md:text-xs font-black text-emerald-400 mt-0.5">Away Handicap (-1.5)</span>
                        </div>
                      </div>
                  </div>
               </div>
               <button className="w-full mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-800 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors flex justify-center items-center gap-1">
                 관심 목록 모두 보기 <ChevronRight className="w-3 h-3" />
               </button>
            </Card>

            {/* 3. AI Injury & Absence Intelligence (결장자 정보 - COMPACT VERSION) */}
            <Card className="p-4 relative overflow-hidden border-rose-500/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               
               <h3 className="text-[10px] md:text-xs font-black text-rose-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> AI 결장/부상 특급 정보
               </h3>
              
              <div className="space-y-2 relative z-10">
                {[
                  { player: 'K. De Bruyne', team: '맨시티', status: '출전 불가 확정', impact: 'High', color: 'rose' },
                  { player: 'LeBron James', team: 'LA 레이커스', status: '출전 시간 제한 (25m)', impact: 'Medium', color: 'amber' },
                  { player: 'Vini Jr.', team: '레알 마드리드', status: '오전 훈련 불참 (의심)', impact: 'High', color: 'rose' }
                ].map((p, i) => (
                  <div key={i} className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col gap-1 group cursor-pointer hover:border-rose-500/30 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-[10px] md:text-[11px] font-black text-white group-hover:text-rose-400 transition-colors">{p.player}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">{p.team}</p>
                      </div>
                      <span className={`text-[7px] md:text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-${p.color}-500/20 text-${p.color}-400`}>
                        Impact: {p.impact}
                      </span>
                    </div>
                    <div className="text-[8px] md:text-[9px] font-bold text-slate-300 bg-slate-900 px-1.5 py-1 rounded w-fit border border-slate-800">
                      <span className={`text-${p.color}-400`}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-1.5 text-[9px] md:text-[10px] font-black uppercase text-rose-400 hover:text-rose-300 transition-all border-t border-slate-800/50 pt-2 relative z-10 flex justify-center items-center gap-1">
                전체 의료 리포트 <ArrowUpRight className="w-3 h-3" />
              </button>
            </Card>

            {/* VIP Social Feed (For continuity) */}
            <Card className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] md:text-xs font-black text-slate-300 flex items-center gap-2 uppercase tracking-widest">
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-fuchsia-400" /> VIP 소셜 번역
                </h3>
              </div>
              <div className="space-y-2 relative">
                 {[
                   { author: 'Vegas Whale', text: "인사이더: 레이커스 주전 출전 시간 제한. 언더(Under)에 큰 돈 들어가는 중.", time: '14m ago' }
                 ].map((feed, i) => (
                   <div key={i} className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50 group cursor-pointer hover:border-fuchsia-500/30 transition-all">
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-[9px] md:text-[10px] font-black text-white">{feed.author}</span>
                         <span className="text-[8px] font-bold text-slate-600 uppercase">{feed.time}</span>
                      </div>
                      <p className="text-[9px] md:text-[10px] text-slate-400 leading-snug break-keep group-hover:text-slate-200 transition-colors">
                         {feed.text}
                      </p>
                   </div>
                 ))}
              </div>
            </Card>

          </aside>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#020617]/95 backdrop-blur-xl border-t border-slate-800 px-6 py-3 flex justify-between items-center z-50">
          <button className="flex flex-col items-center gap-1 text-emerald-500">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Feed</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors">
            <Radio className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Live</span>
          </button>
          <button className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl -mt-8 border-[3px] border-[#020617] flex items-center justify-center shadow-[0_10px_20px_rgba(16,185,129,0.4)] text-white">
            <Plus className="w-6 h-6" />
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors">
            <Zap className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Radar</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">My</span>
          </button>
        </div>

        {/* Real-time Ticker Footer (Desktop Only) */}
        <footer className="hidden lg:flex fixed bottom-0 w-full bg-[#020617]/95 backdrop-blur-2xl border-t border-slate-900 px-10 py-3 items-center justify-between text-[11px] font-black text-slate-500 z-50">
          <div className="flex gap-12 items-center">
            <span className="flex items-center gap-3"><LiveIndicator color="emerald" /> Node Latency: <span key={flashTick} className="flash-number">4ms</span></span>
            <span className="flex items-center gap-3 text-emerald-500 uppercase tracking-widest font-black"><Globe2 className="w-4 h-4" /> Global Feed: 1.42M Transactions</span>
          </div>
          <div className="flex gap-10 uppercase tracking-[0.3em] font-black">
             <span className="text-emerald-500 flex items-center gap-2 animate-pulse cursor-pointer">
               <RefreshCw className="w-3.5 h-3.5" /> Auto-Sync Active
             </span>
          </div>
        </footer>
      </div>
    </div>
  );
}