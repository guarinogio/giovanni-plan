import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useLocalStorage, roundToStep, setDeep, formatDate, createEmptySession, applyProgressions, prettyExerciseRow } from "../lib/utils.js";

const Ctx = createContext(null);
export function usePlanStore() { return useContext(Ctx); }

function useLS(key, initial) {
  return useLocalStorage ? useLocalStorage(key, initial) : useState(initial);
}

export function PlanStoreProvider({ children }) {
  const [tab, setTab] = useState("sesion");
  const [dayType, setDayType] = useState("A");
  const [config, setConfig] = useLS("giov_plan_config", {
    units: "kg", rounding: 0.5, heavyIncrement: 5, heavySmallIncrement: 2.5, benchIncrement: 2.5, pressIncrement: 2.5, rowIncrement: 5, pulldownIncrement: 2.5, hipthrustIncrement: 5,
    variants: { squat: "Box Squat", deadlift: "Trap Bar", bench: "Press de Banca", press: "Press Inclinado", row: "Remo con Pecho Apoyado", pulldown: "Jalón Supino" }
  });
  const [weights, setWeights] = useLS("giov_plan_weights", {
    squat: 60, deadlift: 80, bench: 50, press: 40, row: 60, pulldown: 50, hipthrust: 80,
    hipthrustAcc: 40, facepulls: 15, curl: 10, triceps: 15, calves: 40, tibialis: 10
  });
  const [logs, setLogs] = useLS("giov_plan_logs", []);
  const [lastType, setLastType] = useLS("giov_plan_lastType", null);
  const [sessionInputs, setSessionInputs] = useState(createEmptySession(dayType, config, weights));
  const today = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    const s = lastType === "A" ? "B" : lastType === "B" ? "Movilidad" : lastType === "Movilidad" ? "A" : "A";
    setDayType(s);
    setSessionInputs(createEmptySession(s, config, weights));
  }, []);

  useEffect(() => { setSessionInputs(createEmptySession(dayType, config, weights)); }, [dayType, config, weights]);

  const exportCSV = () => {
    const lastFor = (key) => { const f = [...logs].reverse().find((l) => l.exercises[key]); return f ? { date: f.date, data: f.exercises[key] } : null; };
    const lifts = [
      { key: "squat", name: "Sentadilla — " + config.variants.squat, scheme: "Top 3-5 + 2x5@90%", rec: weights.squat },
      { key: "deadlift", name: "Peso Muerto — " + config.variants.deadlift, scheme: "Top 3-5 + 2x5@90%", rec: weights.deadlift },
      { key: "bench", name: "Press de Banca", scheme: "3x5-8", rec: weights.bench },
      { key: "row", name: "Remo — " + config.variants.row, scheme: "3x6-10", rec: weights.row },
      { key: "press", name: config.variants.press, scheme: "3x5-8", rec: weights.press },
      { key: "pulldown", name: config.variants.pulldown, scheme: "3x6-10", rec: weights.pulldown },
      { key: "hipthrustB", name: "Hip Thrust (Fuerza)", scheme: "3x6-10", rec: weights.hipthrust },
      { key: "hipthrust", name: "Hip Thrust (Accesorio)", scheme: "3x6-10", rec: weights.hipthrustAcc },
      { key: "posturaBrazosA", name: "Face Pulls + Curl", scheme: "3x10-15 + 3x8-12", rec: `${weights.facepulls}/${weights.curl}` },
      { key: "triceps", name: "Tríceps cuerda", scheme: "3x8-12", rec: weights.triceps },
      { key: "piesA/piesB", name: "Gemelos + Tibialis", scheme: "3x10-15 + 3x12-20", rec: `${weights.calves}/${weights.tibialis}` }
    ];
    const rows = [["ejercicio","variante_o_nombre","peso_recomendado","unidades","esquema","ultima_fecha","ultimo_detalle"],...lifts.map((l)=>{const k=l.key.includes("/")?null:l.key;const last=k?lastFor(k):null;let d="";if(last){const v=last.data;if(v?.topWeight!==undefined)d=v.topWeight+"x"+v.topReps+" RPE "+v.topRPE;else if(v?.weight!==undefined&&v?.reps)d=v.weight+"x"+v.reps.join("/");}return [l.key,l.name,l.rec,config.units,l.scheme,last?formatDate(last.date):"",d];})];
    const esc=(x)=>{const s=String(x??"");const q=s.includes(",")||s.includes('"')||s.includes("\n");return q?'"'+s.replace(/"/g,'""')+'"':s};
    const csv=rows.map(r=>r.map(esc).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="giovanni-fuerza-"+new Date().toISOString().slice(0,10)+".csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    const ok = window.confirm("¿Seguro que quieres borrar todos los datos y reiniciar la app? Esta acción no se puede deshacer.");
    if (!ok) return;
    localStorage.clear();
    location.reload();
  };

  const handleInput = (path, value) => { setSessionInputs((prev)=>setDeep(prev, path, value)); };

  const completeSession = () => {
    const stamped = { date: today, dayType, exercises: sessionInputs };
    const newLogs = [...logs, stamped];
    const nextWeights = applyProgressions({ weights, config, logs: newLogs });
    setLogs(newLogs);
    setWeights(nextWeights);
    setLastType(dayType);
    setSessionInputs(createEmptySession(dayType, config, nextWeights));
    setTab("historial");
  };

  const value = { tab, setTab, dayType, setDayType, config, setConfig, weights, setWeights, logs, setLogs, lastType, setLastType, sessionInputs, handleInput, completeSession, exportCSV, resetAll, roundToStep, prettyExerciseRow };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
