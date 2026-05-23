import { useEffect, useState, useCallback } from "react";

// Scripted anime cameos & skits that play out over the page.
// Each scene is a self-contained component that auto-finishes via onDone.
// A scheduler picks a random scene every 60-120s.

type SceneProps = { onDone: () => void };

// ──────────────────────────────────────────────────────────────
// Shared building blocks
// ──────────────────────────────────────────────────────────────

function SpeechBubble({
  x,
  y,
  text,
  side = "left",
  delay = 0,
  duration = 2400,
}: {
  x: number | string;
  y: number | string;
  text: string;
  side?: "left" | "right";
  delay?: number;
  duration?: number;
}) {
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), delay);
    const t2 = setTimeout(() => setShow(false), delay + duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [delay, duration]);

  useEffect(() => {
    if (!show) return;
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [show, text]);

  if (!show) return null;
  return (
    <div
      className="absolute z-[9100] pointer-events-none animate-scale-in"
      style={{
        left: typeof x === "number" ? `${x}px` : x,
        top: typeof y === "number" ? `${y}px` : y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="relative max-w-[260px] rounded-2xl border-2 border-foreground bg-white text-black px-4 py-2.5 font-mono text-sm shadow-[4px_4px_0_0_rgba(0,0,0,0.9)]">
        {typed}
        <span className="animate-pulse">|</span>
        <span
          className="absolute -bottom-2 w-4 h-4 rotate-45 bg-white border-r-2 border-b-2 border-foreground"
          style={{ [side]: "20px" } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

// Generic anime body builder (smooth chibi-realist hybrid)
function AnimeChar({
  hairColor,
  hairStyle = "spike",
  outfit = "gi",
  accent = "#ff3b6e",
  pose = "stand",
  size = 180,
}: {
  hairColor: string;
  hairStyle?: "spike" | "long" | "bob" | "ponytail";
  outfit?: "gi" | "uniform" | "robe" | "ninja";
  accent?: string;
  pose?: "stand" | "run" | "slash" | "swing" | "flirt" | "shock";
  size?: number;
}) {
  const skin = "#ffd9b8";
  const outline = "#0a0a0a";

  const hair = (() => {
    switch (hairStyle) {
      case "long":
        return (
          <path
            d="M30 38 Q26 70 32 96 L40 90 Q42 56 50 42 Q60 30 72 32 Q88 30 96 44 Q104 56 100 92 L106 100 Q112 64 102 38 Q90 16 64 16 Q40 18 30 38 Z"
            fill={hairColor}
            stroke={outline}
            strokeWidth="2"
          />
        );
      case "bob":
        return (
          <path
            d="M28 46 Q26 30 50 18 Q72 12 92 22 Q108 32 108 50 L104 62 Q100 42 88 38 Q72 34 54 38 Q40 44 36 60 Z"
            fill={hairColor}
            stroke={outline}
            strokeWidth="2"
          />
        );
      case "ponytail":
        return (
          <>
            <path d="M32 44 Q30 22 64 14 Q98 18 102 44 L96 56 Q92 36 64 32 Q40 38 38 58 Z" fill={hairColor} stroke={outline} strokeWidth="2" />
            <path d="M98 38 Q120 36 124 60 Q120 90 100 100 Q104 70 96 50 Z" fill={hairColor} stroke={outline} strokeWidth="2" />
          </>
        );
      default: // spike
        return (
          <path
            d="M26 50 L36 28 L42 44 L52 18 L60 40 L70 14 L78 42 L88 22 L94 46 L104 30 L102 56 Q98 38 84 36 Q66 32 50 38 Q36 42 30 56 Z"
            fill={hairColor}
            stroke={outline}
            strokeWidth="2"
          />
        );
    }
  })();

  const body = (() => {
    if (outfit === "ninja") {
      return (
        <>
          <path d="M44 92 L84 92 L92 168 L36 168 Z" fill="#1a1a2e" stroke={outline} strokeWidth="2" />
          <path d="M40 90 L88 90 L92 100 L36 100 Z" fill={accent} stroke={outline} strokeWidth="2" />
        </>
      );
    }
    if (outfit === "robe") {
      return (
        <>
          <path d="M36 92 L92 92 L102 200 L26 200 Z" fill="#f5e6c8" stroke={outline} strokeWidth="2" />
          <path d="M48 92 L80 92 L82 180 L46 180 Z" fill={accent} stroke={outline} strokeWidth="2" />
        </>
      );
    }
    if (outfit === "uniform") {
      return (
        <>
          <path d="M38 92 L90 92 L96 172 L32 172 Z" fill="#243049" stroke={outline} strokeWidth="2" />
          <path d="M60 92 L68 92 L66 130 L62 130 Z" fill={accent} />
        </>
      );
    }
    // gi
    return (
      <>
        <path d="M36 92 L92 92 L98 176 L30 176 Z" fill="#ff8a3d" stroke={outline} strokeWidth="2" />
        <path d="M58 92 L70 92 L82 176 L46 176 Z" fill="#1a1a2e" stroke={outline} strokeWidth="2" />
        <rect x="44" y="148" width="40" height="10" fill={accent} stroke={outline} strokeWidth="2" />
      </>
    );
  })();

  // limb poses
  const arms = (() => {
    if (pose === "slash") {
      return (
        <>
          <path d="M40 100 Q10 80 4 50" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M88 100 Q120 110 140 70" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
          <rect x="138" y="40" width="6" height="60" fill="#c0c8d4" stroke={outline} strokeWidth="2" transform="rotate(-30 141 70)" />
        </>
      );
    }
    if (pose === "swing") {
      return (
        <>
          <path d="M40 100 Q20 130 30 160" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M88 100 Q120 70 130 30" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
          <rect x="126" y="-20" width="8" height="80" fill="#6b3a1a" stroke={outline} strokeWidth="2" transform="rotate(-25 130 20)" />
        </>
      );
    }
    if (pose === "run") {
      return (
        <>
          <path d="M40 100 Q20 70 30 40" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M88 100 Q110 130 100 160" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
        </>
      );
    }
    if (pose === "flirt") {
      return (
        <>
          <path d="M40 100 Q60 130 80 120" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M88 100 Q108 70 92 44" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
        </>
      );
    }
    if (pose === "shock") {
      return (
        <>
          <path d="M40 100 Q14 70 20 36" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M88 100 Q114 70 108 36" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
        </>
      );
    }
    return (
      <>
        <path d="M40 100 Q30 130 32 168" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M88 100 Q98 130 96 168" stroke={skin} strokeWidth="10" strokeLinecap="round" fill="none" />
      </>
    );
  })();

  const eyes = pose === "flirt" || pose === "shock" ? (
    pose === "shock" ? (
      <>
        <circle cx="50" cy="62" r="6" fill="#fff" stroke={outline} strokeWidth="2" />
        <circle cx="78" cy="62" r="6" fill="#fff" stroke={outline} strokeWidth="2" />
        <circle cx="50" cy="62" r="2" fill={outline} />
        <circle cx="78" cy="62" r="2" fill={outline} />
      </>
    ) : (
      <>
        <path d="M44 62 Q50 66 56 62" stroke={outline} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M72 62 Q78 66 84 62" stroke={outline} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    )
  ) : (
    <>
      <ellipse cx="50" cy="64" rx="3.5" ry="6" fill={outline} />
      <ellipse cx="78" cy="64" rx="3.5" ry="6" fill={outline} />
      <circle cx="51" cy="62" r="1.4" fill="#fff" />
      <circle cx="79" cy="62" r="1.4" fill="#fff" />
    </>
  );

  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 130 200">
      {/* legs */}
      <path d="M50 170 L46 196" stroke={outline} strokeWidth="10" strokeLinecap="round" />
      <path d="M78 170 L82 196" stroke={outline} strokeWidth="10" strokeLinecap="round" />
      {body}
      {arms}
      {/* neck + head */}
      <rect x="58" y="80" width="12" height="14" fill={skin} stroke={outline} strokeWidth="2" />
      <ellipse cx="64" cy="62" rx="26" ry="28" fill={skin} stroke={outline} strokeWidth="2.5" />
      {/* blush */}
      {pose === "flirt" && <>
        <ellipse cx="48" cy="72" rx="5" ry="2.5" fill="#ff8aa8" opacity="0.7" />
        <ellipse cx="80" cy="72" rx="5" ry="2.5" fill="#ff8aa8" opacity="0.7" />
      </>}
      {eyes}
      {/* mouth */}
      {pose === "shock" ? (
        <ellipse cx="64" cy="78" rx="3" ry="4" fill={outline} />
      ) : pose === "flirt" ? (
        <path d="M58 76 Q64 80 70 76" stroke={outline} strokeWidth="2" fill="#ff6b8e" />
      ) : (
        <path d="M60 76 Q64 78 68 76" stroke={outline} strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {hair}
    </svg>
  );
}

// Speed lines / aura behind a character
function SpeedLines({ direction = "left" }: { direction?: "left" | "right" }) {
  const lines = Array.from({ length: 14 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {lines.map((_, i) => {
        const top = (i / lines.length) * 100;
        return (
          <div
            key={i}
            className="absolute h-[2px] bg-white/80"
            style={{
              top: `${top}%`,
              left: 0,
              right: 0,
              animation: `speedline 0.5s linear ${i * 0.04}s infinite`,
              transform: direction === "right" ? "scaleX(-1)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 1: Lone hero swings across with a bo-staff
// ──────────────────────────────────────────────────────────────
function SwingHero({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 4800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <SpeedLines direction="left" />
      <div
        className="absolute top-[8%]"
        style={{
          animation: "skitSwingAcross 4.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        }}
      >
        <div style={{ animation: "skitSpin 0.6s linear infinite" }}>
          <AnimeChar hairColor="#ff8a3d" hairStyle="spike" outfit="gi" accent="#ffd84a" pose="swing" size={170} />
        </div>
      </div>
      <SpeechBubble x="50%" y="40%" text="OUTTA MY WAY — DESTINY CALLS" delay={1200} duration={2000} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 2: Two fighters notice the viewer, stop, walk off
// ──────────────────────────────────────────────────────────────
function FightInterrupted({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 10000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in" />
      {/* Left fighter */}
      <div
        className="absolute bottom-[10%]"
        style={{ animation: "fighterLeft 10s ease-in-out forwards" }}
      >
        <AnimeChar hairColor="#1a1a2e" hairStyle="spike" outfit="gi" accent="#00e5ff" pose="slash" size={220} />
      </div>
      {/* Right fighter */}
      <div
        className="absolute bottom-[10%] right-0"
        style={{
          animation: "fighterRight 10s ease-in-out forwards",
          transform: "scaleX(-1)",
        }}
      >
        <AnimeChar hairColor="#ffffff" hairStyle="long" outfit="robe" accent="#ff3b6e" pose="slash" size={220} />
      </div>

      {/* Clash flash */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32"
        style={{ animation: "clashFlash 0.6s ease-out 1.6s forwards", opacity: 0 }}>
        <div className="w-full h-full rounded-full bg-yellow-300 blur-2xl" />
      </div>

      <SpeechBubble x="32%" y="38%" text="oi... someone's watching us." delay={2800} duration={2200} side="left" />
      <SpeechBubble x="68%" y="38%" text="tch. we'll finish this later, rival." delay={5200} duration={2400} side="right" />
      <SpeechBubble x="50%" y="58%" text="(both walk off in silence)" delay={7800} duration={1800} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 3: Shy girl peeks, waves, hides — flirty
// ──────────────────────────────────────────────────────────────
function ShyGirlPeek({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 7000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <div
        className="absolute bottom-[6%] right-0"
        style={{ animation: "shyPeek 7s ease-in-out forwards" }}
      >
        <AnimeChar hairColor="#ff6ba8" hairStyle="ponytail" outfit="uniform" accent="#ffd84a" pose="flirt" size={200} />
      </div>
      <SpeechBubble x="78%" y="48%" text="h-hi senpai... noticed me yet? 💗" delay={1800} duration={2400} side="right" />
      <SpeechBubble x="78%" y="48%" text="okay bye!! pretend you didn't see >///<" delay={4600} duration={2000} side="right" />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 4: Sigma ninja walks by, hands in pockets, says nothing
// ──────────────────────────────────────────────────────────────
function SigmaWalk({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 9000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <div
        className="absolute bottom-[8%]"
        style={{ animation: "sigmaWalk 9s linear forwards" }}
      >
        <div style={{ animation: "subtleBob 0.9s ease-in-out infinite" }}>
          <AnimeChar hairColor="#0a0a0a" hairStyle="bob" outfit="ninja" accent="#7a00ff" pose="stand" size={190} />
        </div>
      </div>
      <SpeechBubble x="50%" y="50%" text="..." delay={2400} duration={1600} />
      <SpeechBubble x="50%" y="50%" text="they always watch. doesn't matter." delay={4800} duration={2600} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 5: Hero charges aura — full power-up
// ──────────────────────────────────────────────────────────────
function AuraCharge({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 6500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/40 via-transparent to-transparent" style={{ animation: "auraPulse 6s ease-in-out" }} />
      <SpeedLines direction="right" />
      <div
        className="absolute left-1/2 bottom-[12%] -translate-x-1/2"
        style={{ animation: "shakeChar 0.08s linear infinite" }}
      >
        <div className="relative">
          <div className="absolute inset-0 -m-12 rounded-full bg-yellow-300 blur-3xl animate-pulse" />
          <div className="absolute inset-0 -m-6 rounded-full bg-orange-400 blur-2xl animate-pulse" />
          <div className="relative">
            <AnimeChar hairColor="#ffd84a" hairStyle="spike" outfit="gi" accent="#ff3b6e" pose="shock" size={260} />
          </div>
        </div>
      </div>
      <SpeechBubble x="50%" y="30%" text="this isn't even my final form..." delay={2200} duration={2200} />
      <SpeechBubble x="50%" y="30%" text="HAAAAAA — go back to scrolling, mortal" delay={4600} duration={1700} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 6: Samurai slash — single frame slash + petals
// ──────────────────────────────────────────────────────────────
function SamuraiSlash({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 5500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ animation: "samuraiDash 1.4s cubic-bezier(0.7, 0, 0.3, 1) forwards" }}
      >
        <AnimeChar hairColor="#0a0a0a" hairStyle="ponytail" outfit="robe" accent="#c0c8d4" pose="slash" size={200} />
      </div>
      {/* Slash arc */}
      <div
        className="absolute top-1/2 left-1/2 w-[80vw] h-[2px] bg-white origin-left"
        style={{
          transform: "translate(-50%, -50%) rotate(-12deg)",
          animation: "slashLine 0.4s ease-out 1.2s forwards",
          opacity: 0,
          boxShadow: "0 0 20px #fff, 0 0 40px #fff",
        }}
      />
      {/* Petals */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-pink-300 text-2xl"
          style={{
            left: `${10 + i * 5}%`,
            top: "50%",
            animation: `petalFall 3s ease-out ${1.5 + i * 0.08}s forwards`,
            opacity: 0,
          }}
        >
          🌸
        </div>
      ))}
      <SpeechBubble x="50%" y="38%" text="one cut. one truth." delay={2400} duration={2400} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scheduler
// ──────────────────────────────────────────────────────────────
const SCENES = [SwingHero, FightInterrupted, ShyGirlPeek, SigmaWalk, AuraCharge, SamuraiSlash];

export function AnimeSkits() {
  const [active, setActive] = useState<number | null>(null);
  const [SceneComp, setSceneComp] = useState<React.FC<SceneProps> | null>(null);

  const schedule = useCallback(() => {
    // 60-120s between scenes
    const wait = 60000 + Math.random() * 60000;
    return setTimeout(() => {
      const idx = Math.floor(Math.random() * SCENES.length);
      setActive(idx);
      setSceneComp(() => SCENES[idx]);
    }, wait);
  }, []);

  useEffect(() => {
    // first one comes faster so user sees something within ~15-30s
    const first = setTimeout(() => {
      const idx = Math.floor(Math.random() * SCENES.length);
      setActive(idx);
      setSceneComp(() => SCENES[idx]);
    }, 15000 + Math.random() * 15000);
    return () => clearTimeout(first);
  }, []);

  const handleDone = useCallback(() => {
    setActive(null);
    setSceneComp(null);
    const id = schedule();
    return () => clearTimeout(id);
  }, [schedule]);

  if (!SceneComp || active === null) return null;
  return <SceneComp key={active + "-" + Date.now()} onDone={handleDone} />;
}
