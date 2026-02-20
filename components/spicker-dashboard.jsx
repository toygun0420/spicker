'use client';

import { useState, useEffect, useRef, useId } from "react";

// ══════════════════════════════════════════════════
// DATA  (no Math.random at module level → hydration safe)
// ══════════════════════════════════════════════════
const BLOGGER_NAMES = ["ALPHA_7","SharpKing","WhaleHunter","OddsBreaker","DataPro","BetGenius","EdgeMaster","ProfitX","StatGod","TipLord","QuickEdge","ValueBet","MoneyLine","PickMaster","SharpEye","BetLogic","OddsHawk","TipKing","ProPick","WinRate"];
const BLOGGER_GRADES = ["루키","실버","골드","플래티넘","다이아","마스터","그랜드마스터","크리스탈"];
const BLOGGER_COLORS = ["#64748b","#94a3b8","#fbbf24","#06b6d4","#6366f1","#8b5cf6","#ec4899","#00d4ff"];
const BLOGGER_ICONS  = ["🥉","🥈","🥇","💎","🔷","🔮","👑","🏆"];
const BLOGGERS = Array.from({ length: 30 }, (_, i) => ({
  id: i+1, rank: i+1,
  name: BLOGGER_NAMES[i%20] + (i>=20 ? `_${i}` : ""),
  pts: 100000 - i*1900,
  win: (81.3 - i*0.9).toFixed(1),
  grade: BLOGGER_GRADES[Math.min(Math.floor(i/4),7)],
  gc:    BLOGGER_COLORS[Math.min(Math.floor(i/4),7)],
  streak: (i%8)+1,                     // deterministic, no Math.random
  profit: `+${(120 - i*2.5).toFixed(1)}%`,
}));

