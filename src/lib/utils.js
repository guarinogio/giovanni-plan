import { useEffect, useState } from "react";

/* ---------- storage helpers ---------- */
export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

export function setDeep(obj, pathArr, value) {
  const next = structuredClone(obj);
  let cur = next;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const k = pathArr[i];
    cur[k] = cur[k] ?? {};
    cur = cur[k];
  }
  cur[pathArr[pathArr.length - 1]] = value;
  return next;
}

export function roundToStep(x, step = 0.5) {
  if (!Number.isFinite(x)) return 0;
  const r = Math.round(x / step) * step;
  return parseFloat(r.toFixed(3));
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString();
}

/* ---------- pretty print for History ---------- */
export function prettyExerciseRow(key, v) {
  if (!v) return `${key}`;
  const w = (x) => (x ?? 0);
  if (v.topWeight !== undefined) {
    const bo = v.backoffs?.map(b => `${w(b.weight)}×${w(b.reps)}`).join(", ");
    return `${key}: Top ${w(v.topWeight)}×${w(v.topReps)} RPE ${w(v.topRPE)}; BO ${bo || "—"}`;
  }
  if (Array.isArray(v.reps)) {
    return `${key}: ${w(v.weight)} kg · reps ${v.reps.join("/")}`;
  }
  if (v.a || v.b) {
    const a = v.a ? `${w(v.a.weight)}kg · ${v.a.reps.join("/")}` : "—";
    const b = v.b ? `${w(v.b.weight)}kg · ${v.b.reps.join("/")}` : "—";
    return `${key}: A(${a}) · B(${b})`;
  }
  if (v.done) return `${key}: ${v.done.map(x=>x?"✓":"—").join(" ")}`;
  return `${key}`;
}

/* ---------- session template ---------- */
export function createEmptySession(dayType, config, weights) {
  const kg = config.units;
  const r = config.rounding;

  const heavyTpl = (base) => ({
    topWeight: roundToStep(base, r),
    topReps: 0,
    topRPE: 8,
    backoffs: [
      { weight: roundToStep(base * 0.9, r), reps: 0 },
      { weight: roundToStep(base * 0.9, r), reps: 0 },
    ],
  });

  const doubleTpl = (base) => ({
    weight: roundToStep(base, r),
    reps: [0,0,0],
  });

  const accTpl = (withWeight, base = 0, sets = 3) => ({
    ...(withWeight ? { weight: roundToStep(base, r) } : {}),
    reps: Array.from({ length: sets }, () => 0),
  });

  const session = {
    preA: { done: [false,false,false,false] },
    squat: heavyTpl(weights.squat),
    bench: doubleTpl(weights.bench),
    row: doubleTpl(weights.row),
    hipthrust: accTpl(true, weights.hipthrustAcc),

    posturaBrazosA: {
      a: accTpl(true, weights.facepulls),
      b: accTpl(true, weights.curl),
    },
    coreA: accTpl(false, 0, 3),
    piesA: { a: accTpl(false, 0), b: accTpl(false, 0) },
    postA: { done: [false,false] },

    preB: { done: [false,false,false] },
    deadlift: heavyTpl(weights.deadlift),
    press: doubleTpl(weights.press),
    pulldown: doubleTpl(weights.pulldown),
    hipthrustB: doubleTpl(weights.hipthrust),

    gluteoMedio: { a: accTpl(false, 0, 3), b: accTpl(false, 3, 3) },
    triceps: accTpl(true, weights.triceps),
    coreB: accTpl(false, 0, 3),
    piesB: { a: accTpl(false, 0), b: accTpl(false, 0) },
    postB: { done: [false,false] },

    morn: { done: [false,false,false,false,false,false] },
    day: { done: [false,false,false,false,false] },
  };

  if (dayType === "A") return session;
  if (dayType === "B") {
    session.preA = undefined; session.postA = undefined;
    return session;
  }
  // Movilidad
  return {
    morn: session.morn,
    day: session.day,
  };
}

