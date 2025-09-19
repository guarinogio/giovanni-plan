/* eslint-disable no-undef */
import { precacheAndRoute } from "workbox-precaching";

// >>> Punto de inyección requerido por injectManifest:
precacheAndRoute(self.__WB_MANIFEST || []);

// ====== LÓGICA DE TIMER CON NOTIFICACIONES ======
const timers = new Map();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const r = Math.max(0, sec % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

async function broadcast(msg) {
  const cs = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
  cs.forEach((c) => c.postMessage(msg));
}

async function showTick(id) {
  const t = timers.get(id);
  if (!t) return;
  const left = Math.max(0, Math.round((t.endAt - Date.now()) / 1000));
  const title = t.paused ? "Descanso (pausado)" : "Descanso";
  const body = t.paused ? `Pausado en ${fmt(t.leftWhenPaused)}` : `Quedan ${fmt(left)}`;
  const actions = t.paused
    ? [{ action: "resume", title: "▶️ Reanudar" }, { action: "stop", title: "⛔️ Stop" }]
    : [{ action: "pause", title: "⏸️ Pausa" }, { action: "stop", title: "⛔️ Stop" }];

  await self.registration.showNotification(title, {
    body,
    tag: `rest-timer-${id}`,
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: t.paused ? undefined : [80],
    badge: "/pwa-192x192.png",
    icon: "/pwa-192x192.png",
    actions
  });

  if (!t.paused && left <= 0) {
    clearInterval(t.iv);
    timers.delete(id);
    await self.registration.showNotification("¡Descanso listo!", {
      body: "Siguiente serie ✅",
      tag: `rest-timer-${id}-done`,
      vibrate: [200, 120, 200],
      badge: "/pwa-192x192.png",
      icon: "/pwa-512x512.png"
    });
    await broadcast({ type: "TIMER_FINISHED", id });
  }
}

function ensureTicking(id) {
  const t = timers.get(id);
  if (!t) return;
  clearInterval(t.iv);
  t.iv = setInterval(() => showTick(id), 1000);
}

self.addEventListener("message", (e) => {
  const { type, id, duration, startAt } = e.data || {};
  if (type === "TIMER_START") {
    const endAt = (startAt || Date.now()) + duration * 1000;
    const obj = timers.get(id) || {};
    obj.endAt = endAt;
    obj.paused = false;
    timers.set(id, obj);
    ensureTicking(id);
    showTick(id);
  } else if (type === "TIMER_STOP") {
    const t = timers.get(id);
    if (t) {
      clearInterval(t.iv);
      timers.delete(id);
    }
    broadcast({ type: "TIMER_STOPPED", id });
  } else if (type === "TIMER_PAUSE") {
    const t = timers.get(id);
    if (!t) return;
    t.paused = true;
    t.leftWhenPaused = Math.max(0, Math.round((t.endAt - Date.now()) / 1000));
    clearInterval(t.iv);
    showTick(id);
    broadcast({ type: "TIMER_PAUSED", id, left: t.leftWhenPaused });
  } else if (type === "TIMER_RESUME") {
    const t = timers.get(id);
    if (!t) return;
    const base = t.leftWhenPaused || Math.max(0, Math.round((t.endAt - Date.now()) / 1000));
    t.endAt = Date.now() + base * 1000;
    t.paused = false;
    ensureTicking(id);
    showTick(id);
    broadcast({ type: "TIMER_RESUMED", id });
  } else if (type === "PING") {
    // keep-alive
  }
});

self.addEventListener("notificationclick", (event) => {
  const tag = event.notification.tag || "";
  const id = tag.replace("rest-timer-", "").replace("-done", "");
  event.notification.close();

  if (event.action === "pause") {
    self.registration.active?.postMessage({ type: "TIMER_PAUSE", id });
  } else if (event.action === "resume") {
    self.registration.active?.postMessage({ type: "TIMER_RESUME", id });
  } else if (event.action === "stop") {
    self.registration.active?.postMessage({ type: "TIMER_STOP", id });
  } else {
    event.waitUntil(self.clients.openWindow("/"));
  }
});
