import React, { useState } from "react";
import { useRestTimer } from "./RestTimer.jsx";

/**
 * Control del temporizador de descanso.
 * - Cuando está activo, el reloj usa una cápsula invertida (contraste) y pulso suave.
 * - En pausa, el pulso se detiene.
 */
export default function RestTimerControl() {
  const t = useRestTimer();
  const [inputSec, setInputSec] = useState(90);
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="w-full">
      {!t.active ? (
        /* Estado inactivo: configurador */
        <div className="flex flex-wrap items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl px-2 py-2">
          <span className="text-xs text-neutral-600 dark:text-neutral-300">⏱ Descanso</span>

          <div className="flex items-center gap-1">
            <input
              type="number"
              min={10}
              step={5}
              value={inputSec}
              onChange={(e) => setInputSec(Math.max(10, parseInt(e.target.value || 10)))}
              className="input w-20 text-sm"
            />
            <span className="text-xs text-neutral-500">s</span>
          </div>

          <div className="flex gap-1">
            {[60, 90, 120, 180].map((s) => (
              <button key={s} onClick={() => setInputSec(s)} className="btn text-xs px-2 py-1">
                {s}s
              </button>
            ))}
          </div>

          <button
            onClick={() => t.start(inputSec)}
            className="ml-auto inline-flex items-center rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm px-3 py-1.5"
          >
            Start
          </button>
        </div>
      ) : (
        /* Estado activo: reloj destacado */
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl px-2 py-2">
          <span
            className={
              "time-badge " + (t.paused ? "" : "timer-pulse")
            }
          >
            {fmt(t.secondsLeft)}
          </span>
          <span className="text-[10px] opacity-70">/ {t.duration}s</span>

          <div className="flex gap-1 ml-auto">
            {!t.paused && (
              <button onClick={t.pause} className="btn text-xs px-2 py-1">
                Pausa
              </button>
            )}
            {t.paused && (
              <button onClick={t.resume} className="btn text-xs px-2 py-1">
                Resume
              </button>
            )}
            <button onClick={() => t.add(-10)} className="btn text-xs px-2 py-1">
              -10
            </button>
            <button onClick={() => t.add(+10)} className="btn text-xs px-2 py-1">
              +10
            </button>
            <button
              onClick={t.stop}
              className="text-xs px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
