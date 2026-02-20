'use client';

import React, { useState, useEffect, useRef } from 'react';
// 누락되었던 아이콘들을 임포트했습니다.
import { 
  Menu, Volume2, Bell, User, Radio, RefreshCw, Globe2, TrendingUp, Zap, Activity, PenTool, Search 
} from 'lucide-react';

// ══════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════
const BLOGGERS = Array.from({ length: 30 }, (_, i) => ({
  id: i+1, rank: i+1,
  name: ["ALPHA_7","SharpKing","WhaleHunter","OddsBreaker","DataPro","BetGenius","EdgeMaster","ProfitX","StatGod","TipLord","QuickEdge","ValueBet","MoneyLine","PickMaster","SharpEye","BetLogic","OddsHawk","TipKing","ProPick","WinRate"][i%20]+(i>=20?`_${i}`:""),
  pts: 100000-i*1900, win: (81.3-i*0.9).toFixed(1),
  grade: ["루키","실버","골드","플래티넘","다이아","마스터","그랜드마스터","크리스탈"][Math.min(Math.floor(i/4),7)],
  gc: ["#64748b","#94a3b8","#fbbf24","#06b6d4","#6366f1","#8b5cf6","#ec4899","#00d4ff"][Math.min(Math.floor(i/4),7)],
  streak: (i%8)+1, profit:`+${(120-i*2.5).toFixed(1)}%`,
}));

const DROPS = [
  {match:"아스날 vs 맨시티",before:2.40,after:1.85,pct:-22.9,league:"EPL",urgency:"CRITICAL"},
  {match:"PSG vs 바이에른",before:3.10,after:2.45,pct:-21.0,league:"UCL",urgency:"HIGH"},
  {match:"레이커스 vs 골스",before:2.80,after:2.30,pct:-17.9,league:"NBA",urgency:"HIGH"},
  {match:"도르트문트 vs 바이에른",before:3.50,after:2.95,pct:-15.7,league:"분데스",urgency:"MEDIUM"},
];

const WHALES = [
  {match:"ARS vs MCI",type:"SHARP",tag:"HOME",vol:"$2.14M",conf:94,delta:"+18.2%",books:["bet365","Pinnacle"]},
  {match:"LAL vs PHX",type:"SYNDICATE",tag:"UNDER",vol:"$1.38M",conf:87,delta:"+12.7%",books:["Unibet","William"]},
  {match:"PSG vs BAY",type:"SHARP",tag:"DRAW",vol:"$980K",conf:81,delta:"+9.4%",books:["bet365","Betfair"]},
];

const SHAREBET = [
  {match:"리버풀 vs 맨시티",gap:"+13.1%",b1:{n:"bet365",v:2.10},b2:{n:"Unibet",v:1.92},profit:"보장 +4.2%",type:"SUPERBET",hot:true},
  {match:"LAL vs PHO",gap:"+9.8%",b1:{n:"William",v:2.35},b2:{n:"Betfair",v:2.18},profit:"보장 +3.1%",type:"ARBI",hot:false},
];

const TICKER_TEXT = "⚡ 아스날 홈 배당 -22.9% 급락 감지  ·  🐋 신디케이트 $2.1M PSG 진입  ·  🔴 살라 결장 확정  ·  💹 유럽 샤프머니 $14.7M 이동 중";

// ══════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════
function useInterval(cb: any, ms: any) {
  const r = useRef(cb);
  useEffect(() => { r.current = cb; });
  useEffect(() => { const id = setInterval(() => r.current(), ms); return () => clearInterval(id); }, [ms]);
}

// ══════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════
function SpickerLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa"/><stop offset="50%" stopColor="#818cf8"/><stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a"/><stop offset="100%" stopColor="#312e81"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#lg2)"/>
      <path d="M10 18 L10 30 L16 30 L24 36 L24 12 L16 18 Z" fill="url(#lg1)"/>
      <circle cx="38" cy="10" r="4" fill="#ef4444"/>
    </svg>
  );
}

