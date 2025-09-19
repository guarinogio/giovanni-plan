import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const Ctx = createContext(null);

export function useRestTimer() {
  return useContext(Ctx);
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    o.start();
    o.stop(ctx.currentTime + 0.35);
  } catch {}
}

export function RestTimerProvider({ children }) {
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const tickRef = useRef(null);

  const start = (sec) => {
    clearInterval(tickRef.current);
    setDuration(sec);
    setSecondsLeft(sec);
    setActive(true);
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        const n = s - 1;
        if (n <= 0) {
          clearInterval(tickRef.current);
          finish();
          return 0;
        }
        return n;
      });
    }, 1000);
  };

  const add = (sec) => setSecondsLeft((s) => Math.max(0, s + sec));
  const stop = () => {
    clearInterval(tickRef.current);
    setActive(false);
    setSecondsLeft(0);
    setDuration(0);
  };

  const finish = () => {
    setActive(false);
    if (navigator.vibrate) navigator.vibrate([180, 120, 180]);
    beep();
  };

  useEffect(() => () => clearInterval(tickRef.current), []);

  const value = useMemo(() => ({ active, secondsLeft, duration, start, add, stop }), [active, secondsLeft, duration]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
