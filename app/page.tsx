'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Bell, ChevronRight, Crown, Globe2, Menu, PenTool, Radio, 
  RefreshCw, Search, Timer, User, Volume2, Zap, ArrowUpRight 
} from 'lucide-react';

// ══════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════
const BLOGGERS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, rank: i + 1,
  name: ["ALPHA_7","SharpKing","WhaleHunter","OddsBreaker","DataPro","BetGenius"][i%6] + (i > 6 ? `_${i}` : ""),
  grade: i < 3 ? "LEGEND" : "ELITE",
  gc: i < 3 ? "#fbbf24" : "#8b5cf6",
  win: (85 - i * 0.5).toFixed(1)
}));

const WHALES = [
  { match: "ARS vs MCI", vol: "$2.14M", conf: 94 },
  { match: "LAL vs PHX", vol: "$1.38M", conf: 87 },
  { match: "PSG vs BAY", vol: "$980K", conf: 81 },
];

const DROPS = [
  { match: "아스날 vs 맨시티", before: 2.40, after: 1.85, pct: -22.9 },
  { match: "PSG vs 바이에른", before: 3.10, after: 2.45, pct: -21.0 },
];

// ══════════════════════════════════════════════════
// COMPONENTS (표준 CSS 스타일 적용)
// ══════════════════════════════════════════════════
function AnalogDigit({ n, color = "#f59e0b", size = 52 }: any) {
  const s = size;
  const w = s * 0.55, h = s;
  const sw = s * 0.09, gap = s * 0.04;
  const dim = "rgba(255,255,255,.04)";
  const segs: any = {
    top: { on: [0,2,3,5,6,7,8,9] },
    tl: { on: [0,4,5,6,8,9] },
    tr: { on: [0,1,2,3,4,7,8,9] },
    mid: { on: [2,3,4,5,6,8,9] },
    bl: { on: [0,2,6,8] },
    br: { on: [0,1,3,4,5,6,7,8,9] },
    bot: { on: [0,2,3,5,6,8,9] },
  };
  const active = (seg: any) => segs[seg].on.includes(n) ? color : dim;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ filter: segs.top.on.includes(n) ? `drop-shadow(0 0 4px ${color})` : 'none' }}>
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