function AnalogDigit({ n, color = "#f59e0b", size = 52 }: any) {
  const s = size;
  const w = s * 0.55, h = s;
  const sw = s * 0.09, gap = s * 0.04;
  const dim = "rgba(255,255,255,.06)";
  const segs: any = {
    top: { on: [0,2,3,5,6,7,8,9] }, tl: { on: [0,4,5,6,8,9] }, tr: { on: [0,1,2,3,4,7,8,9] },
    mid: { on: [2,3,4,5,6,8,9] }, bl: { on: [0,2,6,8] }, br: { on: [0,1,3,4,5,6,7,8,9] }, bot: { on: [0,2,3,5,6,8,9] },
  };
  const active = (seg: any) => segs[seg].on.includes(n) ? color : dim;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={sw+gap} y={gap} width={w-2*(sw+gap)} height={sw} rx={sw/2} fill={active("top")} />
      <rect x={gap} y={sw+gap*2} width={sw} height={h/2-sw-gap*2} rx={sw/2} fill={active("tl")} />
      <rect x={w-sw-gap} y={sw+gap*2} width={sw} height={h/2-sw-gap*2} rx={sw/2} fill={active("tr")} />
      <rect x={sw+gap} y={h/2-sw/2} width={w-2*(sw+gap)} height={sw} rx={sw/2} fill={active("mid")} />
      <rect x={gap} y={h/2+sw/2+gap} width={sw} height={h/2-sw-gap*2} rx={sw/2} fill={active("bl")} />
      <rect x={w-sw-gap} y={h/2+sw/2+gap} width={sw} height={h/2-sw-gap*2} rx={sw/2} fill={active("br")} />
      <rect x={sw+gap} y={h-sw-gap} width={w-2*(sw+gap)} height={sw} rx={sw/2} fill={active("bot")} />
    </svg>
  );
}