const DROPS = [
  {match:"아스날 vs 맨시티", before:2.40, after:1.85, pct:-22.9, league:"EPL",   urgency:"CRITICAL"},
  {match:"PSG vs 바이에른",  before:3.10, after:2.45, pct:-21.0, league:"UCL",   urgency:"HIGH"},
  {match:"레이커스 vs 골스", before:2.80, after:2.30, pct:-17.9, league:"NBA",   urgency:"HIGH"},
  {match:"도르트문트 vs 바이에른", before:3.50, after:2.95, pct:-15.7, league:"분데스", urgency:"MEDIUM"},
];
const WHALES = [
  {match:"ARS vs MCI", type:"SHARP",     tag:"HOME",  vol:"$2.14M", conf:94, delta:"+18.2%", books:["bet365","Pinnacle"]},
  {match:"LAL vs PHX", type:"SYNDICATE", tag:"UNDER", vol:"$1.38M", conf:87, delta:"+12.7%", books:["Unibet","William"]},
  {match:"PSG vs BAY", type:"SHARP",     tag:"DRAW",  vol:"$980K",  conf:81, delta:"+9.4%",  books:["bet365","Betfair"]},
];
const SHAREBET_DATA = [
  {match:"리버풀 vs 맨시티", gap:"+13.1%", b1:{n:"bet365",v:2.10}, b2:{n:"Unibet",v:1.92}, profit:"보장 +4.2%", type:"SUPERBET", hot:true},
  {match:"LAL vs PHO",       gap:"+9.8%",  b1:{n:"William",v:2.35}, b2:{n:"Betfair",v:2.18}, profit:"보장 +3.1%", type:"ARBI",    hot:false},
];
const INJURED = [
  {player:"살라",    team:"리버풀",  pos:"FW", status:"결장", reason:"햄스트링", impact:"HIGH", league:"EPL",   flag:"🇬🇧"},
  {player:"음바페",  team:"PSG",    pos:"FW", status:"의심", reason:"발목",    impact:"HIGH", league:"UCL",   flag:"🇫🇷"},
  {player:"할란드",  team:"맨시티",  pos:"FW", status:"복귀", reason:"복귀 확정",impact:"HIGH", league:"EPL",   flag:"🇳🇴"},
  {player:"비니시우스",team:"레알",  pos:"FW", status:"결장", reason:"근육",    impact:"MED",  league:"라리가", flag:"🇧🇷"},
  {player:"르브론",  team:"레이커스",pos:"SF", status:"의심", reason:"무릎",    impact:"HIGH", league:"NBA",   flag:"🇺🇸"},
  {player:"케인",    team:"바이에른",pos:"FW", status:"복귀", reason:"복귀 확정",impact:"HIGH", league:"분데스", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
];
const SOCIAL_VIP = [
  {src:"@Fabrizio_Romano", platform:"X", flag:"🇮🇹", followers:"21.4M", text:"할란드 아스날전 선발 100% 확정. 맨시티 측 공식 발표 임박. 배당 영향 예상됨.", time:"14분 전",  hot:true,  sport:"⚽", verified:true},
  {src:"@StatsBomb",        platform:"X", flag:"🇬🇧", followers:"580K",  text:"맨시티 xG 지난 5경기 평균 2.87. 아스날 수비 블록 대비 슈팅 허용률 역대 최저.", time:"38분 전",  hot:false, sport:"📊", verified:true},
  {src:"@ShamsCharania",    platform:"X", flag:"🇺🇸", followers:"7.2M",  text:"LeBron James 오늘 경기 QUESTIONABLE. 무릎 통증으로 훈련 제한. 결장 가능성 40%.", time:"1시간 전", hot:true,  sport:"🏀", verified:true},
  {src:"@DiMarzio",         platform:"X", flag:"🇮🇹", followers:"3.8M",  text:"PSG, 바이에른전 3백 전술 채택 확정. 음바페 선발 여부는 당일 결정.", time:"2시간 전", hot:false, sport:"⚽", verified:true},
];
const AI_PICKS = [
  {id:1, match:"아스날 vs 맨시티", league:"EPL", pick:"맨시티 승",  odds:1.85, conf:94, ev:"+8.4%", reason:"할란드 복귀 + 홈 배당 급락 + 샤프머니 집중",    tier:"GOLD",   price:9900},
  {id:2, match:"PSG vs 바이에른",  league:"UCL", pick:"양팀득점",   odds:1.72, conf:88, ev:"+6.1%", reason:"양팀 공격력 최상위 + 음바페 출전 의심",         tier:"SILVER",  price:5900},
];
const WATCHLIST_INIT = [
  {match:"아스날 vs 맨시티", league:"EPL", time:"오늘 04:30", odds:{h:1.85, d:3.40, a:4.20}, note:"할란드 복귀 + 샤프머니 집중",   alert:true},
  {match:"PSG vs 바이에른",  league:"UCL", time:"오늘 05:00", odds:{h:1.65, d:3.80, a:5.00}, note:"음바페 출전 여부 확인 필요",    alert:false},
  {match:"레이커스 vs 골스", league:"NBA", time:"내일 12:30", odds:{h:2.30, d:null, a:1.65}, note:"르브론 컨디션 체크",            alert:true},
];
const TICKER_TEXT = "⚡ 아스날 홈 배당 -22.9% 급락 감지  ·  🐋 신디케이트 $2.1M PSG 진입  ·  🔴 살라 결장 확정  ·  💹 유럽 샤프머니 $14.7M 이동 중  ·  ⚡ 맨시티 원정 배당 사상 최저  ·  🔥 레이커스 MVP 부상 의심";
const NAV_ITEMS = [
  {icon:"🏠", label:"대시보드", t:"대시보드"},
  {icon:"📉", label:"배당 폭락",  t:"폭락"},
  {icon:"🐋", label:"고래 추적",  t:"고래"},
  {icon:"🏥", label:"결장자",     t:"결장"},
  {icon:"⚡", label:"슈퍼벳",    t:"슈퍼벳"},
  {icon:"🧠", label:"AI 픽",     t:"AI픽"},
  {icon:"📲", label:"소셜 VIP",   t:"소셜"},
  {icon:"⭐", label:"찜 목록",    t:"찜"},
  {icon:"🏆", label:"스블 랭킹",  t:"랭킹"},
];

// ══════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════
function useInterval(cb, ms) {
  const savedCb = useRef(cb);
  useEffect(() => { savedCb.current = cb; });
  useEffect(() => {
    const id = setInterval(() => savedCb.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}

// SSR-safe: start with null, set real value after mount
function useWindowWidth() {
  const [width, setWidth] = useState(null);
  useEffect(() => {
    setWidth(window.innerWidth);
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

// ══════════════════════════════════════════════════
// SPICKER SVG LOGO  (unique IDs via useId to avoid conflicts)
// ══════════════════════════════════════════════════
function SpickerLogo({ size = 36 }) {
  const uid = useId().replace(/:/g, "");
  const idBg = `spk-bg-${uid}`;
  const idFg = `spk-fg-${uid}`;
  const idGl = `spk-gl-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={idFg} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#60a5fa"/>
          <stop offset="50%"  stopColor="#818cf8"/>
          <stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
        <linearGradient id={idBg} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1e3a8a"/>
          <stop offset="100%" stopColor="#312e81"/>
        </linearGradient>
        <filter id={idGl} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${idBg})`}/>
      <rect width="48" height="48" rx="12" fill="none" stroke={`url(#${idFg})`} strokeWidth="1"/>
      {/* Speaker cone */}
      <path d="M10 18 L10 30 L16 30 L24 36 L24 12 L16 18 Z"
        fill={`url(#${idFg})`} style={{ filter:`url(#${idGl})` }}/>
      {/* Sound waves */}
      <path d="M27 20 Q31 24 27 28" stroke={`url(#${idFg})`} strokeWidth="2"   strokeLinecap="round" fill="none"/>
      <path d="M30 17 Q36 24 30 31" stroke={`url(#${idFg})`} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.75"/>
      <path d="M33 14.5 Q41 24 33 33.5" stroke={`url(#${idFg})`} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/>
      {/* AI live dot */}
      <circle cx="38" cy="10" r="4" fill="#ef4444"/>
      <circle cx="38" cy="10" r="2" fill="#fff"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════
// ANALOG 7-SEGMENT DIGIT
// ══════════════════════════════════════════════════
const SEG_MAP = {
  top: [0,2,3,5,6,7,8,9],
  tl:  [0,4,5,6,8,9],
  tr:  [0,1,2,3,4,7,8,9],
  mid: [2,3,4,5,6,8,9],
  bl:  [0,2,6,8],
  br:  [0,1,3,4,5,6,7,8,9],
  bot: [0,2,3,5,6,8,9],
};

function AnalogDigit({ n, color = "#f59e0b", size = 52 }) {
  const W = size * 0.55;
  const H = size;
  const sw = size * 0.09;
  const gap = size * 0.04;
  const DIM = "rgba(255,255,255,.06)";

  const isOn  = (seg) => SEG_MAP[seg].includes(n);
  const fill  = (seg) => isOn(seg) ? color : DIM;
  const glow  = (seg) => isOn(seg) ? { filter:`drop-shadow(0 0 3px ${color})` } : {};

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
      {/* top    */}<rect x={sw+gap}     y={gap}         width={W-2*(sw+gap)} height={sw} rx={sw/2} fill={fill("top")} style={glow("top")}/>
      {/* tl     */}<rect x={gap}        y={sw+gap*2}    width={sw} height={H/2-sw-gap*2}  rx={sw/2} fill={fill("tl")}  style={glow("tl")} />
      {/* tr     */}<rect x={W-sw-gap}   y={sw+gap*2}    width={sw} height={H/2-sw-gap*2}  rx={sw/2} fill={fill("tr")}  style={glow("tr")} />
      {/* mid    */}<rect x={sw+gap}     y={H/2-sw/2}    width={W-2*(sw+gap)} height={sw} rx={sw/2} fill={fill("mid")} style={glow("mid")}/>
      {/* bl     */}<rect x={gap}        y={H/2+sw/2+gap} width={sw} height={H/2-sw-gap*2} rx={sw/2} fill={fill("bl")}  style={glow("bl")} />
      {/* br     */}<rect x={W-sw-gap}   y={H/2+sw/2+gap} width={sw} height={H/2-sw-gap*2} rx={sw/2} fill={fill("br")}  style={glow("br")} />
      {/* bot    */}<rect x={sw+gap}     y={H-sw-gap}    width={W-2*(sw+gap)} height={sw} rx={sw/2} fill={fill("bot")} style={glow("bot")}/>
    </svg>
  );
}

function ScoreBoard({ h, a }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(0,0,0,.55)", borderRadius:14, padding:"8px 14px", border:"1px solid rgba(245,158,11,.25)", boxShadow:"0 0 20px rgba(245,158,11,.12)" }}>
      <AnalogDigit n={h} size={48}/>
      <div style={{ display:"flex", flexDirection:"column", gap:5, paddingBottom:4 }}>
        <div style={{ width:4, height:4, borderRadius:"50%", background:"#f59e0b", animation:"spk-dot-blink 1s ease-in-out infinite"        }}/>
        <div style={{ width:4, height:4, borderRadius:"50%", background:"#f59e0b", animation:"spk-dot-blink 1s ease-in-out infinite .5s"     }}/>
      </div>
      <AnalogDigit n={a} size={48}/>
    </div>
  );
}

// ══════════════════════════════════════════════════
// BASE UI PRIMITIVES
// ══════════════════════════════════════════════════
function Pulse({ color = "#3b82f6", size = 8 }) {
  return (
    <span style={{ position:"relative", display:"inline-flex", width:size, height:size, flexShrink:0 }}>
      <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:color, opacity:.6, animation:"spk-ping 1.3s infinite" }}/>
      <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:color }}/>
    </span>
  );
}

function Card({ children, glow = null, style = {} }) {
  return (
    <div style={{
      background:"rgba(10,15,30,0.75)",
      backdropFilter:"blur(28px)",
      WebkitBackdropFilter:"blur(28px)",
      border:`1px solid ${glow ? glow+"35" : "rgba(255,255,255,.07)"}`,
      borderRadius:18,
      overflow:"hidden",
      boxShadow: glow ? `0 0 32px ${glow}12, inset 0 1px 0 rgba(255,255,255,.05)` : "inset 0 1px 0 rgba(255,255,255,.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Tag({ children, color = "#3b82f6", pulse = false }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:99, background:color+"18", border:`1px solid ${color}35`, fontSize:10, fontWeight:900, color, letterSpacing:.8, textTransform:"uppercase", whiteSpace:"nowrap" }}>
      {pulse && <Pulse color={color} size={5}/>}
      {children}
    </span>
  );
}

function Bar({ pct, color = "#3b82f6" }) {
  return (
    <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,.05)", overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, background:`linear-gradient(90deg,${color},${color}99)`, transition:"width 1.2s ease" }}/>
    </div>
  );
}

function SectionHead({ icon, title, desc, right, onMore }) {
  return (
    <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3, flexWrap:"wrap" }}>
          {icon && <span style={{ fontSize:17 }}>{icon}</span>}
          {title && <span style={{ fontSize:16, fontWeight:900, color:"#f1f5f9", letterSpacing:-.3 }}>{title}</span>}
          {right}
        </div>
        {desc && <p style={{ fontSize:11, color:"#64748b", margin:0, letterSpacing:.2 }}>{desc}</p>}
      </div>
      {onMore && (
        <button onClick={onMore} style={{ flexShrink:0, marginLeft:10, padding:"4px 10px", borderRadius:8, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"#64748b", fontSize:10, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
          전체보기 →
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// GLOBAL STATS BAR — 가로 스크롤 마키 띠
// ══════════════════════════════════════════════════
function GlobalStats() {
  const stats = [
    {label:"글로벌 배팅사",  val:"32",     icon:"🌐", color:"#3b82f6"},
    {label:"실시간 경기",    val:"147",    icon:"⚽", color:"#06b6d4"},
    {label:"오늘 자금 이동", val:"$847M",  icon:"💹", color:"#6366f1"},
    {label:"샤프 머니",     val:"$14.7M", icon:"🐋", color:"#8b5cf6"},
    {label:"배당 폭락 감지", val:"23건",   icon:"📉", color:"#ef4444"},
    {label:"스블 활성 유저", val:"4,821",  icon:"👥", color:"#a855f7"},
  ];
  // 두 번 반복해서 끊김 없는 루프 효과
  const doubled = [...stats, ...stats];
  return (
    <div style={{ position:"relative", width:"100%", overflow:"hidden", background:"rgba(10,15,30,0.75)", backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, boxShadow:"inset 0 1px 0 rgba(255,255,255,.04)" }}>
      {/* 좌우 페이드 마스크 */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:40, background:"linear-gradient(90deg,rgba(10,15,30,.9),transparent)", zIndex:2, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:40, background:"linear-gradient(270deg,rgba(10,15,30,.9),transparent)", zIndex:2, pointerEvents:"none" }}/>
      {/* 스크롤 트랙 */}
      <div style={{ display:"flex", animation:"spk-stats-scroll 22s linear infinite", width:"max-content" }}>
        {doubled.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 22px", borderRight:"1px solid rgba(255,255,255,.05)", whiteSpace:"nowrap", flexShrink:0 }}>
            <span style={{ fontSize:16 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:s.color, fontFamily:"monospace", letterSpacing:-1, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:10, color:"#64748b", marginTop:2, fontWeight:700, letterSpacing:.4, textTransform:"uppercase" }}>{s.label}</div>
            </div>
            <div style={{ width:4, height:4, borderRadius:"50%", background:s.color, marginLeft:4, animation:"spk-dot-blink 2s ease-in-out infinite" }}/>
            {/* 구분자 */}
            <span style={{ color:"rgba(255,255,255,.1)", fontSize:18, marginLeft:4 }}>·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// DROP RADAR
// ══════════════════════════════════════════════════
function DropRadar({ timer }) {
  const mins = Math.floor(timer / 60);
  const secs = String(timer % 60).padStart(2, "0");
  return (
    <Card glow="#ef4444">
      <SectionHead icon="📉" title="배당 폭락 레이더"
        desc="글로벌 배당 급락 실시간 감지 · 진입 시점 알림"
        right={<Tag color="#ef4444" pulse>CRITICAL</Tag>}
        onMore={() => {}}/>
      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ textAlign:"center", padding:"12px 0 10px" }}>
          <div style={{ fontSize:48, fontWeight:900, fontFamily:"monospace", color:"#ef4444", lineHeight:1, animation:"spk-timer-pulse 1s ease-in-out infinite" }}>
            {mins}:{secs}
          </div>
          <div style={{ fontSize:10, color:"#64748b", marginTop:3, letterSpacing:2, textTransform:"uppercase" }}>다음 폭락 감지까지</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:10 }}>
          {DROPS.map((d,i) => (
            <div key={i} style={{ padding:"8px 11px", borderRadius:11, background:"rgba(239,68,68,.05)", border:`1px solid rgba(239,68,68,${d.urgency==="CRITICAL"?".3":".12"})`, display:"flex", justifyContent:"space-between", alignItems:"center", animation:d.urgency==="CRITICAL"?"spk-card-flash 3s ease-in-out infinite":"none" }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:800, color:"#f1f5f9", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.match}</div>
                <div style={{ fontSize:10, color:"#64748b", marginTop:1 }}>{d.league} · {d.before} → {d.after}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, marginLeft:8 }}>
                <div style={{ fontSize:13, fontWeight:900, color:"#ef4444" }}>{d.pct}%</div>
                <Tag color={d.urgency==="CRITICAL"?"#ef4444":d.urgency==="HIGH"?"#f97316":"#fbbf24"}>{d.urgency}</Tag>
              </div>
            </div>
          ))}
        </div>
        <button style={{ width:"100%", padding:"10px", borderRadius:11, background:"linear-gradient(135deg,#ef4444,#dc2626)", border:"none", color:"#fff", fontSize:12, fontWeight:900, cursor:"pointer", letterSpacing:.8, boxShadow:"0 0 18px rgba(239,68,68,.35)" }}>
          ⚡ 폭락 전 즉시 진입하기
        </button>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════
// LIVE TRACKER
// ══════════════════════════════════════════════════
function LiveTracker({ ballPos, liveOdds, score, matchTime, danger }) {
  return (
    <Card glow="#6366f1">
      <SectionHead icon="📡" title="AI 실시간 매치 트래커"
        desc="경기 흐름 · 위험 공격 · 스코어 · 배당 변동 실시간 추적"
        right={<Tag color="#ef4444" pulse>LIVE {matchTime}&apos;</Tag>}
        onMore={() => {}}/>
      {/* Pitch */}
      <div style={{ position:"relative", width:"100%", paddingTop:"60%", background:"radial-gradient(ellipse at center,rgba(30,58,138,.3) 0%,rgba(4,10,25,.9) 70%)" }}>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.16 }} viewBox="0 0 400 184" preserveAspectRatio="none">
          <rect x="5" y="5" width="390" height="174" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
          <line x1="200" y1="5" x2="200" y2="179" stroke="#60a5fa" strokeWidth="1"/>
          <circle cx="200" cy="92" r="28" fill="none" stroke="#60a5fa" strokeWidth="1"/>
          <circle cx="200" cy="92" r="3" fill="#60a5fa"/>
          <rect x="5" y="57" width="50" height="70" fill="none" stroke="#60a5fa" strokeWidth="1"/>
          <rect x="345" y="57" width="50" height="70" fill="none" stroke="#60a5fa" strokeWidth="1"/>
          <rect x="5" y="75" width="18" height="34" fill="none" stroke="#60a5fa" strokeWidth="1"/>
          <rect x="377" y="75" width="18" height="34" fill="none" stroke="#60a5fa" strokeWidth="1"/>
        </svg>
        {danger && (
          <div style={{ position:"absolute", right:"4%", top:"22%", width:"16%", height:"56%", background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.4)", borderRadius:6, animation:"spk-danger-pulse 1s ease-in-out infinite" }}/>
        )}
        {/* Ball */}
        <div style={{ position:"absolute", width:13, height:13, borderRadius:"50%", background:"#fbbf24", boxShadow:"0 0 16px #fbbf24,0 0 32px rgba(251,191,36,.5)", left:`${ballPos.x}%`, top:`${ballPos.y}%`, transform:"translate(-50%,-50%)", transition:"left 1.4s cubic-bezier(.25,.46,.45,.94), top 1.4s cubic-bezier(.25,.46,.45,.94)" }}/>

        {/* Team — LEFT (HOME) */}
        <div style={{ position:"absolute", top:0, left:0, bottom:0, width:"26%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, padding:"0 10px", background:"linear-gradient(90deg,rgba(96,165,250,.07) 0%,transparent 100%)" }}>
          <div style={{ width:58, height:58, borderRadius:14, background:"rgba(96,165,250,.1)", border:"1px solid rgba(96,165,250,.25)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", boxShadow:"0 0 18px rgba(96,165,250,.2)" }}>
            <img
              src="https://media.api-sports.io/football/teams/42.png"
              alt="Arsenal"
              width={46}
              height={46}
              style={{ objectFit:"contain" }}
            />
          </div>
          <div style={{ fontSize:17, fontWeight:900, color:"#f1f5f9", textAlign:"center", lineHeight:1.2, letterSpacing:-.3, textShadow:"0 0 14px rgba(96,165,250,.5)" }}>아스날</div>
          <div style={{ fontSize:10, color:"#60a5fa", fontWeight:800, letterSpacing:1.5 }}>HOME</div>
        </div>

        {/* Team — RIGHT (AWAY) */}
        <div style={{ position:"absolute", top:0, right:0, bottom:0, width:"26%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, padding:"0 10px", background:"linear-gradient(270deg,rgba(129,140,248,.07) 0%,transparent 100%)" }}>
          <div style={{ width:58, height:58, borderRadius:14, background:"rgba(129,140,248,.1)", border:"1px solid rgba(129,140,248,.25)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", boxShadow:"0 0 18px rgba(129,140,248,.2)" }}>
            <img
              src="https://media.api-sports.io/football/teams/50.png"
              alt="Man City"
              width={46}
              height={46}
              style={{ objectFit:"contain" }}
            />
          </div>
          <div style={{ fontSize:17, fontWeight:900, color:"#f1f5f9", textAlign:"center", lineHeight:1.2, letterSpacing:-.3, textShadow:"0 0 14px rgba(129,140,248,.5)" }}>맨시티</div>
          <div style={{ fontSize:10, color:"#818cf8", fontWeight:800, letterSpacing:1.5 }}>AWAY</div>
        </div>

        {/* Score — center */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}>
          <ScoreBoard h={score.h} a={score.a}/>
        </div>

        {/* Match stats — bottom */}
        <div style={{ position:"absolute", bottom:8, left:"26%", right:"26%", display:"flex", justifyContent:"space-around" }}>
          {[{l:"점유율",h:"43%",a:"57%"},{l:"슈팅",h:"4",a:"8"},{l:"유효",h:"2",a:"5"},{l:"코너",h:"3",a:"6"}].map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#64748b", marginBottom:2 }}>{s.l}</div>
              <div style={{ display:"flex", gap:3, alignItems:"center" }}>
                <span style={{ fontSize:11, fontWeight:900, color:"#60a5fa" }}>{s.h}</span>
                <span style={{ fontSize:9, color:"#475569" }}>-</span>
                <span style={{ fontSize:11, fontWeight:900, color:"#818cf8" }}>{s.a}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Odds */}
      <div style={{ padding:"10px 12px", background:"rgba(0,0,0,.4)", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        {[{label:"홈 승",val:liveOdds.home,color:"#3b82f6"},{label:"무승부",val:liveOdds.draw,color:"#8b5cf6"},{label:"원정 승",val:liveOdds.away,color:"#06b6d4"}].map((o,i) => (
          <div key={i} style={{ background:"rgba(10,15,30,.8)", border:"1px solid rgba(255,255,255,.07)", borderRadius:11, padding:"9px 6px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#64748b", fontWeight:900, letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>{o.label}</div>
            <div style={{ fontSize:19, fontWeight:900, fontFamily:"monospace", color:o.color, animation:"spk-odds-blink 2.5s ease-in-out infinite" }}>{o.val.toFixed(2)}</div>
          </div>
        ))}
      </div>
      {danger && (
        <div style={{ margin:"0 12px 10px", padding:"7px 12px", borderRadius:10, background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.3)", display:"flex", alignItems:"center", gap:8, animation:"spk-card-flash 1.2s ease-in-out infinite" }}>
          <span style={{ fontSize:13 }}>⚠️</span>
          <span style={{ fontSize:11, fontWeight:900, color:"#ef4444" }}>DANGEROUS ATTACK</span>
          <span style={{ fontSize:10, color:"#64748b" }}>맨시티 · 페널티박스 침투 · {matchTime}&apos;</span>
        </div>
      )}
    </Card>
  );
}

// ══════════════════════════════════════════════════
// INJURED LIST
// ══════════════════════════════════════════════════
function InjuredList() {
  return (
    <Card glow="#f97316">
      <SectionHead icon="🏥" title="결장자 실시간" desc="주요 선수 부상·결장 현황 · 복귀 일정 · 배당 영향도" onMore={() => {}}/>
      <div style={{ padding:"0 12px 12px", display:"flex", flexDirection:"column", gap:6 }}>
        {INJURED.map((p,i) => (
          <div key={i} style={{ padding:"8px 11px", borderRadius:11, background:"rgba(255,255,255,.02)", border:`1px solid rgba(${p.status==="복귀"?"34,197,94":p.status==="결장"?"239,68,68":"251,191,36"},.2)`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
              <span style={{ fontSize:13 }}>{p.flag}</span>
              <div style={{ minWidth:0 }}>
                <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                  <span style={{ fontSize:12, fontWeight:900, color:"#f1f5f9" }}>{p.player}</span>
                  <Tag color="#64748b">{p.pos}</Tag>
                </div>
                <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>{p.team} · {p.league} · {p.reason}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:5, flexShrink:0 }}>
              <Tag color={p.impact==="HIGH"?"#ef4444":"#fbbf24"}>{p.impact}</Tag>
              <Tag color={p.status==="복귀"?"#22c55e":p.status==="결장"?"#ef4444":"#fbbf24"}>{p.status}</Tag>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════
// WHALE TRACKER
// ══════════════════════════════════════════════════
function WhaleTracker() {
  return (
    <Card glow="#6366f1">
      <SectionHead icon="🐋" title="스마트 머니 흐름"
        desc="글로벌 큰손 자금 이동 · SHARP/SYNDICATE 구분 · 신뢰도"
        right={<Pulse color="#6366f1" size={6}/>}
        onMore={() => {}}/>
      <div style={{ padding:"0 12px 12px", display:"flex", flexDirection:"column", gap:8 }}>
        {WHALES.map((w,i) => (
          <div key={i} style={{ padding:"11px 13px", borderRadius:13, background:"rgba(99,102,241,.04)", border:"1px solid rgba(99,102,241,.14)", animation:"spk-card-glow-in 4s ease-in-out infinite" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
              <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                <Tag color={w.type==="SHARP"?"#6366f1":"#8b5cf6"} pulse>{w.type}</Tag>
                <span style={{ fontSize:11, fontWeight:800, color:"#f1f5f9" }}>{w.match}</span>
              </div>
              <Tag color="#06b6d4">{w.tag}</Tag>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
              <span style={{ fontSize:17, fontWeight:900, fontFamily:"monospace", color:"#818cf8", animation:"spk-num-flash 3s ease-in-out infinite" }}>{w.vol}</span>
              <span style={{ fontSize:13, fontWeight:900, color:"#22c55e" }}>{w.delta}</span>
            </div>
            <div style={{ marginBottom:4 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:10, color:"#64748b" }}>신뢰도</span>
                <span style={{ fontSize:10, fontWeight:900, color:"#6366f1" }}>{w.conf}%</span>
              </div>
              <Bar pct={w.conf} color="#6366f1"/>
            </div>
            <div style={{ display:"flex", gap:4 }}>
              {w.books.map((b,j) => <Tag key={j} color="#64748b">{b}</Tag>)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════
// AI PICKS
// ══════════════════════════════════════════════════
function AIPicks() {
  const [bought, setBought] = useState({});
  return (
    <Card glow="#fbbf24">
      <SectionHead icon="🧠" title="AI 유료 프리미엄 픽"
        desc="기대값(EV) 양수 보장 · 샤프머니+배당+부상 종합 분석"
        right={<Tag color="#fbbf24" pulse>AI POWERED</Tag>}
        onMore={() => {}}/>
      <div style={{ padding:"0 12px 12px", display:"flex", flexDirection:"column", gap:8 }}>
        {AI_PICKS.map((p) => (
          <div key={p.id} style={{ padding:"12px 13px", borderRadius:13, background:"rgba(251,191,36,.04)", border:`1px solid ${p.tier==="GOLD"?"rgba(251,191,36,.3)":"rgba(99,102,241,.2)"}`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:50, height:50, background:`radial-gradient(circle,${p.tier==="GOLD"?"rgba(251,191,36,.08)":"rgba(99,102,241,.06)"} 0%,transparent 70%)`, pointerEvents:"none" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}>
              <div>
                <div style={{ display:"flex", gap:5, alignItems:"center", marginBottom:3 }}>
                  <Tag color={p.tier==="GOLD"?"#fbbf24":"#6366f1"}>{p.tier}</Tag>
                  <Tag color="#64748b">{p.league}</Tag>
                </div>
                <div style={{ fontSize:12, fontWeight:900, color:"#f1f5f9" }}>{p.match}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:12, fontWeight:900, color:"#22c55e" }}>EV {p.ev}</div>
                <div style={{ fontSize:10, color:"#64748b" }}>신뢰도 {p.conf}%</div>
              </div>
            </div>
            <div style={{ padding:"7px 10px", borderRadius:9, background:"rgba(0,0,0,.3)", marginBottom:7 }}>
              {bought[p.id] ? (
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13, fontWeight:900, color:"#22c55e" }}>✓ {p.pick} <span style={{ color:"#fbbf24" }}>@ {p.odds}</span></div>
                  <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>{p.reason}</div>
                </div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:16 }}>🔒</span>
                  <span style={{ fontSize:10, color:"#64748b", filter:"blur(2.5px)", userSelect:"none" }}>████ 승 @ █.██ · {p.reason.slice(0,10)}...</span>
                </div>
              )}
            </div>
            <button onClick={() => setBought(b => ({...b, [p.id]:true}))}
              style={{ width:"100%", padding:"8px", borderRadius:9, background:bought[p.id]?"rgba(34,197,94,.15)":`linear-gradient(135deg,${p.tier==="GOLD"?"#fbbf24,#f97316":"#6366f1,#8b5cf6"})`, border:bought[p.id]?"1px solid rgba(34,197,94,.3)":"none", color:bought[p.id]?"#22c55e":"#fff", fontSize:11, fontWeight:900, cursor:"pointer" }}>
              {bought[p.id] ? "✓ 픽 공개됨" : `🔓 ${p.price.toLocaleString()}원으로 열기`}
            </button>
          </div>
        ))}
        <div style={{ padding:"8px 10px", borderRadius:10, background:"rgba(34,197,94,.04)", border:"1px solid rgba(34,197,94,.14)", textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#22c55e", fontWeight:700 }}>💡 AI 픽 월 구독 · 전체 무제한 열람 · 월 49,900원</div>
        </div>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════
// SOCIAL VIP
// ══════════════════════════════════════════════════
function SocialVIP() {
  return (
    <Card glow="#ec4899">
      <SectionHead icon="📲" title="소셜 VIP 인텔리전스"
        desc="해외 유명 팁스터·구단 관계자 SNS 실시간 수집 · AI 번역"
        onMore={() => {}}/>
      <div style={{ padding:"0 12px 12px", display:"flex", flexDirection:"column", gap:9 }}>
        {SOCIAL_VIP.map((n,i) => (
          <div key={i} style={{ padding:"11px 13px", borderRadius:13, background:"rgba(236,72,153,.03)", border:`1px solid ${n.hot?"rgba(236,72,153,.25)":"rgba(255,255,255,.07)"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
              <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,rgba(236,72,153,.18),rgba(99,102,241,.18))", border:"1px solid rgba(255,255,255,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{n.sport}</div>
                <div>
                  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:900, color:"#f1f5f9" }}>{n.src}</span>
                    {n.verified && <span style={{ fontSize:11, color:"#3b82f6" }}>✓</span>}
                    {n.hot && <Tag color="#ec4899" pulse>HOT</Tag>}
                  </div>
                  <div style={{ fontSize:10, color:"#64748b", marginTop:1 }}>{n.flag} {n.followers} 팔로워 · {n.platform}</div>
                </div>
              </div>
              <span style={{ fontSize:10, color:"#64748b", flexShrink:0, marginLeft:8 }}>{n.time}</span>
            </div>
            <p style={{ fontSize:12, color:"#cbd5e1", lineHeight:1.7, margin:"0 0 7px" }}>{n.text}</p>
            <div style={{ display:"flex", gap:5 }}>
              <Tag color="#3b82f6">🤖 AI번역</Tag>
              <Tag color="#64748b">원문 보기</Tag>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════
// SHAREBET
// ══════════════════════════════════════════════════
function ShareBet({ oddsVals, flash }) {
  return (
    <Card glow="#f59e0b">
      <SectionHead icon="⚡" title="슈퍼벳 / 수아비 레이더"
        desc="북메이커 간 배당 차이 감지 · 무위험 차익 기회 · 자동 계산"
        onMore={() => {}}/>
      <div style={{ padding:"0 12px 12px", display:"flex", flexDirection:"column", gap:8 }}>
        {SHAREBET_DATA.map((s,i) => (
          <div key={i} style={{ padding:"12px 13px", borderRadius:13, background:flash[i]?"rgba(245,158,11,.07)":"rgba(245,158,11,.03)", border:`1px solid ${flash[i]?"rgba(245,158,11,.4)":"rgba(245,158,11,.14)"}`, transition:"all .3s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
              <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                {s.hot && <Pulse color="#f59e0b"/>}
                <span style={{ fontSize:12, fontWeight:800, color:"#f1f5f9" }}>{s.match}</span>
              </div>
              <Tag color={s.type==="SUPERBET"?"#f59e0b":"#06b6d4"}>{s.type}</Tag>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:9 }}>
              {[{bk:s.b1, ov:oddsVals[i]?.b1},{bk:s.b2, ov:oddsVals[i]?.b2}].map((item,j) => (
                <div key={j} style={{ background:"rgba(0,0,0,.3)", borderRadius:9, padding:"7px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"#64748b", marginBottom:2 }}>{item.bk.n}</div>
                  <div style={{ fontSize:17, fontWeight:900, color:"#f59e0b", fontFamily:"monospace", animation:flash[i]?"spk-odds-blink .6s ease":"none" }}>{(item.ov ?? item.bk.v).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 10px", borderRadius:9, background:"rgba(34,197,94,.05)", border:"1px solid rgba(34,197,94,.14)" }}>
              <div>
                <div style={{ fontSize:10, color:"#22c55e", fontWeight:700 }}>📊 보장 수익</div>
                <div style={{ fontSize:10, color:"#64748b", marginTop:1 }}>배당차 {s.gap}</div>
              </div>
              <div style={{ fontSize:15, fontWeight:900, color:"#22c55e" }}>{s.profit}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════
// S-BLOGGER SLIDER
// ══════════════════════════════════════════════════
function SBloggerSlider() {
  const [page, setPage] = useState(0);
  const PAGES = [];
  for (let i = 0; i < BLOGGERS.length; i += 10) PAGES.push(BLOGGERS.slice(i, i+10));
  const current = PAGES[page] ?? [];
  useInterval(() => setPage(p => (p+1) % PAGES.length), 5000);

  return (
    <Card glow="#a855f7">
      {/* Custom header */}
      <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3, flexWrap:"wrap" }}>
            <span style={{ fontSize:17 }}>🏆</span>
            <span style={{ fontSize:15, fontWeight:900, color:"#f1f5f9" }}>스블</span>
            <span style={{ fontSize:11, fontWeight:900, color:"#a855f7", letterSpacing:1 }}>SBLOGGER</span>
            <Tag color="#a855f7" pulse>LIVE</Tag>
          </div>
          <p style={{ fontSize:11, color:"#64748b", margin:0 }}>스픽커 공인 팁스터 실시간 랭킹 · 적중률 · 수익률 · 연속 적중</p>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0, marginLeft:10 }}>
          {PAGES.map((_,i) => (
            <div key={i} onClick={() => setPage(i)} style={{ width:i===page?16:5, height:5, borderRadius:99, background:i===page?"#a855f7":"rgba(168,85,247,.2)", cursor:"pointer", transition:"all .3s" }}/>
          ))}
          <button onClick={() => {}} style={{ padding:"4px 10px", borderRadius:8, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"#64748b", fontSize:10, fontWeight:700, cursor:"pointer" }}>전체보기 →</button>
        </div>
      </div>
      <div style={{ padding:"0 12px 12px", overflow:"hidden" }}>
        <div key={page} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, animation:"spk-slide-in .4s ease" }}>
          {current.map((b) => (
            <div key={b.id} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 9px", borderRadius:11, background:"rgba(168,85,247,.04)", border:"1px solid rgba(168,85,247,.09)" }}>
              <div style={{ fontSize:12, fontWeight:900, color:"#64748b", fontFamily:"monospace", minWidth:20, textAlign:"center" }}>#{b.rank}</div>
              <div style={{ width:26, height:26, borderRadius:8, background:`${b.gc}18`, border:`1px solid ${b.gc}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>
                {BLOGGER_ICONS[Math.min(Math.floor(b.rank/4), 7)]}
              </div>
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ fontSize:11, fontWeight:900, color:"#f1f5f9", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{b.name}</div>
                <div style={{ fontSize:10, color:b.gc, fontWeight:700, marginTop:1 }}>{b.grade} · {b.win}%</div>
              </div>
              <div style={{ flexShrink:0 }}>
                <div style={{ fontSize:10, color:"#22c55e", fontWeight:900 }}>{b.streak}연</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════
// WATCHLIST
// ══════════════════════════════════════════════════
function Watchlist() {
  const [list, setList] = useState(WATCHLIST_INIT);
  return (
    <Card glow="#06b6d4">
      <SectionHead icon="⭐" title="나의 찜 목록" desc="관심 경기 저장 · 배당 알림 · 메모 · 개인화" onMore={() => {}}/>
      <div style={{ padding:"0 12px 12px", display:"flex", flexDirection:"column", gap:7 }}>
        {list.map((w,i) => (
          <div key={i} style={{ padding:"10px 12px", borderRadius:11, background:"rgba(6,182,212,.04)", border:`1px solid rgba(6,182,212,${w.alert?".28":".1"})` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div>
                <div style={{ display:"flex", gap:5, alignItems:"center", marginBottom:2 }}>
                  <Tag color="#64748b">{w.league}</Tag>
                  <span style={{ fontSize:10, color:"#64748b" }}>{w.time}</span>
                  {w.alert && <Tag color="#06b6d4" pulse>알림ON</Tag>}
                </div>
                <div style={{ fontSize:12, fontWeight:800, color:"#f1f5f9" }}>{w.match}</div>
              </div>
              <button onClick={() => setList(l => l.filter((_,j) => j!==i))} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:13, padding:0 }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:5, marginBottom:5 }}>
              {[{l:"H",v:w.odds.h,c:"#3b82f6"},{l:"D",v:w.odds.d,c:"#8b5cf6"},{l:"A",v:w.odds.a,c:"#06b6d4"}].filter(o => o.v != null).map((o,j) => (
                <div key={j} style={{ flex:1, background:"rgba(0,0,0,.3)", borderRadius:7, padding:"4px", textAlign:"center" }}>
                  <div style={{ fontSize:8, color:"#64748b" }}>{o.l}</div>
                  <div style={{ fontSize:12, fontWeight:900, color:o.c, fontFamily:"monospace" }}>{o.v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:10, color:"#64748b", fontStyle:"italic" }}>📝 {w.note}</div>
          </div>
        ))}
        <button style={{ padding:"8px", borderRadius:9, background:"rgba(6,182,212,.07)", border:"1px solid rgba(6,182,212,.18)", color:"#06b6d4", fontSize:10, fontWeight:700, cursor:"pointer" }}>
          + 경기 추가하기
        </button>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════
// HAMBURGER BUTTON
// ══════════════════════════════════════════════════
function HamburgerBtn({ open, onClick }) {
  return (
    <button onClick={onClick} aria-label="메뉴" style={{ width:36, height:36, borderRadius:9, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:0, flexShrink:0, position:"relative" }}>
      <span style={{ display:"block", width:17, height:2, background:"#94a3b8", borderRadius:99, transition:"all .3s ease", transformOrigin:"center", transform: open ? "translateY(7px) rotate(45deg)" : "translateY(0) rotate(0deg)", opacity: open ? 0 : 1 }}/>
      <span style={{ display:"block", width:17, height:2, background:"#94a3b8", borderRadius:99, transition:"all .3s ease", transformOrigin:"center", transform: open ? "translateY(0px) rotate(0deg)" : "translateY(0) rotate(0deg)", opacity: open ? 0 : 1 }}/>
      <span style={{ display:"block", width:17, height:2, background:"#94a3b8", borderRadius:99, transition:"all .3s ease", transformOrigin:"center", transform: open ? "translateY(-7px) rotate(-45deg)" : "translateY(0) rotate(0deg)", opacity: open ? 0 : 1 }}/>
      {open && (
        <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#3b82f6", fontSize:18, fontWeight:300, lineHeight:1 }}>✕</span>
      )}
    </button>
  );
}


// ══════════════════════════════════════════════════
// FLOATING CHAT
// ══════════════════════════════════════════════════
const CHAT_BOTS = [
  {name:"SharpKing", badge:"🤖", color:"#6366f1", ai:true},
  {name:"WhaleHunter", badge:"🤖", color:"#8b5cf6", ai:true},
  {name:"김민준", badge:"👤", color:"#06b6d4", ai:false},
  {name:"이서연", badge:"👤", color:"#22c55e", ai:false},
  {name:"DataPro", badge:"🤖", color:"#a855f7", ai:true},
  {name:"박지훈", badge:"👤", color:"#f59e0b", ai:false},
];

const INIT_MESSAGES = [
  {id:1, user:"SharpKing",   ai:true,  color:"#6366f1", text:"아스날 홈 배당 또 움직였네요. 샤프머니 계속 맨시티로 들어오는 중 🐋", time:"14:22"},
  {id:2, user:"김민준",      ai:false, color:"#06b6d4", text:"할란드 복귀 확정이면 맨시티 봐야겠네", time:"14:23"},
  {id:3, user:"WhaleHunter", ai:true,  color:"#8b5cf6", text:"AI분석: 맨시티 원정 최근 5경기 4승1무. EV +7.2% 확인됨", time:"14:24"},
  {id:4, user:"이서연",      ai:false, color:"#22c55e", text:"배당이 1.85까지 내려왔어요 진입해야하나", time:"14:25"},
  {id:5, user:"DataPro",     ai:true,  color:"#a855f7", text:"🤖 AI분석봇: 현재 bet365 기준 1.84. 샤프머니 집중도 94점", time:"14:26"},
  {id:6, user:"박지훈",      ai:false, color:"#f59e0b", text:"UCL도 PSG 배당 이상하게 움직이던데", time:"14:27"},
];

const BOT_MSGS = [
  "배당 또 움직였어요 👀",
  "지금 샤프머니 계속 들어오는 중",
  "AI분석: EV 플러스 확인됨 🤖",
  "할란드 선발 확정이라던데요",
  "이 배당이면 진입할만 하지않나요?",
  "맨시티 원정 성적 좋죠 최근에",
  "PSG 전술 변경 소식 있던데",
  "스블 랭킹 올라갔다 📈",
  "오늘 경기 기대되네요",
  "배당 폭락 레이더 봤어요? 🔥",
];

function FloatingChat({ open, onToggle, isMobile }) {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [userName] = useState("나");
  const bottomRef = useRef(null);
  const msgId = useRef(7);

  // Auto bot messages
  useInterval(() => {
    if (!open) return;
    const bot = CHAT_BOTS[Math.floor(Date.now() / 1000) % CHAT_BOTS.length];
    const text = BOT_MSGS[Math.floor(Date.now() / 3000) % BOT_MSGS.length];
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
    setMessages(prev => [...prev.slice(-40), {
      id: msgId.current++,
      user: bot.name, ai: bot.ai, color: bot.color, text, time,
    }]);
  }, 8000);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, open]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
    setMessages(prev => [...prev, { id: msgId.current++, user: userName, ai: false, color: "#3b82f6", text: input.trim(), time, me: true }]);
    setInput("");
  };

  const W = isMobile ? "calc(100vw - 24px)" : "320px";
  const H = isMobile ? "65vh" : "440px";
  const RIGHT = isMobile ? "12px" : "20px";
  const BOTTOM = isMobile ? "90px" : "60px";

  return (
    <>
      {/* Toggle button */}
      <div onClick={onToggle} style={{ position:"fixed", bottom:BOTTOM, right:RIGHT, zIndex:200, cursor:"pointer", width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#6366f1)", boxShadow:`0 0 20px rgba(99,102,241,.5)${open?"":",0 4px 20px rgba(0,0,0,.4)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, transition:"all .25s", transform:open?"scale(.9)":"scale(1)" }}>
        {open ? "✕" : "💬"}
        {!open && (
          <div style={{ position:"absolute", top:-2, right:-2, width:14, height:14, borderRadius:"50%", background:"#ef4444", border:"2px solid #010409", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color:"#fff" }}>
            {messages.length > 6 ? "N" : messages.length}
          </div>
        )}
      </div>

      {/* Chat window */}
      {open && (
        <div style={{ position:"fixed", bottom:`calc(${BOTTOM} + 58px)`, right:RIGHT, width:W, height:H, zIndex:199, display:"flex", flexDirection:"column", background:"rgba(8,12,24,.97)", backdropFilter:"blur(28px)", border:"1px solid rgba(99,102,241,.25)", borderRadius:18, overflow:"hidden", boxShadow:"0 0 40px rgba(99,102,241,.15), 0 20px 60px rgba(0,0,0,.5)", animation:"spk-slide-in .25s ease" }}>
          {/* Header */}
          <div style={{ padding:"12px 14px", borderBottom:"1px solid rgba(255,255,255,.06)", background:"rgba(99,102,241,.08)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Pulse color="#22c55e" size={7}/>
              <span style={{ fontSize:13, fontWeight:900, color:"#f1f5f9" }}>실시간 채팅</span>
              <span style={{ fontSize:10, color:"#64748b" }}>· {messages.length + 14}명 참여중</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <Tag color="#6366f1">🤖 AI봇 포함</Tag>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"10px 12px", display:"flex", flexDirection:"column", gap:8 }}>
            {messages.map(m => (
              <div key={m.id} style={{ display:"flex", flexDirection:m.me?"row-reverse":"row", gap:7, alignItems:"flex-start" }}>
                {!m.me && (
                  <div style={{ width:28, height:28, borderRadius:9, background:`${m.color}20`, border:`1px solid ${m.color}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>
                    {m.ai ? "🤖" : "👤"}
                  </div>
                )}
                <div style={{ maxWidth:"75%" }}>
                  {!m.me && (
                    <div style={{ display:"flex", gap:5, alignItems:"center", marginBottom:3 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:m.color }}>{m.user}</span>
                      {m.ai && <Tag color={m.color}>AI봇</Tag>}
                      <span style={{ fontSize:9, color:"#64748b" }}>{m.time}</span>
                    </div>
                  )}
                  <div style={{ padding:"7px 10px", borderRadius: m.me?"12px 12px 4px 12px":"12px 12px 12px 4px", background: m.me?"linear-gradient(135deg,#3b82f6,#6366f1)":"rgba(255,255,255,.06)", border: m.me?"none":"1px solid rgba(255,255,255,.07)", fontSize:11, color:"#f1f5f9", lineHeight:1.6 }}>
                    {m.text}
                  </div>
                  {m.me && <div style={{ fontSize:9, color:"#64748b", textAlign:"right", marginTop:2 }}>{m.time}</div>}
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", gap:8, alignItems:"center", flexShrink:0, background:"rgba(0,0,0,.2)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && send()}
              placeholder="메시지 입력..."
              style={{ flex:1, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"8px 12px", color:"#f1f5f9", fontSize:11, outline:"none" }}
            />
            <button onClick={send} style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#3b82f6,#6366f1)", border:"none", color:"#fff", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════
export default function SpickerDashboard() {
  const [chatOpen,  setChatOpen]  = useState(false);
  const [chatMsg,   setChatMsg]   = useState("");
  const [timer,     setTimer]     = useState(299);
  const [ballPos,   setBallPos]   = useState({ x:48, y:52 });
  const [liveOdds,  setLiveOdds]  = useState({ home:3.45, draw:2.10, away:1.85 });
  const [score]                   = useState({ h:0, a:1 });
  const [matchTime, setMatchTime] = useState(72);
  const [danger,    setDanger]    = useState(false);
  const [tab,       setTab]       = useState("대시보드");
  const [sideOpen,  setSideOpen]  = useState(true);
  const [flash,     setFlash]     = useState({});
  const [oddsVals,  setOddsVals]  = useState(SHAREBET_DATA.map(s => ({b1:s.b1.v, b2:s.b2.v})));

  const rawWidth  = useWindowWidth();          // null on SSR
  const isMobile  = rawWidth !== null && rawWidth < 768;
  const isDesktop = rawWidth !== null && rawWidth >= 768;
  const SIDE_W    = 224;

  useInterval(() => setTimer(t => t > 0 ? t-1 : 299), 1000);
  useInterval(() => setMatchTime(t => t < 90 ? t+1 : 90), 30000);
  useInterval(() => {
    setBallPos({ x: 18 + (Date.now() % 64), y: 20 + (Date.now() % 60) });
    setLiveOdds(prev => ({
      home: +Math.max(1.1, prev.home + (Math.sin(Date.now()/1000)*0.07)).toFixed(2),
      draw: +Math.max(1.1, prev.draw + (Math.cos(Date.now()/800)*0.04)).toFixed(2),
      away: +Math.max(1.1, prev.away + (Math.sin(Date.now()/1200)*0.06)).toFixed(2),
    }));
    setDanger(prev => !prev);
  }, 2800);
  useInterval(() => {
    const idx = (Math.floor(Date.now()/2400)) % SHAREBET_DATA.length;
    setFlash(f => ({...f, [idx]:true}));
    setOddsVals(prev => prev.map((o,i) => i!==idx ? o : {
      b1: Math.round((o.b1 + Math.sin(Date.now()/500)*0.05)*100)/100,
      b2: Math.round((o.b2 + Math.cos(Date.now()/600)*0.05)*100)/100,
    }));
    setTimeout(() => setFlash(f => ({...f, [idx]:false})), 700);
  }, 2400);

  // Sidebar default closed on mobile after hydration
  useEffect(() => {
    if (rawWidth !== null && rawWidth < 768) setSideOpen(false);
  }, [rawWidth]);

  const sharedProps = { tab, isMobile, liveOdds, ballPos, score, matchTime, danger, flash, oddsVals };

  return (
    <div style={{ minHeight:"100vh", background:"#010409", color:"#e2e8f0", fontFamily:"'Pretendard','Noto Sans KR',sans-serif", overflowX:"hidden", position:"relative" }}>
      <style>{`
        @keyframes spk-stats-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes spk-ping        { 0%{transform:scale(1);opacity:.6} 70%,100%{transform:scale(2.6);opacity:0} }
        @keyframes spk-timer-pulse { 0%,100%{text-shadow:0 0 28px rgba(239,68,68,.8)} 50%{text-shadow:0 0 50px rgba(239,68,68,1),0 0 80px rgba(239,68,68,.4)} }
        @keyframes spk-num-flash   { 0%,100%{opacity:1} 50%{opacity:.6} }
        @keyframes spk-odds-blink  { 0%,100%{opacity:1;transform:scale(1)} 45%{opacity:.55;transform:scale(1.09)} 55%{opacity:1;transform:scale(1)} }
        @keyframes spk-card-flash  { 0%,100%{border-color:rgba(239,68,68,.15)} 50%{border-color:rgba(239,68,68,.45);box-shadow:0 0 12px rgba(239,68,68,.1)} }
        @keyframes spk-card-glow-in{ 0%,100%{box-shadow:none} 50%{box-shadow:0 0 16px rgba(99,102,241,.1)} }
        @keyframes spk-dot-blink   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
        @keyframes spk-danger-pulse{ 0%,100%{opacity:.35} 50%{opacity:.9} }
        @keyframes spk-slide-in    { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spk-ticker      { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes spk-logo-glow   { 0%,100%{filter:drop-shadow(0 0 4px rgba(99,102,241,.5))} 50%{filter:drop-shadow(0 0 10px rgba(99,102,241,.9))} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar            { width:3px; background:transparent }
        ::-webkit-scrollbar-thumb      { background:rgba(59,130,246,.2); border-radius:99px }
      `}</style>

      {/* BG ambient */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(59,130,246,.06) 0%,transparent 55%),radial-gradient(ellipse 40% 40% at 0% 100%,rgba(99,102,241,.04) 0%,transparent 50%)" }}/>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, backgroundImage:"linear-gradient(rgba(59,130,246,.012) 1px,transparent 1px)", backgroundSize:"100% 4px", opacity:.7 }}/>

      {/* Mobile overlay when sidebar open */}
      {isMobile && sideOpen && (
        <div onClick={() => setSideOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:55, backdropFilter:"blur(4px)" }}/>
      )}

      {/* ── SIDEBAR ── */}
      <div style={{ position:"fixed", top:0, left:0, bottom:0, width:SIDE_W, background:"rgba(4,7,18,.98)", borderRight:"1px solid rgba(59,130,246,.1)", zIndex:60, transition:"transform .28s cubic-bezier(.4,0,.2,1)", transform:sideOpen?"translateX(0)":"translateX(-100%)", overflowX:"hidden", overflowY:"auto", display:"flex", flexDirection:"column" }}>
        {/* Logo */}
        <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ animation:"spk-logo-glow 3s ease-in-out infinite" }}>
            <SpickerLogo size={38}/>
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
              <span style={{ fontSize:16, fontWeight:900, letterSpacing:-1, color:"#f1f5f9" }}>SPICKER</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#818cf8" }}>스픽커</span>
            </div>
            <div style={{ fontSize:10, color:"#3b82f6", fontWeight:700, letterSpacing:2, marginTop:1 }}>INTELLIGENCE</div>
          </div>
        </div>
        {/* Nav */}
        <div style={{ flex:1, padding:"10px 8px" }}>
          {NAV_ITEMS.map(item => (
            <div key={item.t} onClick={() => { setTab(item.t); if (isMobile) setSideOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:12, cursor:"pointer", marginBottom:3, background:tab===item.t?"rgba(99,102,241,.12)":"transparent", border:tab===item.t?"1px solid rgba(99,102,241,.25)":"1px solid transparent", transition:"all .18s" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              <span style={{ fontSize:13, fontWeight:tab===item.t?800:500, color:tab===item.t?"#a5b4fc":"#94a3b8" }}>{item.label}</span>
            </div>
          ))}
        </div>
        {/* Status */}
        <div style={{ padding:"10px 8px 16px", borderTop:"1px solid rgba(255,255,255,.05)", flexShrink:0 }}>
          <div style={{ padding:"10px 12px", borderRadius:12, background:"rgba(34,197,94,.05)", border:"1px solid rgba(34,197,94,.12)" }}>
            <div style={{ fontSize:10, color:"#22c55e", fontWeight:700 }}>✓ Data Sync Active</div>
            <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>32 Global Bookies · 147 Live Matches</div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ marginLeft: isDesktop && sideOpen ? SIDE_W : 0, transition:"margin-left .28s cubic-bezier(.4,0,.2,1)", position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column", paddingBottom:isMobile?80:52, minWidth:0, overflowX:"hidden" }}>

        {/* Top bar */}
        <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(1,4,9,.94)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(59,130,246,.08)", padding:isMobile?"10px 14px":"10px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <HamburgerBtn open={sideOpen} onClick={() => setSideOpen(o => !o)}/>
            {isMobile && (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ animation:"spk-logo-glow 3s ease-in-out infinite" }}><SpickerLogo size={26}/></div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                  <span style={{ fontSize:14, fontWeight:900, letterSpacing:-1, color:"#f1f5f9" }}>SPICKER</span>
                  <span style={{ fontSize:12, fontWeight:700, color:"#818cf8" }}>스픽커</span>
                </div>
              </div>
            )}
          </div>
          {isDesktop && (
            <div style={{ flex:1, overflow:"hidden", display:"flex", alignItems:"center", gap:8 }}>
              <Pulse color="#ef4444" size={5}/>
              <div style={{ overflow:"hidden", whiteSpace:"nowrap", flex:1 }}>
                <span style={{ display:"inline-block", animation:"spk-ticker 30s linear infinite", fontSize:11, color:"#64748b", fontWeight:600 }}>
                  {TICKER_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{TICKER_TEXT}
                </span>
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:7, alignItems:"center", flexShrink:0 }}>
            {isMobile && <span style={{ fontSize:10, color:"#64748b", maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>⚡ 아스날 배당 -22.9% 급락</span>}
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 9px", borderRadius:20, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.25)" }}>
              <Pulse color="#ef4444" size={5}/><span style={{ fontSize:10, color:"#ef4444", fontWeight:900 }}>LIVE</span>
            </div>
            <div style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, cursor:"pointer" }}>🔔</div>
            <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,rgba(99,102,241,.2),rgba(59,130,246,.2))", border:"1px solid rgba(99,102,241,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, cursor:"pointer" }}>👤</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, padding:isMobile?"12px":"16px 22px", minWidth:0, overflowX:"hidden" }}>
          {/* Only render layout after hydration (rawWidth known) */}
          {rawWidth === null ? null : isMobile ? (
            /* ─ MOBILE ─ */
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <GlobalStats/>
              {tab==="대시보드"                   && <LiveTracker ballPos={ballPos} liveOdds={liveOdds} score={score} matchTime={matchTime} danger={danger}/>}
              {(tab==="대시보드"||tab==="폭락")  && <DropRadar timer={timer}/>}
              {(tab==="대시보드"||tab==="결장")  && <InjuredList/>}
              {(tab==="대시보드"||tab==="고래")  && <WhaleTracker/>}
              {(tab==="대시보드"||tab==="AI픽")  && <AIPicks/>}
              {(tab==="대시보드"||tab==="소셜")  && <SocialVIP/>}
              {(tab==="대시보드"||tab==="슈퍼벳")&& <ShareBet oddsVals={oddsVals} flash={flash}/>}
              {(tab==="대시보드"||tab==="랭킹")  && <SBloggerSlider/>}
              {(tab==="대시보드"||tab==="찜")    && <Watchlist/>}
            </div>
          ) : (
            /* ─ DESKTOP ─ */
            <div style={{ display:"flex", flexDirection:"column", gap:12, minWidth:0 }}>
              <GlobalStats/>
              <div style={{ display:"grid", gridTemplateColumns:"minmax(252px,22%) 1fr minmax(240px,22%)", gap:12, alignItems:"start", minWidth:0 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:10, minWidth:0 }}>
                  <DropRadar timer={timer}/>
                  <InjuredList/>
                  <Watchlist/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, minWidth:0, overflowX:"hidden" }}>
                  <LiveTracker ballPos={ballPos} liveOdds={liveOdds} score={score} matchTime={matchTime} danger={danger}/>
                  <SBloggerSlider/>
                  <ShareBet oddsVals={oddsVals} flash={flash}/>
                  <SocialVIP/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, minWidth:0 }}>
                  <AIPicks/>
                  <WhaleTracker/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(1,4,9,.97)", borderTop:"1px solid rgba(59,130,246,.09)", backdropFilter:"blur(24px)", display:"flex", justifyContent:"space-around", padding:"8px 0 20px", zIndex:100 }}>
          {[{icon:"🏠",t:"대시보드"},{icon:"📉",t:"폭락"},{icon:"🐋",t:"고래"},{icon:"🧠",t:"AI픽"},{icon:"⭐",t:"찜"},{icon:"🏆",t:"랭킹"}].map(item => (
            <div key={item.t} onClick={() => setTab(item.t)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer" }}>
              <span style={{ fontSize:17 }}>{item.icon}</span>
              <span style={{ fontSize:10, fontWeight:700, color:tab===item.t?"#3b82f6":"#64748b" }}>{item.t}</span>
              {tab===item.t && <div style={{ width:3, height:3, borderRadius:"50%", background:"#3b82f6" }}/>}
            </div>
          ))}
        </div>
      )}

      {/* Desktop footer */}
      {isDesktop && (
        <div style={{ position:"fixed", bottom:0, left:sideOpen?SIDE_W:0, right:0, background:"rgba(1,4,9,.95)", backdropFilter:"blur(16px)", borderTop:"1px solid rgba(59,130,246,.06)", padding:"8px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:40, transition:"left .28s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ display:"flex", gap:18, alignItems:"center" }}>
            {[{i:"🔄",l:"Data Sync Active",c:"#3b82f6"},{i:"🌐",l:"32 Global Bookies",c:"#6366f1"},{i:"🔒",l:"256-bit Encrypted",c:"#06b6d4"},{i:"⚡",l:"Real-time AI",c:"#a855f7"}].map((f,i) => (
              <span key={i} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:f.c, fontWeight:700, letterSpacing:.8, textTransform:"uppercase" }}>
                <span>{f.i}</span>{f.l}
              </span>
            ))}
          </div>
          <span style={{ fontSize:10, color:"#64748b", fontFamily:"monospace", letterSpacing:2, textTransform:"uppercase" }}>SPICKER Intelligence v4.0 · Alpha</span>
        </div>
      )}
      {/* Floating Chat */}
      <FloatingChat open={chatOpen} onToggle={() => setChatOpen(o => !o)} isMobile={isMobile}/>
    </div>
  );
}