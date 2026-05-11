import { useState, useEffect, useCallback } from "react";
import { Timer, Music2, Sliders, ListTodo } from "lucide-react";
import RoomScene from "@/components/RoomScene";
import PomodoroTimer from "@/components/PomodoroTimer";
import MusicPlayer from "@/components/MusicPlayer";
import AmbientMixer from "@/components/AmbientMixer";
import TodoList from "@/components/TodoList";
import DayNightToggle from "@/components/DayNightToggle";
import CollapsiblePanel from "@/components/CollapsiblePanel";

export default function LofiRoom() {
  const [mode, setMode] = useState("day");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [ambientLevels, setAmbientLevels] = useState({
    rain: 0,
    fire: 0.45,
    vinyl: 0,
  });

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.body.dataset.mode = mode;
  }, [mode]);

  const updateAmbient = useCallback((key, value) => {
    setAmbientLevels((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden vignette grain"
      style={{ background: "var(--bg)" }}
      data-testid="lofi-room-page"
    >
      {/* Scene */}
      <div className="absolute inset-0 z-0">
        <RoomScene
          mode={mode}
          fireLevel={ambientLevels.fire}
          rainLevel={ambientLevels.rain}
          vinylSpinning={musicPlaying || ambientLevels.vinyl > 0}
        />
      </div>

      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-5 md:p-7 widget-in pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <h1
            className="font-handwritten text-3xl md:text-4xl leading-none"
            style={{ color: "var(--text)" }}
            data-testid="app-title"
          >
            cozy little room
          </h1>
          <p
            className="text-xs md:text-sm font-medium"
            style={{ color: "var(--text-soft)" }}
          >
            breathe in. focus. melt into the warm.
          </p>
        </div>
        <div className="pointer-events-auto">
          <DayNightToggle mode={mode} onChange={setMode} />
        </div>
      </header>

      {/* Top right – Pomodoro (collapsible) */}
      <div className="absolute top-24 right-4 md:top-28 md:right-7 z-20 widget-in widget-delay-1">
        <CollapsiblePanel
          icon={Timer}
          label="focus"
          anchor="tr"
          testId="panel-pomodoro"
          width={260}
          iconTint="var(--terracotta)"
        >
          <PomodoroTimer />
        </CollapsiblePanel>
      </div>

      {/* Bottom left – Music + Mixer (each collapsible) */}
      <div className="absolute bottom-4 left-4 md:bottom-7 md:left-7 z-20 flex flex-col gap-3 widget-in widget-delay-2">
        <CollapsiblePanel
          icon={Music2}
          label="music"
          anchor="bl"
          testId="panel-music"
          width={300}
          iconTint="var(--wood-dark)"
        >
          <MusicPlayer playing={musicPlaying} setPlaying={setMusicPlaying} />
        </CollapsiblePanel>
        <CollapsiblePanel
          icon={Sliders}
          label="ambient mix"
          anchor="bl"
          testId="panel-ambient"
          width={300}
          iconTint="var(--plant)"
        >
          <AmbientMixer levels={ambientLevels} onChange={updateAmbient} />
        </CollapsiblePanel>
      </div>

      {/* Bottom right – Todos (collapsible) */}
      <div className="absolute bottom-4 right-4 md:bottom-7 md:right-7 z-20 widget-in widget-delay-3">
        <CollapsiblePanel
          icon={ListTodo}
          label="gentle list"
          anchor="br"
          testId="panel-todos"
          width={300}
          iconTint="var(--wood-dark)"
        >
          <TodoList />
        </CollapsiblePanel>
      </div>
    </div>
  );
}
