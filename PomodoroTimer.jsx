import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Coffee, BookOpen } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MODES = {
  focus: { label: "focus", minutes: 25, icon: BookOpen },
  short: { label: "short break", minutes: 5, icon: Coffee },
  long: { label: "long break", minutes: 15, icon: Coffee },
};

function fmt(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroTimer() {
  const [modeKey, setModeKey] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (!completedRef.current) {
              completedRef.current = true;
              if (modeKey === "focus") {
                axios
                  .post(`${API}/focus-sessions`, {
                    duration_minutes: MODES.focus.minutes,
                  })
                  .catch(() => {});
                toast.success("focus complete — take a break ☕");
              } else {
                toast("break's over — back to it ✨");
              }
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, modeKey]);

  const pickMode = (k) => {
    setModeKey(k);
    setSecondsLeft(MODES[k].minutes * 60);
    setRunning(false);
    completedRef.current = false;
  };

  const reset = () => {
    setSecondsLeft(MODES[modeKey].minutes * 60);
    setRunning(false);
    completedRef.current = false;
  };

  const total = MODES[modeKey].minutes * 60;
  const progress = 1 - secondsLeft / total;

  return (
    <div
      className="cozy-card p-4 md:p-5 w-[260px]"
      data-testid="pomodoro-widget"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-handwritten text-xl"
          style={{ color: "var(--text)" }}
        >
          focus timer
        </span>
        <span
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: "var(--text-soft)" }}
        >
          {MODES[modeKey].label}
        </span>
      </div>

      {/* Mode pills */}
      <div className="flex gap-1.5 mb-3">
        {Object.entries(MODES).map(([k, m]) => {
          const Icon = m.icon;
          const active = modeKey === k;
          return (
            <button
              key={k}
              onClick={() => pickMode(k)}
              data-testid={`pomodoro-mode-${k}`}
              className="flex-1 text-xs font-semibold px-2 py-1.5 rounded-full transition-all"
              style={{
                background: active ? "var(--wood-dark)" : "transparent",
                color: active ? "#fdfbf7" : "var(--text-soft)",
                border: active
                  ? "1px solid var(--wood-dark)"
                  : "1px solid var(--border-c)",
              }}
            >
              <Icon size={12} className="inline mr-1" />
              {m.minutes}m
            </button>
          );
        })}
      </div>

      {/* Timer display with circular progress */}
      <div className="relative flex items-center justify-center my-3">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="var(--border-c)"
            strokeWidth="4"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="var(--terracotta)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - progress)}
            transform="rotate(-90 80 80)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          data-testid="pomodoro-display"
        >
          <span
            className="font-pixel text-5xl leading-none"
            style={{ color: "var(--text)" }}
          >
            {fmt(secondsLeft)}
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.2em] mt-1"
            style={{ color: "var(--text-soft)" }}
          >
            {running ? "running" : "paused"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="btn-warm"
          data-testid="pomodoro-start-pause"
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? "pause" : "start"}
        </button>
        <button
          onClick={reset}
          className="btn-ghost"
          data-testid="pomodoro-reset"
          aria-label="reset"
        >
          <RotateCcw size={14} />
          reset
        </button>
      </div>
    </div>
  );
}
