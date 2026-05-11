import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const proxied = (raw) => `${API}/audio-proxy?url=${encodeURIComponent(raw)}`;

// Stable, royalty-free chill jazz / lofi tracks streamed via backend proxy (avoids CORS)
const TRACKS = [
  {
    title: "Smooth Cafe Loop",
    artist: "Cozy Tape",
    url: proxied("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"),
  },
  {
    title: "Rainy Window Jazz",
    artist: "Cozy Tape",
    url: proxied("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"),
  },
  {
    title: "Late Night Study",
    artist: "Cozy Tape",
    url: proxied("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"),
  },
  {
    title: "Brown Sugar Mood",
    artist: "Cozy Tape",
    url: proxied("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"),
  },
];

export default function MusicPlayer({ playing, setPlaying }) {
  const audioRef = useRef(null);
  const [trackIdx, setTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.55);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [playing, trackIdx, setPlaying]);

  const next = () => setTrackIdx((i) => (i + 1) % TRACKS.length);
  const prev = () =>
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);

  const t = TRACKS[trackIdx];

  return (
    <div className="cozy-card p-4 w-[300px]" data-testid="music-player">
      <audio
        ref={audioRef}
        src={t.url}
        onEnded={next}
        loop={false}
        crossOrigin="anonymous"
      />
      <div className="flex items-center gap-3">
        {/* Spinning vinyl */}
        <div className="relative w-14 h-14 shrink-0">
          <div
            className={`absolute inset-0 rounded-full ${playing ? "vinyl-spinning" : ""}`}
            style={{
              background:
                "radial-gradient(circle at center, #4a3b2c 0 30%, #1a1412 30% 100%)",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.6), 0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="absolute inset-[42%] rounded-full"
              style={{ background: "var(--terracotta)" }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-handwritten text-lg leading-tight truncate"
            style={{ color: "var(--text)" }}
            data-testid="music-track-title"
          >
            {t.title}
          </div>
          <div
            className="text-xs truncate"
            style={{ color: "var(--text-soft)" }}
          >
            {t.artist}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        <button
          onClick={prev}
          className="btn-ghost !px-2"
          data-testid="music-prev"
          aria-label="previous"
        >
          <SkipBack size={14} />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="btn-warm !px-3"
          data-testid="music-play-pause"
          aria-label="play/pause"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={next}
          className="btn-ghost !px-2"
          data-testid="music-next"
          aria-label="next"
        >
          <SkipForward size={14} />
        </button>
        <div className="flex items-center gap-1 ml-2 flex-1">
          <Volume2 size={14} style={{ color: "var(--text-soft)" }} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="cozy-range"
            data-testid="music-volume"
            aria-label="music volume"
          />
        </div>
      </div>
    </div>
  );
}
