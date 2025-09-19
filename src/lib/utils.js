export const roundToStep = (n, step = 0.5) => {
  if (!Number.isFinite(n)) return 0;
  const r = Math.round(n / step) * step;
  return parseFloat(r.toFixed(3));
};

export const formatDate = (iso) => {
  try { return new Date(iso).toLocaleDateString(); } catch { return ""; }
};

export const setDeep = (obj, path, value) => {
  const copy = JSON.parse(JSON.stringify(obj));
  let cur = copy;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
  return copy;
};

export const createEmptySession = (dayType, config, weights) => {
  const z = { done: [] };
  const heavy = { topWeight: 0, topReps: 0, topRPE: 8, backoffs: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }] };
  const triple = { weight: 0, reps: [0, 0, 0] };
  const pair = { a: { weight: 0, reps: [0, 0, 0] }, b: { weight: 0, reps: [0, 0, 0] } };
  if (dayType === "A") {
    return {
      preA: z,
      squat: heavy,
      bench: { ...triple, weight: 0 },
      row: { ...triple, weight: 0 },
      hipthrust: { ...triple, weight: 0 },
      posturaBrazosA: { a: { weight: 0, reps: [0, 0, 0] }, b: { weight: 0, reps: [0, 0, 0] } },
      coreA: { reps: [0, 0, 0] },
      piesA: { a: { reps: [0, 0, 0] }, b: { reps: [0, 0, 0] } },
      postA: z
    };
  }
  if (dayType === "B") {
    return {
      preB: z,
      deadlift: heavy,
      press: { ...triple, weight: 0 },
      pulldown: { ...triple, weight: 0 },
      hipthrustB: { ...triple, weight: 0 },
      gluteoMedio: { a: { reps: [0, 0, 0] }, b: { reps: [0, 0, 0] } },
      triceps: { ...triple, weight: 0 },
      coreB: { reps: [0, 0, 0] },
      piesB: { a: { reps: [0, 0, 0] }, b: { reps: [0, 0, 0] } },
      postB: z
    };
  }
  return {
    morn: z,
    day: z
  };
};

const getLastSessions = (logs, key, n = 3) => {
  const arr = [];
  for (let i = logs.length - 1; i >= 0 && arr.length < n; i--) {
    const ex = logs[i]?.exercises?.[key];
    if (ex) arr.push(ex);
  }
  return arr;
};

const lastUsedWeight = (entry) => {
  if (!entry) return 0;
  if (entry.topWeight != null) return entry.topWeight;
  if (typeof entry.weight === "number") return entry.weight;
  if (entry.sets && Array.isArray(entry.sets)) {
    const w = entry.sets.map(s => s?.weight).find(v => typeof v === "number");
    if (typeof w === "number") return w;
  }
  if (Array.isArray(entry.reps)) return entry.weight || 0;
  return 0;
};

const minReps = (arr) => Math.min(...arr.map(v => Math.max(0, v || 0)));
const allAtLeast = (arr, x) => arr.every(v => (v || 0) >= x);
const allAtMost = (arr, x) => arr.every(v => (v || 0) <= x);

export const applyProgressions = ({ weights, config, logs }) => {
  const w = { ...weights };
  const step = config.rounding || 0.5;

  const inc = {
    bench: config.benchIncrement ?? 2.5,
    press: config.pressIncrement ?? 2.5,
    row: config.rowIncrement ?? 5,
    pulldown: config.pulldownIncrement ?? 2.5,
    hipthrust: config.hipthrustIncrement ?? 5
  };
  const heavyInc = config.heavyIncrement ?? 5;

  const heavyRule = (key) => {
    const last = getLastSessions(logs, key, 2);
    const cur = last[0];
    const lw = roundToStep(lastUsedWeight(cur) || w[key], step);
    w[key] = lw;
    if (last.length >= 2) {
      const ok2 = last.slice(0, 2).every(s => (s.topRPE || 10) <= 8 && (s.topReps || 0) >= 3);
      const bad2 = last.slice(0, 2).every(s => (s.topRPE || 10) > 8 || (s.topReps || 0) < 3);
      if (ok2) w[key] = roundToStep(lw + heavyInc, step);
      else if (bad2) w[key] = roundToStep(lw * 0.9, step);
    }
  };

  const doubleRule = (key, upInc) => {
    const last = getLastSessions(logs, key, 2);
    const cur = last[0];
    const lw = roundToStep(lastUsedWeight(cur) || w[key], step);
    w[key] = lw;
    if (!cur) return;
    const reps = Array.isArray(cur.reps) ? cur.reps : [];
    const top = allAtLeast(reps, 8);
    const low = last.length >= 2 && last.every(s => allAtMost(Array.isArray(s.reps) ? s.reps : [], 5));
    if (top) w[key] = roundToStep(lw + upInc, step);
    else if (low) w[key] = roundToStep(Math.max(step, lw - upInc), step);
  };

  const accRule = (key, low, high, upInc) => {
    const last = getLastSessions(logs, key, 2);
    const cur = last[0];
    const lw = roundToStep(lastUsedWeight(cur) || w[key], step);
    w[key] = lw;
    if (!cur) return;
    const reps = Array.isArray(cur.reps) ? cur.reps : [];
    const top = allAtLeast(reps, high);
    const low2 = last.length >= 2 && last.every(s => {
      const rs = Array.isArray(s.reps) ? s.reps : [];
      return allAtMost(rs, low);
    });
    if (top) w[key] = roundToStep(lw + upInc, step);
    else if (low2) w[key] = roundToStep(Math.max(step, lw - upInc), step);
  };

  heavyRule("squat");
  heavyRule("deadlift");
  doubleRule("bench", inc.bench);
  doubleRule("press", inc.press);
  doubleRule("row", inc.row);
  doubleRule("pulldown", inc.pulldown);
  doubleRule("hipthrust", inc.hipthrust);
  accRule("hipthrustAcc", 6, 10, inc.hipthrust);
  accRule("facepulls", 10, 15, 1);
  accRule("curl", 8, 12, 1);
  accRule("triceps", 8, 12, 1);

  return w;
};

export const prettyExerciseRow = (k, v) => {
  const u = (x) => (Number.isFinite(x) ? x : 0);
  if (v?.topWeight != null) return `${k}: ${u(v.topWeight)}x${u(v.topReps)} RPE ${u(v.topRPE)} · BO ${u(v.backoffs?.[0]?.weight)}x${u(v.backoffs?.[0]?.reps)}/${u(v.backoffs?.[1]?.weight)}x${u(v.backoffs?.[1]?.reps)}`;
  if (typeof v?.weight === "number" && Array.isArray(v?.reps)) return `${k}: ${u(v.weight)} × [${v.reps.map(u).join("/")}]`;
  if (Array.isArray(v?.a?.reps) || Array.isArray(v?.b?.reps)) return `${k}: A [${(v.a?.reps||[]).map(u).join("/")}] · B [${(v.b?.reps||[]).map(u).join("/")}]`;
  if (Array.isArray(v?.reps)) return `${k}: [${v.reps.map(u).join("/")}]`;
  return `${k}`;
};
