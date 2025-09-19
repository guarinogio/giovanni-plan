import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initialValue; } catch { return initialValue; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}

export function roundToStep(v, step) { if (!step) return v; return Math.round(v / step) * step; }

export function setDeep(obj, path, value) {
  const clone = { ...obj };
  let cur = clone;
  for (let i = 0; i < path.length - 1; i++) { const k = path[i]; cur[k] = { ...cur[k] }; cur = cur[k]; }
  cur[path[path.length - 1]] = value;
  return clone;
}

export function formatDate(iso) {
  const d = new Date(iso);
  const dd = d.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" });
  const hh = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return dd + " " + hh;
}

export function createEmptySession(dayType, config, weights) {
  if (dayType === "A") return {
    preA:{done:[false,false,false,false]},
    squat:{topWeight:weights.squat,topReps:0,topRPE:8,backoffs:[{weight:roundToStep(weights.squat*0.9,config.rounding),reps:0},{weight:roundToStep(weights.squat*0.9,config.rounding),reps:0}]},
    bench:{weight:weights.bench,reps:[0,0,0]},
    row:{weight:weights.row,reps:[0,0,0]},
    hipthrust:{weight:weights.hipthrustAcc,reps:[0,0,0]},
    posturaBrazosA:{a:{weight:weights.facepulls,reps:[0,0,0]}, b:{weight:weights.curl,reps:[0,0,0]}},
    coreA:{weight:0,reps:[0,0]}, // sin peso
    piesA:{a:{weight:0,reps:[0,0,0]}, b:{weight:0,reps:[0,0,0]}}, // sin peso
    postA:{done:[false,false]}
  };
  if (dayType === "B") return {
    preB:{done:[false,false,false]},
    deadlift:{topWeight:weights.deadlift,topReps:0,topRPE:8,backoffs:[{weight:roundToStep(weights.deadlift*0.9,config.rounding),reps:0},{weight:roundToStep(weights.deadlift*0.9,config.rounding),reps:0}]},
    press:{weight:weights.press,reps:[0,0,0]},
    pulldown:{weight:weights.pulldown,reps:[0,0,0]},
    hipthrustB:{weight:weights.hipthrust,reps:[0,0,0]},
    gluteoMedio:{a:{weight:0,reps:[0,0,0]}, b:{weight:0,reps:[0,0,0]}}, // sin peso
    triceps:{weight:weights.triceps,reps:[0,0,0]},
    coreB:{weight:0,reps:[0,0]}, // sin peso
    piesB:{a:{weight:0,reps:[0,0,0]}, b:{weight:0,reps:[0,0,0]}}, // sin peso
    postB:{done:[false,false]}
  };
  return { morn:{done:[false,false,false,false,false,false]}, day:{done:[false,false,false,false,false]} };
}

export function applyProgressions({ weights, config, logs }) {
  const last = logs[logs.length - 1];
  const prev = logs.slice(0, -1).reverse();
  const hist = (k) => prev.filter((s)=>s.exercises[k]).map((s)=>s.exercises[k]);
  let next = { ...weights };

  if (last.exercises.squat) next.squat = evolveHeavy(weights.squat, [last.exercises.squat, ...hist("squat")], config);
  if (last.exercises.deadlift) next.deadlift = evolveHeavy(weights.deadlift, [last.exercises.deadlift, ...hist("deadlift")], config);
  if (last.exercises.bench) next.bench = evolveDouble(weights.bench, last.exercises.bench, config.benchIncrement, config.rounding);
  if (last.exercises.row) next.row = evolveDouble(weights.row, last.exercises.row, config.rowIncrement, config.rounding);
  if (last.exercises.press) next.press = evolveDouble(weights.press, last.exercises.press, config.pressIncrement, config.rounding);
  if (last.exercises.pulldown) next.pulldown = evolveDouble(weights.pulldown, last.exercises.pulldown, config.pulldownIncrement, config.rounding);
  if (last.exercises.hipthrustB) next.hipthrust = evolveDouble(weights.hipthrust, last.exercises.hipthrustB, config.hipthrustIncrement, config.rounding);

  next.hipthrustAcc = evolveAccessory(weights.hipthrustAcc ?? 0, last.exercises.hipthrust, [6,10], 2.5, config.rounding, true);
  if (last.exercises.posturaBrazosA) {
    next.facepulls = evolveAccessory(weights.facepulls ?? 0, last.exercises.posturaBrazosA?.a, [10,15], 2.5, config.rounding, true);
    next.curl = evolveAccessory(weights.curl ?? 0, last.exercises.posturaBrazosA?.b, [8,12], 2.5, config.rounding, true);
  }
  if (last.exercises.triceps) next.triceps = evolveAccessory(weights.triceps ?? 0, last.exercises.triceps, [8,12], 2.5, config.rounding, true);
  // sin peso: gluteoMedio, core, pies -> no cambian pesos recomendados

  return next;
}

