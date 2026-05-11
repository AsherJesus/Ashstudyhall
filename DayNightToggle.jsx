import { Sun, Moon } from "lucide-react";

export default function DayNightToggle({ mode, onChange }) {
  const isNight = mode === "night";
  return (
    <button
      type="button"
      onClick={() => onChange(isNight ? "day" : "night")}
      className="cozy-card flex items-center gap-2 px-3 py-2 hover:scale-[1.02] transition-transform"
      data-testid="day-night-toggle"
      aria-label="Toggle day/night"
      title={isNight ? "Switch to day" : "Switch to night"}
    >
      <div
        className="relative flex items-center w-14 h-7 rounded-full"
        style={{
          background: isNight ? "var(--wood-espresso)" : "var(--wood-light)",
          transition: "background 0.6s ease",
        }}
      >
        <div
          className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            transform: isNight ? "translateX(28px)" : "translateX(0)",
            transition: "transform 0.45s cubic-bezier(.6,.2,.2,1)",
            background: isNight ? "#f3e0b8" : "#fffbe9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          {isNight ? (
            <Moon size={13} color="#5c3a21" />
          ) : (
            <Sun size={13} color="#a0522d" />
          )}
        </div>
      </div>
      <span
        className="font-handwritten text-xl"
        style={{ color: "var(--text)" }}
      >
        {isNight ? "night" : "day"}
      </span>
    </button>
  );
}