// ══════════════════════════════════════════════════
// MAIN APPLICATION
// ══════════════════════════════════════════════════
export default function App() {
  const [mounted, setMounted] = useState(false);
  const [timer, setTimer] = useState(299);
  const [ballPos, setBallPos] = useState({ x: 48, y: 52 });
  const [liveOdds, setLiveOdds] = useState({ home: 3.45, draw: 2.10, away: 1.85 });
  const [sideOpen, setSideOpen] = useState(true);

  useEffect(() => { setMounted(true); }, []);
  useInterval(() => setTimer(t => t > 0 ? t - 1 : 299), 1000);
  useInterval(() => {
    setBallPos({ x: Math.random() * 64 + 18, y: Math.random() * 60 + 20 });
    setLiveOdds(prev => ({
      home: +Math.max(1.1, prev.home + (Math.random() * .14 - .07)).toFixed(2),
      draw: +Math.max(1.1, prev.draw + (Math.random() * .08 - .04)).toFixed(2),
      away: +Math.max(1.1, prev.away + (Math.random() * .12 - .06)).toFixed(2),
    }));
  }, 2800);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#010409", color: "#e2e8f0", fontFamily: "sans-serif", overflowX: "hidden" }}>
      <style>{`
        @keyframes spk-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: spk-ticker 35s linear infinite; }
      `}</style>

      {/* HEADER */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(1,4,9,.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.05)", height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Menu style={{ color: "#64748b", cursor: "pointer" }} onClick={() => setSideOpen(!sideOpen)} />
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <SpickerLogo size={32} />
            <h1 style={{ fontSize: "20px", fontWeight: 900, color: "#fff", fontStyle: "italic", marginLeft: "10px" }}>SPICKER</h1>
          </div>
        </div>
        <div style={{ flex: 1, margin: "0 40px", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <span className="animate-ticker" style={{ fontSize: "11px", color: "#475569" }}>{TICKER_TEXT} &nbsp;&nbsp; {TICKER_TEXT}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Bell style={{ color: "#64748b" }} />
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(to bottom right, #10b981, #0f766e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User style={{ color: "white", width: "24px" }} />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: "1600px", margin: "0 auto", padding: "32px", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "24px" }}>
        
        {/* LEFT: DROP RADAR */}
        <aside style={{ gridColumn: "span 3" }}>
          <div style={{ background: "rgba(13,17,23,0.8)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <span style={{ fontSize: "10px", fontWeight: 900, color: "#ef4444", letterSpacing: "1px" }}>DROP RADAR</span>
            </div>
            <div style={{ fontSize: "64px", fontWeight: 900, color: "#ef4444", textAlign: "center", marginBottom: "32px", fontFamily: "monospace" }}>
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {DROPS.map((d, i) => (
                <div key={i} style={{ padding: "12px", background: "rgba(239,68,68,0.05)", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.1)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800 }}>{d.match}</div>
                  <div style={{ fontSize: "14px", fontWeight: 900, color: "#ef4444", marginTop: "4px" }}>{d.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER: AI TRACKER */}
        <div style={{ gridColumn: "span 6" }}>
          <div style={{ background: "rgba(13,17,23,0.8)", borderRadius: "24px", border: "1px solid rgba(99,102,241,0.2)", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", fontWeight: 900 }}>AI REAL-TIME TRACKER</span>
              <span style={{ color: "#ef4444", fontWeight: 900, fontSize: "10px" }}>LIVE</span>
            </div>
            <div style={{ height: "300px", position: "relative", background: "#060b18" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", gap: "10px", background: "rgba(0,0,0,0.5)", padding: "15px", borderRadius: "16px" }}>
                <AnalogDigit n={0} size={50} /><AnalogDigit n={1} size={50} />
              </div>
              <div style={{ position: "absolute", width: "14px", height: "14px", background: "#fbbf24", borderRadius: "50%", left: `${ballPos.x}%`, top: `${ballPos.y}%`, transition: "all 2.8s ease-in-out", boxShadow: "0 0 20px #fbbf24" }} />
            </div>
            <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", background: "rgba(0,0,0,0.2)" }}>
              {Object.entries(liveOdds).map(([key, val]) => (
                <div key={key} style={{ textAlign: "center", padding: "12px", background: "#0d1117", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <div style={{ fontSize: "9px", color: "#475569", marginBottom: "4px" }}>{key.toUpperCase()}</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, fontFamily: "monospace" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: WHALE TRACKER */}
        <aside style={{ gridColumn: "span 3" }}>
          <div style={{ background: "rgba(13,17,23,0.8)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(99,102,241,0.2)", height: "100%" }}>
            <span style={{ fontSize: "10px", fontWeight: 900, color: "#6366f1", letterSpacing: "1px" }}>WHALE TRACKER</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              {WHALES.map((w, i) => (
                <div key={i} style={{ padding: "16px", background: "rgba(99,102,241,0.03)", borderRadius: "16px", border: "1px solid rgba(99,102,241,0.1)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 900 }}>{w.match}</div>
                  <div style={{ fontSize: "18px", fontWeight: 900, color: "#818cf8", marginTop: "8px" }}>{w.vol}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer style={{ position: "fixed", bottom: 0, width: "100%", height: "45px", background: "rgba(1,4,9,0.95)", borderTop: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", zIndex: 100 }}>
        <div style={{ display: "flex", gap: "30px" }}>
          <span style={{ fontSize: "9px", fontWeight: 900, color: "#334155" }}><RefreshCw style={{ width: "10px", marginRight: "5px", display: "inline" }} /> DATA SYNC ACTIVE</span>
          <span style={{ fontSize: "9px", fontWeight: 900, color: "#334155" }}><Globe2 style={{ width: "10px", marginRight: "5px", display: "inline" }} /> 32 GLOBAL BOOKIES</span>
        </div>
        <span style={{ fontSize: "9px", fontWeight: 900, color: "#1e293b" }}>SPICKER PROTOCOL v1.0.8</span>
      </footer>
    </div>
  );
}