export function evolveHeavy(current, sequence, config) {
  const ok = (s) => (s.topRPE ?? 10) <= 8 && (s.topReps ?? 0) >= 3 && (s.topReps ?? 0) <= 5;
  const fail = (s) => (s.topRPE ?? 10) > 8 || (s.topReps ?? 0) < 3;
  const a = sequence[0], b = sequence[1];
  if (a && b && ok(a) && ok(b)) return roundToStep(current + config.heavyIncrement, config.rounding);
  if (a && b && fail(a) && fail(b) && a.topWeight === b.topWeight) return roundToStep(current * 0.9, config.rounding);
  return current;
}

export function evolveDouble(current, now, inc, rounding) {
  const pass = now.reps.filter((r)=>(r ?? 0) >= 8).length === 3;
  if (pass) return roundToStep(current + inc, rounding);
  return current;
}

// data puede ser: {weight, reps:[...]} o {sets:[{reps...}]} o array de sets
export function evolveAccessory(current, data, [minRep, maxRep], inc, rounding, hasWeight = true) {
  if (!data) return current || 0;
  let reps = [];
  if (Array.isArray(data)) reps = data.map((s) => s?.reps ?? 0);
  else if (Array.isArray(data.sets)) reps = data.sets.map((s) => s?.reps ?? 0);
  else if (Array.isArray(data.reps)) reps = data.reps.map((r) => r ?? 0);
  const allAtTop = reps.length > 0 && reps.every((r) => r >= maxRep);
  const allTooLow = reps.length > 0 && reps.every((r) => r <= Math.max(0, minRep - 2));
  if (!hasWeight) return current || 0;
  if (allAtTop) return roundToStep((current || 0) + inc, rounding);
  if (allTooLow) return roundToStep(Math.max(0, (current || 0) - inc), rounding);
  return current || 0;
}

export function prettyExerciseRow(key, v) {
  const name = prettyName(key);
  if (v && v.topWeight !== undefined) return name + " Top " + v.topWeight + "×" + v.topReps + " RPE " + v.topRPE + " | Back-offs " + v.backoffs.map((b)=>b.weight+"×"+b.reps).join(", ");
  if (v && v.weight !== undefined && Array.isArray(v.reps)) return name + " " + v.weight + "×" + v.reps.join("/");
  if (v && v.a && v.b) {
    const left = (v.a.weight !== undefined ? v.a.weight + "×" : "") + (Array.isArray(v.a.reps) ? v.a.reps.join("/") : "");
    const right = (v.b.weight !== undefined ? v.b.weight + "×" : "") + (Array.isArray(v.b.reps) ? v.b.reps.join("/") : "");
    return name + " A:" + left + " · B:" + right;
  }
  if (v && v.done) return name + " " + v.done.filter(Boolean).length + "/" + v.done.length + " completados";
  return name;
}

export function prettyName(k) {
  const map = { preA:"Pre-Mov A", postA:"Post-Mov A", preB:"Pre-Mov B", postB:"Post-Mov B", morn:"Mov. Mañana", day:"Mov. Día", squat:"Sentadilla", deadlift:"Peso Muerto", bench:"Banca", row:"Remo", press:"Press", pulldown:"Jalón", hipthrust:"Hip Thrust", hipthrustB:"Hip Thrust (Fuerza)", posturaBrazosA:"Face Pulls + Curl", coreA:"Dead Bug", piesA:"Pies", gluteoMedio:"Abducciones", triceps:"Tríceps", coreB:"Core", piesB:"Pies" };
  return map[k] || k;
}
