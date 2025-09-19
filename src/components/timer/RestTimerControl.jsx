import React, { useState } from "react";
import { useRestTimer } from "./RestTimer.jsx";

export default function RestTimerControl() {
  const t = useRestTimer();
  const [inputSec, setInputSec] = useState(90);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  };

  return (
    <div className="w-full">
      {!t.active ? (
        <div className="flex flex-wrap items-center gap-2 bg-neutral-100 rounded-xl px-2 py-2">
          <span className="text-xs text-neutral-600">⏱ Descanso</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={10}
              step={5}
              value={inputSec}
              onChange={(e) => setInputSec(Math.max(5, parseInt(e.target.value || "0", 10)))}
              className="w-16 px-2 py-1 rounded-lg bg-white text-sm"
              aria-label="segundos de descanso"
            />
            <span className="text-xs text-neutral-500">s</span>
          </div>
          <div className="flex gap-1">
            {[60, 90, 120, 180].map((p) => (
              <button
                key={p}
                onClick={() => setInputSec(p)}
                className="text-xs px-2 py-1 rounded-lg bg-white hover:bg-neutral-50"
              >
                {p}s
              </button>
            ))}
          </div>
          <button
            onClick={() => t.start(inputSec)}
            className="ml-auto text-xs px-3 py-1 rounded-lg bg-emerald-600 text-white"
          >
            Start
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 bg-neutral-900 text-white rounded-xl px-3 py-2">
          <span className="text-xs opacity-80">⏱</span>
          <span className="text-base font-semibold tabular-nums">{fmt(t.secondsLeft)}</span>
          <span className="text-[10px] opacity-70">/ {t.duration}s</span>
          <div className="flex gap-1 ml-auto">
            <button onClick={() => t.add(-10)} className="text-xs px-2 py-1 rounded-lg bg-neutral-700">
              -10
            </button>
            <button onClick={() => t.add(+10)} className="text-xs px-2 py-1 rounded-lg bg-neutral-700">
              +10
            </button>
            <button onClick={t.stop} className="text-xs px-3 py-1 rounded-lg bg-red-600">
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
