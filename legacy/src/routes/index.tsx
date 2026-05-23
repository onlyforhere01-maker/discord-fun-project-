import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { MoodSection, type Mood } from "@/components/sections/mood-section";
import { ThoughtsSection } from "@/components/sections/thoughts-section";
import { MusicSection } from "@/components/sections/music-section";
import { JokesSection } from "@/components/sections/jokes-section";
import { QuoteGenerator } from "@/components/sections/quote-generator";
import { SurpriseMode } from "@/components/surprise-mode";
import { FloatingOrbs } from "@/components/floating-orbs";
import { CursorTrail } from "@/components/cursor-trail";
import { CherryBlossoms } from "@/components/cherry-blossoms";
import { ClickSparkles } from "@/components/click-sparkles";
import { ParticleField } from "@/components/particle-field";
import { VibeCycler } from "@/components/vibe-cycler";
import { KanjiRain } from "@/components/kanji-rain";
import { PowerUpButton } from "@/components/power-up-button";
import { KonamiCode } from "@/components/konami-code";
import { AnimeCompanions } from "@/components/anime-companions";
import { AnimeSkits } from "@/components/anime-skits";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "✧ My Digital Playground ✧" },
      { name: "description", content: "Welcome to my chaotic anime-fueled corner of the internet" },
    ],
  }),
});

function Home() {
  const [surpriseActive, setSurpriseActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerSurprise = useCallback(() => {
    setSurpriseActive(true);
    setTimeout(() => setSurpriseActive(false), 3000);
  }, []);

  const handleHeaderClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowEasterEgg(true);
        setTimeout(() => setShowEasterEgg(false), 3000);
        return 0;
      }
      return newCount;
    });
  };

  if (!mounted) return null;

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: currentMood
          ? `linear-gradient(to bottom right, ${currentMood.bgGradient.split(" ").join(", ")})`
          : undefined,
      }}
    >
      <AnimeSkits />
      <KanjiRain />
      <FloatingOrbs />
      <ParticleField />
      <CherryBlossoms />
      <CursorTrail />
      <ClickSparkles />
      <VibeCycler />
      <PowerUpButton />
      <KonamiCode />
      <AnimeCompanions count={5} />

      <SurpriseMode active={surpriseActive} />

      {showEasterEgg && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 animate-dramatic-reveal">
          <div className="text-center">
            <p className="text-6xl mb-4 animate-bounce">🎉</p>
            <p className="text-2xl font-bold neon-glow-cyan">YOU FOUND THE SECRET!</p>
            <p className="text-muted-foreground mt-2 font-mono">{"// congrats, you're officially curious"}</p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <header
          className="relative px-4 pt-24 pb-8 md:pt-28 md:pb-16"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: 1 - scrollY * 0.002,
          }}
        >
          <div className="mx-auto max-w-6xl text-center">
            <h1
              onClick={handleHeaderClick}
              onMouseEnter={() => setHeaderHovered(true)}
              onMouseLeave={() => setHeaderHovered(false)}
              className={`glitch-text text-4xl font-bold tracking-tight md:text-7xl transition-all duration-300 cursor-pointer select-none ${
                headerHovered ? "animate-glitch-skew neon-glow-cyan" : "neon-glow-pink"
              }`}
              data-text="welcome to my chaos"
            >
              welcome to my chaos
            </h1>

            <p className="mt-4 text-lg text-muted-foreground md:text-xl font-mono">
              <span className="inline-block animate-typewriter overflow-hidden whitespace-nowrap border-r-2 border-primary">
                {"// 6 worlds. infinite chaos. tiny anime friends included."}
              </span>
            </p>

            <button
              onClick={triggerSurprise}
              className="mt-8 group relative inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-6 py-3 text-sm font-medium transition-all hover:border-primary hover:bg-secondary hover:scale-105 active:scale-95 hover-lift overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-2 font-mono">
                click for vibes <span className="animate-bounce">✨</span>
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MoodSection onMoodChange={setCurrentMood} />
            <ThoughtsSection />
            <MusicSection />
            <JokesSection />
            <QuoteGenerator />
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm card-3d hover-lift">
              <div className="relative flex h-full min-h-[200px] flex-col items-center justify-center">
                <span className="text-6xl animate-float-delayed">🌙</span>
                <p className="mt-4 text-center text-sm text-muted-foreground font-mono">{"/* explore more worlds above ↑ */"}</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-border bg-card/30 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="text-sm text-muted-foreground font-mono">made with chaos and too much caffeine</p>
            <p className="mt-2 text-xs text-muted-foreground/60 font-mono">{"// 2026 • existence is temporary, code is forever"}</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
