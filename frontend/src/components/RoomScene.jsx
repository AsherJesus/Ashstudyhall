import { useMemo } from "react";

/**
 * Cozy Lofi Room Scene — pure SVG.
 * Rendered illustration-style with subtle pixel character accents (girl/boy/cat).
 * Reacts to: mode (day/night), fireLevel, rainLevel, vinylSpinning.
 */
export default function RoomScene({ mode, fireLevel, rainLevel, vinylSpinning }) {
  const isNight = mode === "night";

  // Generate raindrops
  const drops = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: `drop-${i}`,
        x: 8 + Math.random() * 84,
        delay: Math.random() * 1.4,
        duration: 0.9 + Math.random() * 0.9,
        len: 6 + Math.random() * 10,
      })),
    []
  );

  // Generate stars once (stable identity, prevents flicker)
  const stars = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: `star-${i}`,
        cx: 20 + Math.random() * 320,
        cy: 20 + Math.random() * 200,
        r: Math.random() * 1.5 + 0.5,
        opacity: 0.5 + Math.random() * 0.5,
      })),
    []
  );

  // Stable pixel-code lines on the laptop screen
  const codeLines = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: `code-${i}`,
        y: 8 + i * 6,
        w: 20 + Math.random() * 40,
      })),
    []
  );

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      style={{ display: "block", transition: "filter 1s ease" }}
    >
      <defs>
        {/* Wall gradient */}
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isNight ? "#352a20" : "#ecd9b8"} />
          <stop offset="100%" stopColor={isNight ? "#221a13" : "#d6bf99"} />
        </linearGradient>
        {/* Floor wood gradient */}
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isNight ? "#3a2a1c" : "#9a6a3f"} />
          <stop offset="100%" stopColor={isNight ? "#1c130c" : "#6a4324"} />
        </linearGradient>
        {/* Window sky */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isNight ? "#1d2742" : "#cfe1ec"} />
          <stop offset="55%" stopColor={isNight ? "#0c1224" : "#f1d9b0"} />
          <stop offset="100%" stopColor={isNight ? "#070912" : "#e8c283"} />
        </linearGradient>
        {/* Glow radial behind lamp */}
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isNight ? "#fff1c2" : "#fff6da"} stopOpacity="0.95" />
          <stop offset="60%" stopColor={isNight ? "#ffd989" : "#ffe9b0"} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        {/* Fire glow */}
        <radialGradient id="fireGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#ffb05a" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#ff7a2a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff7a2a" stopOpacity="0" />
        </radialGradient>
        {/* Wood plank stripes */}
        <pattern id="planks" x="0" y="0" width="160" height="900" patternUnits="userSpaceOnUse">
          <rect width="160" height="900" fill="url(#floorGrad)" />
          <line x1="160" y1="0" x2="160" y2="900" stroke={isNight ? "#0e0805" : "#4a2c14"} strokeOpacity="0.45" strokeWidth="2" />
        </pattern>
        {/* Brick pattern for fireplace */}
        <pattern id="bricks" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
          <rect width="60" height="30" fill={isNight ? "#3a261a" : "#7a4a2a"} />
          <rect width="58" height="28" x="1" y="1" fill={isNight ? "#2c1d12" : "#5d3a20"} />
        </pattern>
        {/* Moon glow */}
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff8e0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall */}
      <rect x="0" y="0" width="1600" height="640" fill="url(#wallGrad)" />
      {/* Wall trim */}
      <rect x="0" y="630" width="1600" height="14" fill={isNight ? "#1a1209" : "#7a4a2a"} />

      {/* Floor */}
      <rect x="0" y="644" width="1600" height="256" fill="url(#planks)" />

      {/* Floor rug */}
      <ellipse cx="800" cy="820" rx="500" ry="50" fill={isNight ? "#5a2418" : "#a05030"} opacity="0.85" />
      <ellipse cx="800" cy="820" rx="460" ry="40" fill={isNight ? "#3e1a10" : "#8a4226"} opacity="0.6" />
      <ellipse cx="800" cy="820" rx="420" ry="32" fill="none" stroke={isNight ? "#d8c3a5" : "#fdfbf7"} strokeOpacity="0.18" strokeWidth="2" strokeDasharray="6 5" />

      {/* === LEFT WALL: BOOKSHELF === */}
      <g transform="translate(60,170)">
        {/* Shelf body */}
        <rect x="0" y="0" width="240" height="460" fill={isNight ? "#3a2a1c" : "#7a4a2a"} rx="4" />
        <rect x="6" y="6" width="228" height="448" fill={isNight ? "#2a1c12" : "#5c3a21"} rx="2" />
        {/* Shelves */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`shelf-${i}`} x="6" y={6 + i * 112} width="228" height="6" fill={isNight ? "#0e0703" : "#3a2410"} />
        ))}
        {/* Books row 1 */}
        {[
          { c: "#a0522d", h: 92 },
          { c: "#c49a6c", h: 86 },
          { c: "#6b8e23", h: 96 },
          { c: "#8b5a2b", h: 88 },
          { c: "#5c3a21", h: 94 },
          { c: "#a0522d", h: 90 },
          { c: "#d2a679", h: 92 },
        ].map((b, i) => (
          <rect
            key={`b1-${i}`}
            x={14 + i * 30}
            y={112 - b.h + 6}
            width="26"
            height={b.h - 6}
            fill={b.c}
            opacity={isNight ? 0.7 : 1}
          />
        ))}
        {/* Books row 2 - leaning */}
        <g transform="translate(14,124)">
          <rect x="0" y="20" width="24" height="84" fill="#6b8e23" opacity={isNight ? 0.7 : 1} />
          <rect x="26" y="14" width="22" height="90" fill="#a0522d" opacity={isNight ? 0.7 : 1} />
          <rect x="50" y="22" width="22" height="82" fill="#5c3a21" opacity={isNight ? 0.7 : 1} />
          <g transform="translate(82,30) rotate(15)">
            <rect width="22" height="76" fill="#c49a6c" opacity={isNight ? 0.7 : 1} />
          </g>
          <rect x="120" y="22" width="22" height="82" fill="#8b5a2b" opacity={isNight ? 0.7 : 1} />
          <rect x="146" y="14" width="24" height="90" fill="#d2a679" opacity={isNight ? 0.7 : 1} />
          {/* small clock */}
          <circle cx="200" cy="68" r="18" fill={isNight ? "#1a1209" : "#fdfbf7"} stroke="#5c3a21" strokeWidth="2" />
          <line x1="200" y1="68" x2="200" y2="56" stroke="#5c3a21" strokeWidth="2" strokeLinecap="round" />
          <line x1="200" y1="68" x2="208" y2="72" stroke="#5c3a21" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Row 3 - books + small mug */}
        <g transform="translate(14,236)">
          <rect x="0" y="14" width="24" height="90" fill="#a0522d" opacity={isNight ? 0.7 : 1} />
          <rect x="26" y="22" width="22" height="82" fill="#6b8e23" opacity={isNight ? 0.7 : 1} />
          <rect x="50" y="14" width="24" height="90" fill="#8b5a2b" opacity={isNight ? 0.7 : 1} />
          {/* mug */}
          <g transform="translate(86,52)">
            <rect width="38" height="52" rx="4" fill={isNight ? "#a87c5a" : "#d2a679"} />
            <path d="M38 14 q14 8 0 24" fill="none" stroke={isNight ? "#a87c5a" : "#d2a679"} strokeWidth="6" />
            <rect x="6" y="6" width="26" height="16" fill={isNight ? "#5c3a21" : "#7a4a2a"} opacity="0.4" />
          </g>
          <rect x="140" y="20" width="22" height="84" fill="#5c3a21" opacity={isNight ? 0.7 : 1} />
          <rect x="166" y="14" width="22" height="90" fill="#c49a6c" opacity={isNight ? 0.7 : 1} />
          <rect x="190" y="22" width="22" height="82" fill="#a0522d" opacity={isNight ? 0.7 : 1} />
        </g>
        {/* Bottom shelf — trailing pothos plant */}
        <g transform="translate(20,360)">
          <rect width="60" height="40" fill={isNight ? "#5a3a22" : "#8b5a2b"} rx="4" />
          {/* leaves trailing */}
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={`leaf-l-${i}`}
              cx={10 + i * 7}
              cy={40 + i * 8}
              rx="6"
              ry="9"
              fill={isNight ? "#3d5214" : "#6b8e23"}
              transform={`rotate(${i * 12 - 30} ${10 + i * 7} ${40 + i * 8})`}
            />
          ))}
          {/* leaves on right side */}
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse
              key={`leaf-r-${i}`}
              cx={50 - i * 6}
              cy={45 + i * 9}
              rx="5"
              ry="8"
              fill={isNight ? "#475e1a" : "#7ea22a"}
              transform={`rotate(${30 - i * 10} ${50 - i * 6} ${45 + i * 9})`}
            />
          ))}
        </g>
      </g>

      {/* === LEFT WALL POSTER (handmade SVG, "vintage jazz") === */}
      <g transform="translate(330,140)">
        <rect x="-6" y="-6" width="172" height="222" fill={isNight ? "#1a1209" : "#3a2410"} rx="3" />
        <rect width="160" height="210" fill={isNight ? "#2a1c12" : "#f3e0bb"} />
        <rect x="10" y="14" width="140" height="120" fill={isNight ? "#3a2a1c" : "#a0522d"} />
        {/* trumpet shape */}
        <g transform="translate(28,40)" fill={isNight ? "#d8c3a5" : "#f3e0bb"}>
          <rect x="0" y="22" width="50" height="10" rx="2" />
          <circle cx="62" cy="27" r="20" />
          <circle cx="62" cy="27" r="12" fill={isNight ? "#3a2a1c" : "#a0522d"} />
          <rect x="34" y="14" width="6" height="6" />
          <rect x="44" y="14" width="6" height="6" />
          <rect x="54" y="14" width="6" height="6" />
        </g>
        <text x="80" y="160" textAnchor="middle" fontFamily="Caveat" fontSize="22" fill={isNight ? "#d8c3a5" : "#5c3a21"}>
          jazz cafe
        </text>
        <text x="80" y="184" textAnchor="middle" fontFamily="Quicksand" fontSize="11" fill={isNight ? "#a07c5a" : "#7a4a2a"} letterSpacing="2">
          1962 · WARM TONES
        </text>
      </g>

      {/* === WINDOW (center) === */}
      <g transform="translate(620,110)">
        {/* Frame */}
        <rect x="-12" y="-12" width="384" height="394" rx="14" fill={isNight ? "#3a2a1c" : "#7a4a2a"} />
        <rect x="0" y="0" width="360" height="370" rx="6" fill="url(#skyGrad)" />
        {/* Sun / Moon */}
        {isNight ? (
          <g>
            <circle cx="270" cy="100" r="80" fill="url(#moonGlow)" opacity="0.7" />
            <circle cx="270" cy="100" r="34" fill="#fff8e0" />
            <circle cx="262" cy="92" r="6" fill="#e3d4a0" opacity="0.5" />
            <circle cx="282" cy="108" r="4" fill="#e3d4a0" opacity="0.5" />
            {/* stars */}
            {stars.map((s) => (
              <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="#fff8e0" opacity={s.opacity} />
            ))}
          </g>
        ) : (
          <g>
            <circle cx="270" cy="120" r="60" fill="#fff3c2" opacity="0.7" />
            <circle cx="270" cy="120" r="32" fill="#ffd97a" />
          </g>
        )}
        {/* Distant hills */}
        <path d={`M0 270 Q90 ${isNight ? 230 : 220} 180 260 T360 250 L360 370 L0 370 Z`} fill={isNight ? "#0c1224" : "#a07050"} opacity="0.85" />
        <path d={`M0 300 Q120 270 240 290 T360 285 L360 370 L0 370 Z`} fill={isNight ? "#070912" : "#5c3a21"} opacity="0.9" />
        {/* tiny pine trees */}
        {[40, 80, 130, 200, 270, 320].map((x, i) => (
          <g key={`pine-${x}`} transform={`translate(${x},${280 + (i % 2) * 8})`}>
            <path d="M0 0 L-7 16 L-3 16 L-9 28 L-2 28 L-7 40 L7 40 L2 28 L9 28 L3 16 L7 16 Z" fill={isNight ? "#0a0e1a" : "#3d5214"} />
          </g>
        ))}
        {/* Window cross frame */}
        <rect x="178" y="0" width="4" height="370" fill={isNight ? "#3a2a1c" : "#7a4a2a"} />
        <rect x="0" y="183" width="360" height="4" fill={isNight ? "#3a2a1c" : "#7a4a2a"} />
        {/* Rain — only visible when rainLevel > 0 */}
        <g opacity={Math.min(1, rainLevel * 1.6)} clipPath="inset(0)">
          <rect x="0" y="0" width="360" height="370" fill="transparent" />
          {drops.map((d) => (
            <line
              key={d.id}
              x1={`${d.x}%`}
              y1="0"
              x2={`${d.x - 1}%`}
              y2={d.len}
              stroke={isNight ? "#9bb6cc" : "#88a4b8"}
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.7"
              className="raindrop"
              style={{
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`,
                transformOrigin: "center top",
              }}
            />
          ))}
        </g>
        {/* Window sill */}
        <rect x="-18" y="370" width="396" height="14" fill={isNight ? "#2a1c12" : "#5c3a21"} rx="3" />
        {/* Tiny plant on sill */}
        <g transform="translate(28,348)">
          <rect width="32" height="22" fill={isNight ? "#5a3a22" : "#8b5a2b"} rx="2" />
          <ellipse cx="6" cy="-2" rx="6" ry="10" fill={isNight ? "#3d5214" : "#6b8e23"} />
          <ellipse cx="16" cy="-6" rx="7" ry="12" fill={isNight ? "#475e1a" : "#7ea22a"} />
          <ellipse cx="26" cy="-2" rx="6" ry="10" fill={isNight ? "#3d5214" : "#6b8e23"} />
        </g>
      </g>

      {/* === RIGHT WALL: FIREPLACE === */}
      <g transform="translate(1140,250)">
        {/* Mantle top */}
        <rect x="-20" y="0" width="380" height="22" fill={isNight ? "#1a1209" : "#3a2410"} rx="2" />
        <rect x="-10" y="22" width="360" height="10" fill={isNight ? "#2a1c12" : "#5c3a21"} />
        {/* Brick body */}
        <rect x="0" y="32" width="340" height="380" fill="url(#bricks)" />
        {/* Hearth opening */}
        <rect x="60" y="120" width="220" height="240" fill="#0a0503" />
        {/* Fire base logs */}
        <g transform="translate(170,330)">
          <rect x="-60" y="0" width="120" height="14" fill="#3a2410" rx="3" />
          <rect x="-50" y="-12" width="100" height="14" fill="#5c3a21" rx="3" transform="rotate(-4)" />
          <rect x="-48" y="-22" width="98" height="12" fill="#3a2410" rx="3" transform="rotate(3)" />
        </g>
        {/* Flames - glow */}
        <ellipse cx="170" cy="280" rx="120" ry="90" fill="url(#fireGlow)" className="fire-glow" opacity={Math.max(0.3, fireLevel)} />
        {/* Flame 1 */}
        <g transform="translate(170,310)" opacity={Math.max(0.6, fireLevel + 0.4)}>
          <path className="flame" d="M0 0 C-22 -30 -18 -60 -8 -78 C-4 -60 4 -50 8 -38 C16 -52 24 -64 22 -82 C30 -60 32 -32 18 -10 C12 -2 6 2 0 0 Z" fill="#ff7a2a" />
          <path className="flame flame-2" d="M0 -10 C-12 -28 -10 -50 -2 -64 C2 -48 8 -40 12 -28 C18 -40 22 -52 20 -68 C28 -50 28 -28 16 -10 Z" fill="#ffd166" />
          <path className="flame flame-3" d="M0 -16 C-6 -28 -4 -42 2 -52 C4 -42 8 -36 10 -28 C14 -36 16 -44 14 -54 C20 -40 20 -24 12 -14 Z" fill="#fff3c2" />
        </g>
        {/* Posters above mantle */}
        <g transform="translate(80,-220)">
          <rect x="-4" y="-4" width="148" height="188" fill={isNight ? "#1a1209" : "#3a2410"} />
          <rect width="140" height="180" fill={isNight ? "#2a1c12" : "#f3e0bb"} />
          {/* botanical illustration */}
          <g transform="translate(70,90)" stroke={isNight ? "#475e1a" : "#3d5214"} strokeWidth="2" fill="none">
            <line x1="0" y1="-50" x2="0" y2="50" />
            {[-32, -16, 0, 16, 32].map((y) => (
              <g key={`branch-${y}`}>
                <path d={`M0 ${y} Q-20 ${y - 6} -28 ${y + 4}`} />
                <path d={`M0 ${y} Q20 ${y - 6} 28 ${y + 4}`} />
              </g>
            ))}
            <ellipse cx="-22" cy="-32" rx="12" ry="6" fill={isNight ? "#3d5214" : "#6b8e23"} stroke="none" />
            <ellipse cx="22" cy="-12" rx="12" ry="6" fill={isNight ? "#3d5214" : "#6b8e23"} stroke="none" />
            <ellipse cx="-22" cy="8" rx="12" ry="6" fill={isNight ? "#475e1a" : "#7ea22a"} stroke="none" />
            <ellipse cx="22" cy="28" rx="12" ry="6" fill={isNight ? "#3d5214" : "#6b8e23"} stroke="none" />
          </g>
          <text x="70" y="160" textAnchor="middle" fontFamily="Caveat" fontSize="18" fill={isNight ? "#d8c3a5" : "#5c3a21"}>
            botanical study
          </text>
        </g>
        {/* Mantle clock */}
        <g transform="translate(50,-10)">
          <rect width="60" height="36" fill={isNight ? "#3a2a1c" : "#7a4a2a"} rx="4" />
          <circle cx="30" cy="18" r="13" fill={isNight ? "#1a1209" : "#fdfbf7"} stroke={isNight ? "#0e0703" : "#3a2410"} strokeWidth="1.5" />
          <line x1="30" y1="18" x2="30" y2="10" stroke={isNight ? "#d8c3a5" : "#3a2410"} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="18" x2="36" y2="22" stroke={isNight ? "#d8c3a5" : "#3a2410"} strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* Vinyl on side table — record player */}
        <g transform="translate(220,-26)">
          <rect width="100" height="50" fill={isNight ? "#3a2a1c" : "#7a4a2a"} rx="3" />
          <rect x="6" y="-24" width="88" height="24" fill={isNight ? "#2a1c12" : "#5c3a21"} rx="2" />
          {/* Vinyl record */}
          <g transform={`translate(50,4)`} className={vinylSpinning ? "vinyl-spinning" : ""} style={{ transformOrigin: "50px 4px" }}>
            <circle r="20" fill={isNight ? "#0a0503" : "#1a1209"} />
            <circle r="20" fill="none" stroke="#5c3a21" strokeWidth="0.6" strokeDasharray="0.6 1" />
            <circle r="6" fill="#a0522d" />
            <circle r="1.5" fill={isNight ? "#1a1209" : "#3a2410"} />
          </g>
          {/* tonearm */}
          <line x1="84" y1="-4" x2="60" y2="14" stroke={isNight ? "#d8c3a5" : "#3a2410"} strokeWidth="2" strokeLinecap="round" />
          <circle cx="84" cy="-4" r="3" fill={isNight ? "#d8c3a5" : "#3a2410"} />
        </g>
      </g>

      {/* === FIRE GLOW SPILLING ON FLOOR === */}
      <ellipse cx="1310" cy="660" rx="320" ry="40" fill="#ff7a2a" opacity={fireLevel * 0.18} className="fire-glow" />

      {/* === CENTER DESK === */}
      <g transform="translate(420,560)">
        {/* Desk top */}
        <rect x="0" y="0" width="760" height="20" fill={isNight ? "#3a2a1c" : "#8b5a2b"} rx="3" />
        <rect x="0" y="20" width="760" height="6" fill={isNight ? "#1a1209" : "#5c3a21"} />
        {/* Desk legs */}
        <rect x="20" y="26" width="14" height="120" fill={isNight ? "#2a1c12" : "#5c3a21"} />
        <rect x="726" y="26" width="14" height="120" fill={isNight ? "#2a1c12" : "#5c3a21"} />
        <rect x="370" y="26" width="14" height="120" fill={isNight ? "#2a1c12" : "#5c3a21"} />

        {/* === LEFT: Lofi Boy at desk === */}
        <g transform="translate(80,-150)" data-testid="lofi-boy">
        <g className="idle-sway pixel-char">
          {/* Chair back */}
          <rect x="-10" y="80" width="80" height="60" fill={isNight ? "#3a2410" : "#5c3a21"} rx="6" />
          {/* Body / hoodie */}
          <rect x="0" y="60" width="60" height="80" fill={isNight ? "#5c3a21" : "#a0522d"} rx="4" />
          <rect x="-4" y="62" width="68" height="20" fill={isNight ? "#4a2c14" : "#8b5a2b"} rx="3" />
          {/* Hood */}
          <rect x="6" y="34" width="48" height="18" fill={isNight ? "#5c3a21" : "#a0522d"} rx="3" />
          {/* Head */}
          <rect x="14" y="20" width="32" height="36" fill={isNight ? "#a87c5a" : "#d2a679"} rx="2" />
          {/* Hair pixel front */}
          <rect x="14" y="20" width="32" height="10" fill={isNight ? "#1a1209" : "#3a2410"} />
          <rect x="14" y="28" width="6" height="6" fill={isNight ? "#1a1209" : "#3a2410"} />
          <rect x="40" y="28" width="6" height="6" fill={isNight ? "#1a1209" : "#3a2410"} />
          {/* Eyes (closed - studying) */}
          <rect x="20" y="38" width="6" height="2" fill={isNight ? "#1a1209" : "#3a2410"} />
          <rect x="34" y="38" width="6" height="2" fill={isNight ? "#1a1209" : "#3a2410"} />
          {/* Cheek blush */}
          <rect x="18" y="44" width="4" height="2" fill="#e8a880" opacity="0.6" />
          <rect x="38" y="44" width="4" height="2" fill="#e8a880" opacity="0.6" />
          {/* Arms reaching to laptop */}
          <rect x="-2" y="90" width="20" height="40" fill={isNight ? "#5c3a21" : "#a0522d"} rx="3" transform="rotate(-12 8 110)" />
          <rect x="42" y="90" width="20" height="40" fill={isNight ? "#5c3a21" : "#a0522d"} rx="3" transform="rotate(12 52 110)" />
          {/* Hands */}
          <rect x="0" y="124" width="14" height="10" fill={isNight ? "#a87c5a" : "#d2a679"} rx="2" />
          <rect x="46" y="124" width="14" height="10" fill={isNight ? "#a87c5a" : "#d2a679"} rx="2" />
        </g>
        </g>

        {/* Laptop in front of boy */}
        <g transform="translate(110,-30)">
          <rect x="0" y="0" width="80" height="6" fill={isNight ? "#0e0703" : "#1a1209"} rx="2" />
          <g transform="translate(2,-46) skewX(-2)">
            <rect width="76" height="48" fill={isNight ? "#1a1209" : "#2a1c12"} rx="3" />
            <rect x="3" y="3" width="70" height="42" fill={isNight ? "#2a3a4a" : "#88aabf"} rx="1" />
            {/* Pixel code on screen */}
            {codeLines.map((line) => (
              <rect
                key={line.id}
                x={6}
                y={line.y}
                width={line.w}
                height="2"
                fill={isNight ? "#88aabf" : "#fdfbf7"}
                opacity="0.7"
              />
            ))}
          </g>
        </g>

        {/* === MIDDLE: Sleeping Cat on desk === */}
        <g transform="translate(330,-50)">
          {/* Cat body + tail — all in one group so they breathe together, never detach */}
          <g className="cat-body">
            {/* TAIL — drawn FIRST so it sits behind the body silhouette where it attaches */}
            {/* Tail starts inside the right side of the body, curves up and over the back */}
            <path
              d="M 72 40 C 92 38, 100 22, 92 8 C 88 0, 80 -2, 76 4"
              stroke={isNight ? "#a07c5a" : "#d2a679"}
              strokeWidth="11"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tail tuft tip - slightly darker */}
            <circle cx="76" cy="4" r="6" fill={isNight ? "#7a5a3a" : "#c49a6c"} />

            {/* Body silhouette - drawn AFTER tail so the tail base tucks naturally under it */}
            <ellipse cx="40" cy="40" rx="44" ry="16" fill={isNight ? "#7a5a3a" : "#c49a6c"} />
            <ellipse cx="40" cy="36" rx="40" ry="14" fill={isNight ? "#a07c5a" : "#d2a679"} />
            {/* Stripes */}
            <ellipse cx="22" cy="34" rx="3" ry="6" fill={isNight ? "#5c3a21" : "#8b5a2b"} opacity="0.6" />
            <ellipse cx="38" cy="32" rx="3" ry="6" fill={isNight ? "#5c3a21" : "#8b5a2b"} opacity="0.6" />
            <ellipse cx="56" cy="34" rx="3" ry="6" fill={isNight ? "#5c3a21" : "#8b5a2b"} opacity="0.6" />
            {/* Head curled in */}
            <circle cx="14" cy="34" r="13" fill={isNight ? "#a07c5a" : "#d2a679"} />
            {/* Ears */}
            <path d="M6 26 L8 18 L14 24 Z" fill={isNight ? "#a07c5a" : "#d2a679"} />
            <path d="M22 22 L20 14 L14 22 Z" fill={isNight ? "#a07c5a" : "#d2a679"} />
            {/* Eyes closed */}
            <path d="M8 36 q3 -2 6 0" stroke={isNight ? "#1a1209" : "#3a2410"} strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {/* Nose */}
            <circle cx="6" cy="38" r="1.2" fill="#a0522d" />
          </g>
          {/* z's */}
          <text x="-18" y="14" fontFamily="Caveat" fontSize="14" fill={isNight ? "#d8c3a5" : "#5c3a21"} opacity="0.6">z</text>
          <text x="-26" y="4" fontFamily="Caveat" fontSize="18" fill={isNight ? "#d8c3a5" : "#5c3a21"} opacity="0.4">z</text>
        </g>

        {/* === DESK LAMP (between cat and girl) === */}
        <g transform="translate(440,-90)">
          <rect x="14" y="60" width="12" height="6" fill={isNight ? "#1a1209" : "#3a2410"} />
          <line x1="20" y1="60" x2="20" y2="30" stroke={isNight ? "#3a2410" : "#5c3a21"} strokeWidth="3" />
          <path d="M6 30 L34 30 L26 14 L14 14 Z" fill={isNight ? "#5c3a21" : "#a0522d"} />
          {/* Lamp glow */}
          <ellipse cx="20" cy="60" rx="80" ry="50" fill="url(#lampGlow)" className="lamp-glow" opacity={isNight ? 0.9 : 0.55} />
        </g>

        {/* === RIGHT: Lofi Girl at desk === */}
        <g transform="translate(560,-150)" data-testid="lofi-girl">
        <g className="idle-sway pixel-char" style={{ animationDelay: "0.6s" }}>
          {/* Chair back */}
          <rect x="-6" y="80" width="80" height="60" fill={isNight ? "#3a2410" : "#5c3a21"} rx="6" />
          {/* Sweater */}
          <rect x="2" y="60" width="60" height="80" fill={isNight ? "#6e3a1e" : "#c2725a"} rx="4" />
          <rect x="-2" y="62" width="68" height="20" fill={isNight ? "#5c3018" : "#a0522d"} rx="3" />
          {/* Head */}
          <rect x="16" y="20" width="32" height="36" fill={isNight ? "#a87c5a" : "#e8c39a"} rx="2" />
          {/* Long hair */}
          <rect x="14" y="18" width="36" height="14" fill={isNight ? "#2a1c12" : "#5c3a21"} />
          <rect x="12" y="26" width="6" height="34" fill={isNight ? "#2a1c12" : "#5c3a21"} />
          <rect x="46" y="26" width="6" height="34" fill={isNight ? "#2a1c12" : "#5c3a21"} />
          {/* Bun */}
          <circle cx="32" cy="14" r="8" fill={isNight ? "#2a1c12" : "#5c3a21"} />
          {/* Headphones */}
          <path d="M14 22 Q32 6 50 22" stroke={isNight ? "#d8c3a5" : "#3a2410"} strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="10" y="28" width="8" height="14" fill={isNight ? "#d8c3a5" : "#3a2410"} rx="2" />
          <rect x="46" y="28" width="8" height="14" fill={isNight ? "#d8c3a5" : "#3a2410"} rx="2" />
          {/* Eyes */}
          <rect x="22" y="38" width="4" height="3" fill={isNight ? "#1a1209" : "#3a2410"} />
          <rect x="36" y="38" width="4" height="3" fill={isNight ? "#1a1209" : "#3a2410"} />
          {/* Cheek blush */}
          <rect x="18" y="44" width="4" height="2" fill="#e8a880" opacity="0.7" />
          <rect x="40" y="44" width="4" height="2" fill="#e8a880" opacity="0.7" />
          {/* tiny smile */}
          <path d="M28 48 q4 3 8 0" stroke={isNight ? "#1a1209" : "#3a2410"} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* Arms */}
          <rect x="0" y="90" width="20" height="40" fill={isNight ? "#6e3a1e" : "#c2725a"} rx="3" transform="rotate(-10 10 110)" />
          <rect x="44" y="90" width="20" height="40" fill={isNight ? "#6e3a1e" : "#c2725a"} rx="3" transform="rotate(10 54 110)" />
          {/* Hands */}
          <rect x="0" y="124" width="14" height="10" fill={isNight ? "#a87c5a" : "#e8c39a"} rx="2" />
          <rect x="48" y="124" width="14" height="10" fill={isNight ? "#a87c5a" : "#e8c39a"} rx="2" />

          {/* Music notes (when music plays — always show subtly) */}
          <g transform="translate(60,10)">
            <text className="float-note" fontFamily="Caveat" fontSize="22" fill={isNight ? "#d8c3a5" : "#5c3a21"}>♪</text>
            <text className="float-note float-note-2" fontFamily="Caveat" fontSize="18" fill={isNight ? "#d8c3a5" : "#5c3a21"} x="14">♫</text>
          </g>
        </g>
        </g>

        {/* Notebook + pen in front of girl */}
        <g transform="translate(620,-26)">
          <rect x="0" y="0" width="80" height="6" fill={isNight ? "#3a2410" : "#5c3a21"} rx="1" />
          <rect x="0" y="-22" width="80" height="22" fill={isNight ? "#d8c3a5" : "#fdfbf7"} rx="1" />
          <line x1="6" y1="-16" x2="60" y2="-16" stroke={isNight ? "#a07c5a" : "#a0522d"} strokeWidth="1" />
          <line x1="6" y1="-10" x2="50" y2="-10" stroke={isNight ? "#a07c5a" : "#a0522d"} strokeWidth="1" />
          <line x1="6" y1="-4" x2="40" y2="-4" stroke={isNight ? "#a07c5a" : "#a0522d"} strokeWidth="1" />
          {/* pen */}
          <rect x="58" y="-8" width="22" height="3" fill="#a0522d" rx="1" transform="rotate(-12 58 -8)" />
        </g>

        {/* Tea cup near girl */}
        <g transform="translate(540,-40)">
          {/* steam */}
          <g opacity="0.85">
            <path className="steam-1" d="M10 0 Q14 -10 10 -20 Q6 -30 12 -38" fill="none" stroke={isNight ? "#d8c3a5" : "#fdfbf7"} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path className="steam-2" d="M16 0 Q12 -10 16 -20 Q20 -30 14 -38" fill="none" stroke={isNight ? "#d8c3a5" : "#fdfbf7"} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path className="steam-3" d="M22 0 Q26 -10 22 -20 Q18 -30 24 -38" fill="none" stroke={isNight ? "#d8c3a5" : "#fdfbf7"} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </g>
          {/* Cup */}
          <rect x="0" y="0" width="34" height="22" fill={isNight ? "#a07c5a" : "#fdfbf7"} rx="2" />
          <ellipse cx="17" cy="2" rx="15" ry="3" fill={isNight ? "#3a2410" : "#a0522d"} />
          <path d="M34 6 q10 6 0 14" stroke={isNight ? "#a07c5a" : "#fdfbf7"} strokeWidth="3" fill="none" />
          {/* saucer */}
          <ellipse cx="17" cy="22" rx="20" ry="3" fill={isNight ? "#5c3a21" : "#d2a679"} />
        </g>

        {/* small potted plant on desk left */}
        <g transform="translate(40,-44)">
          <rect width="28" height="22" fill={isNight ? "#5a3a22" : "#8b5a2b"} rx="2" />
          <ellipse cx="6" cy="-2" rx="6" ry="11" fill={isNight ? "#3d5214" : "#6b8e23"} />
          <ellipse cx="14" cy="-8" rx="7" ry="13" fill={isNight ? "#475e1a" : "#7ea22a"} />
          <ellipse cx="22" cy="-2" rx="6" ry="11" fill={isNight ? "#3d5214" : "#6b8e23"} />
        </g>
      </g>

      {/* === Subtle floor plant on right === */}
      <g transform="translate(1080,640)">
        <rect width="60" height="60" fill={isNight ? "#5a3a22" : "#8b5a2b"} rx="4" />
        <ellipse cx="14" cy="-8" rx="10" ry="22" fill={isNight ? "#3d5214" : "#6b8e23"} />
        <ellipse cx="30" cy="-18" rx="14" ry="30" fill={isNight ? "#475e1a" : "#7ea22a"} />
        <ellipse cx="46" cy="-8" rx="10" ry="22" fill={isNight ? "#3d5214" : "#6b8e23"} />
      </g>
      {/* Floor plant left */}
      <g transform="translate(360,650)">
        <rect width="50" height="50" fill={isNight ? "#5a3a22" : "#8b5a2b"} rx="3" />
        <ellipse cx="12" cy="-6" rx="9" ry="20" fill={isNight ? "#3d5214" : "#6b8e23"} />
        <ellipse cx="26" cy="-12" rx="11" ry="24" fill={isNight ? "#475e1a" : "#7ea22a"} />
        <ellipse cx="38" cy="-6" rx="9" ry="20" fill={isNight ? "#3d5214" : "#6b8e23"} />
      </g>

      {/* Subtle warm light wash overlay (afternoon glow / candle wash) */}
      {!isNight && (
        <rect x="0" y="0" width="1600" height="900" fill="#ffd089" opacity="0.06" />
      )}
      {isNight && (
        <rect x="0" y="0" width="1600" height="900" fill="#1a1224" opacity="0.18" />
      )}
    </svg>
  );
}