/* ---------- progression engine ---------- */
/*
  Reglas implementadas (resumen):
  - Heavy (sentadilla / muerto): si los ÚLTIMOS DOS top sets fueron OK (reps 3–5 y RPE ≤ 8),
    sube +incremento. Si los últimos dos fueron malos (RPE > 8 o reps < 3), deload 10%.
    En cualquier caso, el peso tomado como base es el ÚLTIMO USADO (manual o recomendado).
  - Doble progresión (banca/press/remos/jalones/hipthrustB): si en la última sesión reps >= 8 en las 3 series,
    sube incremento; si no, mantiene el último peso usado.
  - Accesorios con peso (hipthrust accesorio / facepulls / curl / triceps): si reps medias >= 12, + incremento pequeño.
*/
export function applyProgressions({ weights, config, logs }) {
  const inc = {
    heavyBig: config.heavyIncrement ?? 5,
    heavySmall: config.heavySmallIncrement ?? 2.5,
    bench: config.benchIncrement ?? 2.5,
    press: config.pressIncrement ?? 2.5,
    row: config.rowIncrement ?? 5,
    pulldown: config.pulldownIncrement ?? 2.5,
    hip: config.hipthrustIncrement ?? 5,
    small: 2.5,
  };
  const round = (x) => roundToStep(x, config.rounding);

  const last = logs[logs.length - 1]?.exercises || {};
  const prev = logs[logs.length - 2]?.exercises || {};

  const next = { ...weights };

  /* ---- helpers ---- */
  const getHeavy = (k) => {
    const cur = last[k];
    if (!cur) return null;
    return {
      used: Number(cur.topWeight) || weights[k],
      reps: Number(cur.topReps) || 0,
      rpe: Number(cur.topRPE) || 10,
    };
  };

  const wasOK = (h) => h && h.reps >= 3 && h.reps <= 5 && h.rpe <= 8;

  const heavyKeys = ["squat", "deadlift"];
  heavyKeys.forEach((k) => {
    const L = getHeavy(k);
    if (!L) return;
    const P = prev[k] ? {
      used: Number(prev[k].topWeight) || weights[k],
      reps: Number(prev[k].topReps) || 0,
      rpe: Number(prev[k].topRPE) || 10,
    } : null;

    // base siempre = último peso usado (respeta cambios manuales)
    let base = L.used;

    if (wasOK(L) && wasOK(P)) {
      base = base + (inc.heavyBig || 5);
    } else {
      const bad = (x) => !x || x.reps < 3 || x.rpe > 8;
      if (bad(L) && bad(P)) base = base * 0.9; // deload
    }
    next[k] = round(base);
  });

  const dbl = [
    { k: "bench", add: inc.bench || 2.5 },
    { k: "press", add: inc.press || 2.5 },
    { k: "row", add: inc.row || 5 },
    { k: "pulldown", add: inc.pulldown || 2.5 },
    { k: "hipthrust", add: inc.hip || 5, src: "hipthrustB" }, // fuerza en B
  ];
  dbl.forEach(({ k, add, src }) => {
    const ek = src || k;
    const cur = last[ek];
    if (!cur) return;
    const used = Number(cur.weight) || weights[k];
    const reps = Array.isArray(cur.reps) ? cur.reps.map(x => Number(x) || 0) : [];
    let base = used; // respeta edición manual

    if (reps.length >= 3 && reps.every((r) => r >= 8)) {
      base = base + add;
    }
    next[k] = round(base);
  });

  // accesorios con peso individual
  const accList = [
    { k: "hipthrustAcc", src: "hipthrust", add: inc.small },
    { k: "facepulls", src: "posturaBrazosA", path: "a", add: inc.small },
    { k: "curl", src: "posturaBrazosA", path: "b", add: inc.small },
    { k: "triceps", src: "triceps", add: inc.small },
  ];
  accList.forEach(({ k, src, path, add }) => {
    const cur = last[src];
    if (!cur) return;
    const node = path ? cur[path] : cur;
    if (!node) return;
    const used = typeof node.weight === "number" ? node.weight : weights[k];
    const reps = Array.isArray(node.reps) ? node.reps : [];
    let base = used; // respeta manual
    const avg = reps.length ? reps.reduce((a,b)=>a+(Number(b)||0),0)/reps.length : 0;
    if (avg >= 12) base = base + add;
    next[k] = round(base);
  });

  return next;
}