function GlassCard({ children, glow = null, style = {} }: any) {
  return (
    <div style={{ 
      background: "rgba(13, 17, 23, 0.75)", 
      backdropFilter: "blur(30px)", 
      WebkitBackdropFilter: "blur(30px)",
      border: `1px solid ${glow ? glow + "40" : "rgba(255,255,255,0.06)"}`, 
      borderRadius: "2rem", 
      overflow: "hidden", 
      boxShadow: glow ? `0 0 50px ${glow}15` : "none",
      ...style 
    }}>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════
// MAIN APPLICATION
// ══════════════════════════════════════════════════
export default function App() {
  const [mounted, setMounted] = useState(false);
  const [timer, setTimer] = useState(290);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [liveOdds, setLiveOdds] = useState({ home: 3.53, draw: 2.06, away: 1.88 });

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setTimer(prev => (prev > 0 ? prev - 1 : 290)), 1000);
    const l = setInterval(() => {
      setBallPos({ x: Math.random() * 60 + 20, y: Math.random() * 40 + 30 });
      setLiveOdds(prev => ({
        home: +(prev.home + (Math.random() * 0.1 - 0.05)).toFixed(2),
        draw: +(prev.draw + (Math.random() * 0.04 - 0.02)).toFixed(2),
        away: +(prev.away + (Math.random() * 0.1 - 0.05)).toFixed(2),
      }));
    }, 3500);
    return () => { clearInterval(t); clearInterval(l); };
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#010409", color: "#e2e8f0", fontFamily: "sans-serif", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spk-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; width: max-content; animation: spk-ticker 35s linear infinite; }
        .pitch-grid { background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 25px 25px; }
      `}} />

      {/* HEADER */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(1,4,9,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Menu style={{ color: "#64748b", cursor: "pointer" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", background: "#10b981", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}>
              <Volume2 style={{ color: "white", width: "24px", height: "24px" }} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-1px", color: "white", fontStyle: "italic" }}>SPICKER</h1>
          </div>
        </div>
        
        <div style={{ flex: 1, margin: "0 60px", background: "rgba(255,255,255,0.03)", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.05)", padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Search style={{ width: "16px", color: "#475569" }} />
          <input type="text" placeholder="검색어를 입력하세요..." style={{ background: "transparent", border: "none", color: "#e2e8f0", fontSize: "13px", outline: "none", width: "100%" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <Bell style={{ color: "#64748b", cursor: "pointer" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "15px", borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "25px" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", fontWeight: 900, color: "white", margin: 0 }}>Master_Axon</p>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#10b981", margin: "2px 0 0 0" }}>• NODE CONNECTED</p>
            </div>
            <div style={{ width: "45px", height: "45px", borderRadius: "14px", background: "linear-gradient(to bottom right, #10b981, #0f766e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User style={{ color: "white", width: "24px" }} />
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: "1700px", margin: "0 auto", padding: "40px", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "30px" }}>
        
        {/* LEFT: DROP RADAR */}
        <aside style={{ gridColumn: "span 3" }}>
          <GlassCard glow="#ef4444" style={{ padding: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 900, color: "#ef4444", letterSpacing: "2px" }}>DROP RADAR</span>
              <div style={{ background: "#ef4444", color: "white", fontSize: "8px", fontWeight: 900, padding: "3px 6px", borderRadius: "5px" }}>CRITICAL</div>
            </div>
            <div style={{ fontSize: "80px", fontWeight: 900, color: "#ef4444", textAlign: "center", margin: "40px 0", fontFamily: "monospace", textShadow: "0 0 30px rgba(239,68,68,0.5)" }}>
              {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,"0")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {DROPS.map((d, i) => (
                <div key={i} style={{ padding: "15px", background: "rgba(239,68,68,0.05)", borderRadius: "15px", border: "1px solid rgba(239,68,68,0.1)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800 }}>{d.match}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", alignItems: "center" }}>
                    <span style={{ color: "#ef4444", fontWeight: 900, fontSize: "16px" }}>{d.pct}%</span>
                    <span style={{ fontSize: "10px", color: "#475569" }}>{d.before} → {d.after}</span>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", marginTop: "30px", padding: "18px", borderRadius: "15px", background: "#ef4444", border: "none", color: "white", fontWeight: 900, fontSize: "11px", cursor: "pointer", boxShadow: "0 10px 20px rgba(239,68,68,0.2)" }}>SECURE ENTRY NOW</button>
          </GlassCard>
        </aside>

        {/* CENTER: TRACKER */}
        <div style={{ gridColumn: "span 6", display: "flex", flexDirection: "column", gap: "30px" }}>
          <GlassCard glow="#6366f1">
             <div style={{ padding: "20px 30px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                 <Radio style={{ width: "16px", color: "#ef4444" }} />
                 <span style={{ fontSize: "11px", fontWeight: 900 }}>AI REAL-TIME TRACKER</span>
               </div>
               <div style={{ color: "#ef4444", fontSize: "10px", fontWeight: 900, border: "1px solid rgba(239,68,68,0.3)", padding: "4px 8px", borderRadius: "6px" }}>72' IN-PLAY</div>
             </div>
             
             <div style={{ height: "350px", position: "relative", background: "#060b18", overflow: "hidden" }} className="pitch-grid">
               {/* Analog Scoreboard IN CENTER */}
               <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", gap: "15px", background: "rgba(0,0,0,0.6)", padding: "25px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", zIndex: 10 }}>
                  <AnalogDigit n={0} size={70} />
                  <div style={{ width: "8px", height: "8px", background: "#f59e0b", borderRadius: "50%", alignSelf: "center", boxShadow: "0 0 10px #f59e0b" }} />
                  <AnalogDigit n={1} size={70} />
               </div>
               {/* Ball */}
               <div style={{ position: "absolute", width: "20px", height: "20px", background: "#fbbf24", borderRadius: "50%", left: `${ballPos.x}%`, top: `${ballPos.y}%`, transition: "all 3.5s ease-in-out", boxShadow: "0 0 30px #fbbf24", zIndex: 5 }} />
             </div>

             <div style={{ padding: "30px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", background: "rgba(0,0,0,0.3)" }}>
                {Object.entries(liveOdds).map(([key, val], i) => (
                  <div key={key} style={{ textAlign: "center", padding: "15px", background: "#0d1117", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: "10px", color: "#475569", fontWeight: 900, marginBottom: "8px" }}>{key.toUpperCase()}</div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: i === 2 ? "#10b981" : "white", fontFamily: "monospace" }}>{val}</div>
                  </div>
                ))}
             </div>
          </GlassCard>

          {/* BLOGGER TICKER */}
          <GlassCard style={{ padding: "25px" }}>
            <div style={{ overflow: "hidden" }}>
              <div className="animate-ticker">
                {BLOGGERS.map(b => (
                  <div key={b.id} style={{ minWidth: "220px", padding: "15px", background: "rgba(22,27,34,0.6)", borderRadius: "20px", margin: "0 12px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 900, color: "#475569" }}>{b.rank}</span>
                    <div style={{ width: "35px", height: "35px", borderRadius: "10px", background: b.gc + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User style={{ width: "16px", color: b.gc }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 900 }}>{b.name}</div>
                      <div style={{ fontSize: "9px", color: b.gc, fontWeight: 700, marginTop: "2px" }}>{b.grade} • {b.win}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT: WHALE TRACKER */}
        <aside style={{ gridColumn: "span 3" }}>
           <GlassCard glow="#6366f1" style={{ padding: "30px", height: "100%" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom: "35px", alignItems:"center" }}>
                <span style={{ fontSize: "11px", fontWeight: 900, color: "#6366f1", letterSpacing: "2px" }}>WHALE TRACKER</span>
                <div style={{ width: "6px", height: "6px", background: "#6366f1", borderRadius: "50%" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                {WHALES.map((w, i) => (
                  <div key={i} style={{ padding: "25px", background: "rgba(99,102,241,0.03)", borderRadius: "25px", border: "1px solid rgba(99,102,241,0.1)" }}>
                    <div style={{ fontSize: "13px", fontWeight: 900, color: "white" }}>{w.match}</div>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: "#818cf8", margin: "12px 0", fontFamily: "monospace" }}>{w.vol}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                       <span style={{ fontSize: "10px", color: "#475569", fontWeight: 700 }}>CONFIDENCE</span>
                       <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: 900 }}>{w.conf}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", marginTop: "40px", padding: "15px", borderRadius: "15px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", fontSize: "10px", fontWeight: 900, cursor: "pointer" }}>VIEW FULL REPORT</button>
           </GlassCard>
        </aside>
      </main>

      {/* FOOTER */}
      <footer style={{ position: "fixed", bottom: 0, width: "100%", height: "45px", background: "rgba(1,4,9,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", zIndex: 100 }}>
         <div style={{ display: "flex", gap: "30px" }}>
            <span style={{ fontSize: "9px", fontWeight: 900, color: "#334155" }}><RefreshCw style={{ width: "10px", color: "#10b981", marginRight: "5px" }} /> DATA SYNC ACTIVE</span>
            <span style={{ fontSize: "9px", fontWeight: 900, color: "#334155" }}><Globe2 style={{ width: "10px", color: "#6366f1", marginRight: "5px" }} /> 32 GLOBAL BOOKIES</span>
         </div>
         <span style={{ fontSize: "9px", fontWeight: 900, color: "#1e293b", fontFamily: "monospace" }}>SPICKER PROTOCOL v1.0.7 ALPHA</span>
      </footer>
    </div>
  );
}