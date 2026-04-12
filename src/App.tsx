import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mic, Power } from "lucide-react";
import { LiveSession, SessionState } from "@/lib/live-session";

const stateLabel: Record<SessionState, string> = {
  disconnected: "Idle",
  connecting: "Connecting",
  listening: "Listening",
  speaking: "Speaking",
};

const stateHint: Record<SessionState, string> = {
  disconnected: "Tap to wake Zoya.",
  connecting: "Hang tight, she is joining.",
  listening: "Talk naturally. She is all ears.",
  speaking: "Shhh... she has something to say.",
};

export default function App() {
  const [state, setState] = useState<SessionState>("disconnected");
  const [micLevel, setMicLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<LiveSession | null>(null);

  useEffect(() => {
    sessionRef.current = new LiveSession((nextState) => setState(nextState));
    return () => sessionRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMicLevel(sessionRef.current?.getMicLevel() ?? 0);
    }, 80);

    return () => window.clearInterval(interval);
  }, []);

  const isActive = state !== "disconnected";

  const statusColor = useMemo(() => {
    if (state === "speaking") return "from-fuchsia-400 to-pink-400";
    if (state === "listening") return "from-cyan-300 to-violet-300";
    if (state === "connecting") return "from-amber-300 to-orange-400";
    return "from-slate-500 to-slate-600";
  }, [state]);

  const auraScale = 1 + micLevel * 0.4;

  const toggleSession = async () => {
    setError(null);
    const session = sessionRef.current;
    if (!session) return;

    if (state === "disconnected") {
      try {
        await session.connect();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect.");
        session.disconnect();
      }
      return;
    }

    session.disconnect();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070c] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#7c3aed44,transparent_45%),radial-gradient(circle_at_80%_0%,#06b6d444,transparent_35%),radial-gradient(circle_at_50%_100%,#db277755,transparent_40%)]" />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 pb-10 pt-12 text-center">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Zoya Live</p>
          <h1 className="text-4xl font-semibold">Voice-to-Voice</h1>
          <p className="text-sm text-slate-300">No typing. No chat bubbles. Just vibe and voice.</p>
        </header>

        <div className="relative flex flex-1 items-center justify-center">
          <motion.div
            animate={{ scale: auraScale }}
            transition={{ type: "spring", stiffness: 90, damping: 10 }}
            className={`absolute h-72 w-72 rounded-full bg-gradient-to-br ${statusColor} opacity-35 blur-3xl`}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleSession}
            className="relative grid h-36 w-36 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl"
            aria-label={isActive ? "Disconnect voice assistant" : "Connect voice assistant"}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isActive ? "mic" : "power"}
                initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.7, rotate: 12 }}
                transition={{ duration: 0.18 }}
              >
                {isActive ? <Mic className="h-10 w-10" /> : <Power className="h-10 w-10" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        <footer className="w-full max-w-sm space-y-5">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">State</p>
            <p className="text-2xl font-medium">{stateLabel[state]}</p>
            <p className="text-sm text-slate-300">{stateHint[state]}</p>
          </div>

          <div className="flex h-14 items-end justify-center gap-1.5">
            {Array.from({ length: 16 }).map((_, i) => {
              const offset = i / 16;
              const wave = Math.max(0.08, Math.sin((micLevel + offset) * Math.PI * 1.8) * 0.55 + 0.45);
              const level = state === "disconnected" ? 0.08 : wave;
              return (
                <motion.div
                  key={i}
                  animate={{ height: `${18 + level * 36}px` }}
                  transition={{ duration: 0.12 }}
                  className="w-1.5 rounded-full bg-cyan-300/90"
                />
              );
            })}
          </div>

          {error && <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-100">{error}</p>}
        </footer>
      </section>
    </main>
  );
}
