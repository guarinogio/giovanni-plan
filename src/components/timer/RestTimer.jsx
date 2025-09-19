import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const Ctx = createContext(null);
export function useRestTimer() { return useContext(Ctx); }

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    o.start(); o.stop(ctx.currentTime + 0.35);
  } catch {}
}

async function ensurePerms() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const res = await Notification.requestPermission();
  return res === "granted";
}

async function swReady() {
  if (!("serviceWorker" in navigator)) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.active;
}

export function RestTimerProvider({ children }) {
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const tickRef = useRef(null);
  const idRef = useRef("main"); // id único para el timer global

  const localStart = (sec) => {
    clearInterval(tickRef.current);
    setDuration(sec);
    setSecondsLeft(sec);
    setActive(true);
    setPaused(false);
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (paused) return s;
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

  const pingSW = async () => {
    try {
      const sw = await swReady();
      sw?.postMessage({ type: "PING" });
    } catch {}
  };

  const start = async (sec) => {
    localStart(sec);
    if (await ensurePerms()) {
      const sw = await swReady();
      sw?.postMessage({ type: "TIMER_START", id: idRef.current, duration: sec, startAt: Date.now() });
    }
  };

  const pause = async () => {
    setPaused(true);
    const sw = await swReady();
    sw?.postMessage({ type: "TIMER_PAUSE", id: idRef.current });
  };

  const resume = async () => {
    setPaused(false);
    const sw = await swReady();
    sw?.postMessage({ type: "TIMER_RESUME", id: idRef.current });
  };

  const add = (sec) => setSecondsLeft((s) => Math.max(0, s + sec));

  const stop = async () => {
    clearInterval(tickRef.current);
    setActive(false); setPaused(false); setSecondsLeft(0); setDuration(0);
    const sw = await swReady();
    sw?.postMessage({ type: "TIMER_STOP", id: idRef.current });
  };

  const finish = () => {
    setActive(false); setPaused(false);
    if (navigator.vibrate) navigator.vibrate([180, 120, 180]);
    beep();
  };

  useEffect(() => {
    const onSWMsg = (e) => {
      const msg = e.data || {};
      if (msg.type === "TIMER_FINISHED" && msg.id === idRef.current) finish();
      if (msg.type === "TIMER_STOPPED" && msg.id === idRef.current) stop();
      if (msg.type === "TIMER_PAUSED" && msg.id === idRef.current) setPaused(true);
      if (msg.type === "TIMER_RESUMED" && msg.id === idRef.current) setPaused(false);
    };
    navigator.serviceWorker?.addEventListener?.("message", onSWMsg);
    const iv = setInterval(pingSW, 5000);
    return () => {
      navigator.serviceWorker?.removeEventListener?.("message", onSWMsg);
      clearInterval(iv); clearInterval(tickRef.current);
    };
  }, []);

  const value = useMemo(() => ({ active, paused, secondsLeft, duration, start, add, stop, pause, resume }), [active, paused, secondsLeft, duration]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
