import { useEffect, useRef } from "react";
import { CloudRain, Flame, Disc3 } from "lucide-react";

/**
 * Procedural ambient sounds via Web Audio API.
 * Three independent generators: rain (filtered noise), fireplace (filtered noise + crackles),
 * vinyl (low-volume crackle pops + hiss). All gain-controlled.
 */
function useAmbientEngine() {
  const ctxRef = useRef(null);
  const nodesRef = useRef({});

  const ensureCtx = () => {
    if (ctxRef.current) return ctxRef.current;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    ctxRef.current = ctx;

    // White noise buffer (2s loop)
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    // ---- RAIN: pink-ish noise -> bandpass + lowpass ----
    const rainSrc = ctx.createBufferSource();
    rainSrc.buffer = noiseBuffer;
    rainSrc.loop = true;
    const rainHP = ctx.createBiquadFilter();
    rainHP.type = "highpass";
    rainHP.frequency.value = 600;
    const rainLP = ctx.createBiquadFilter();
    rainLP.type = "lowpass";
    rainLP.frequency.value = 5800;
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0;
    rainSrc.connect(rainHP).connect(rainLP).connect(rainGain).connect(ctx.destination);
    rainSrc.start();

    // ---- FIRE: brown noise + low rumble + occasional crackle ----
    const fireSrc = ctx.createBufferSource();
    fireSrc.buffer = noiseBuffer;
    fireSrc.loop = true;
    const fireLP = ctx.createBiquadFilter();
    fireLP.type = "lowpass";
    fireLP.frequency.value = 700;
    const fireGain = ctx.createGain();
    fireGain.gain.value = 0;
    fireSrc.connect(fireLP).connect(fireGain).connect(ctx.destination);
    fireSrc.start();

    // Crackle generator for fire
    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0;
    crackleGain.connect(ctx.destination);
    const crackleInterval = setInterval(() => {
      if (!nodesRef.current.fireLevel || nodesRef.current.fireLevel < 0.05) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 200 + Math.random() * 1800;
      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(
        0.05 * (nodesRef.current.fireLevel || 0),
        now + 0.005
      );
      env.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(env).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }, 220);

    // ---- VINYL: hiss + tick pops ----
    const vinylSrc = ctx.createBufferSource();
    vinylSrc.buffer = noiseBuffer;
    vinylSrc.loop = true;
    const vinylHP = ctx.createBiquadFilter();
    vinylHP.type = "highpass";
    vinylHP.frequency.value = 3500;
    const vinylGain = ctx.createGain();
    vinylGain.gain.value = 0;
    vinylSrc.connect(vinylHP).connect(vinylGain).connect(ctx.destination);
    vinylSrc.start();

    const popInterval = setInterval(() => {
      if (!nodesRef.current.vinylLevel || nodesRef.current.vinylLevel < 0.05) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 80 + Math.random() * 120;
      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(
        0.04 * (nodesRef.current.vinylLevel || 0),
        now + 0.002
      );
      env.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(env).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }, 320);

    nodesRef.current = {
      rainGain,
      fireGain,
      vinylGain,
      crackleInterval,
      popInterval,
      fireLevel: 0,
      vinylLevel: 0,
    };
    return ctx;
  };

  const setLevel = (key, value) => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const nodes = nodesRef.current;
    const t = ctx.currentTime;
    if (key === "rain" && nodes.rainGain) {
      nodes.rainGain.gain.cancelScheduledValues(t);
      nodes.rainGain.gain.linearRampToValueAtTime(value * 0.45, t + 0.4);
    }
    if (key === "fire" && nodes.fireGain) {
      nodes.fireGain.gain.cancelScheduledValues(t);
      nodes.fireGain.gain.linearRampToValueAtTime(value * 0.6, t + 0.4);
      nodes.fireLevel = value;
    }
    if (key === "vinyl" && nodes.vinylGain) {
      nodes.vinylGain.gain.cancelScheduledValues(t);
      nodes.vinylGain.gain.linearRampToValueAtTime(value * 0.18, t + 0.4);
      nodes.vinylLevel = value;
    }
  };

  useEffect(() => {
    return () => {
      if (nodesRef.current.crackleInterval) clearInterval(nodesRef.current.crackleInterval);
      if (nodesRef.current.popInterval) clearInterval(nodesRef.current.popInterval);
      if (ctxRef.current) ctxRef.current.close().catch(() => {});
    };
  }, []);

  return { setLevel };
}

const SOUNDS = [
  { key: "fire", label: "fireplace", icon: Flame, tint: "#ff7a2a" },
  { key: "rain", label: "rain", icon: CloudRain, tint: "#7aa9c2" },
  { key: "vinyl", label: "vinyl crackle", icon: Disc3, tint: "#a0522d" },
];

export default function AmbientMixer({ levels, onChange }) {
  const { setLevel } = useAmbientEngine();

  // Apply initial levels
  useEffect(() => {
    SOUNDS.forEach((s) => setLevel(s.key, levels[s.key] || 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key, value) => {
    onChange(key, value);
    setLevel(key, value);
  };

  return (
    <div className="cozy-card p-4 w-[300px]" data-testid="ambient-mixer">
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-handwritten text-xl"
          style={{ color: "var(--text)" }}
        >
          ambient mix
        </span>
        <span
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: "var(--text-soft)" }}
        >
          set the mood
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {SOUNDS.map((s) => {
          const Icon = s.icon;
          const v = levels[s.key] ?? 0;
          return (
            <div key={s.key} className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    v > 0.05 ? `${s.tint}30` : "var(--surface)",
                  border: `1px solid ${v > 0.05 ? s.tint + "60" : "var(--border-c)"}`,
                  transition: "all 0.3s ease",
                }}
              >
                <Icon
                  size={14}
                  color={v > 0.05 ? s.tint : "var(--text-soft)"}
                />
              </div>
              <div className="flex-1">
                <div
                  className="text-xs font-semibold mb-0.5 capitalize"
                  style={{ color: "var(--text)" }}
                >
                  {s.label}
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={v}
                  onChange={(e) =>
                    handleChange(s.key, parseFloat(e.target.value))
                  }
                  className="cozy-range"
                  data-testid={`mixer-${s.key}-slider`}
                  aria-label={s.label}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
