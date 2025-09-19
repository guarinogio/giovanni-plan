import React, { useEffect, useMemo, useState } from "react";
import ToggleGroup from "./components/ui/ToggleGroup.jsx";
import NumberRow from "./components/ui/NumberRow.jsx";
import SelectRow from "./components/ui/SelectRow.jsx";
import PlanText from "./plan/PlanText.jsx";
import HeavyLiftCard from "./components/cards/HeavyLiftCard.jsx";
import DoubleProgCard from "./components/cards/DoubleProgCard.jsx";
import AccessoryCard from "./components/cards/AccessoryCard.jsx";
import AccessoryPairCard from "./components/cards/AccessoryPairCard.jsx";
import StaticListCard from "./components/cards/StaticListCard.jsx";
import { useLocalStorage, roundToStep, setDeep, formatDate, createEmptySession, applyProgressions, prettyExerciseRow } from "./lib/utils.js";

export default function MobilePlanGiovanni() {
  const [tab, setTab] = useState("sesion");
  const [dayType, setDayType] = useState("A");
  const [config, setConfig] = useLocalStorage("giov_plan_config", {
    units: "kg",
    rounding: 0.5,
    heavyIncrement: 5,
    heavySmallIncrement: 2.5,
    benchIncrement: 2.5,
    pressIncrement: 2.5,
    rowIncrement: 5,
    pulldownIncrement: 2.5,
    hipthrustIncrement: 5,
    variants: { squat: "Box Squat", deadlift: "Trap Bar", bench: "Press de Banca", press: "Press Inclinado", row: "Remo con Pecho Apoyado", pulldown: "Jalón Supino" }
  });

  const [weights, setWeights] = useLocalStorage("giov_plan_weights", {
    squat: 60, deadlift: 80, bench: 50, press: 40, row: 60, pulldown: 50, hipthrust: 80,
    hipthrustAcc: 40, facepulls: 15, curl: 10, triceps: 15, calves: 40, tibialis: 10
  });

  const [logs, setLogs] = useLocalStorage("giov_plan_logs", []);
  const [lastType, setLastType] = useLocalStorage("giov_plan_lastType", null);
  const [sessionInputs, setSessionInputs] = useState(createEmptySession(dayType, config, weights));

  useEffect(() => {
    const s = lastType === "A" ? "B" : lastType === "B" ? "Movilidad" : lastType === "Movilidad" ? "A" : "A";
    setDayType(s);
    setSessionInputs(createEmptySession(s, config, weights));
  }, []);

  useEffect(() => {
    setSessionInputs(createEmptySession(dayType, config, weights));
  }, [dayType, config, weights]);

  const today = useMemo(() => new Date().toISOString(), []);
  const lastFor = (key) => { const f = [...logs].reverse().find((l) => l.exercises[key]); return f ? { date: f.date, data: f.exercises[key] } : null; };

  const exportCSV = () => {
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
    const rows = [["ejercicio","variante_o_nombre","peso_recomendado","unidades","esquema","ultima_fecha","ultimo_detalle"],...lifts.map((l)=>{const k=(l.key.includes("/"))?null:l.key;const last=k?lastFor(k):null;let d="";if(last){const v=last.data;if(v?.topWeight!==undefined)d=v.topWeight+"x"+v.topReps+" RPE "+v.topRPE;else if(v?.weight!==undefined&&v?.reps)d=v.weight+"x"+v.reps.join("/");}return [l.key,l.name,l.rec,config.units,l.scheme,last?formatDate(last.date):"",d];})];
    const esc=(x)=>{const s=String(x??"");const q=s.includes(",")||s.includes('"')||s.includes("\n");return q?'"'+s.replace(/"/g,'""')+'"':s};
    const csv=rows.map(r=>r.map(esc).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="giovanni-fuerza-"+new Date().toISOString().slice(0,10)+".csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  };

  const resetAllStorage = () => { localStorage.clear(); location.reload(); };
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

  const planHeader = (
    <header className="px-4 pt-4 pb-3 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-black text-base">Plan de Fuerza + Accesorios — Giovanni</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={exportCSV}>⬇️ CSV</button>
          <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={resetAllStorage}>🧹 Reset</button>
          <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={()=>setTab("ajustes")}>⚙️</button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <TabButton active={tab==="sesion"} onClick={()=>setTab("sesion")}>Sesión</TabButton>
        <TabButton active={tab==="plan"} onClick={()=>setTab("plan")}>Plan</TabButton>
        <TabButton active={tab==="historial"} onClick={()=>setTab("historial")}>Historial</TabButton>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {planHeader}

      {tab === "sesion" && (
        <main className="p-4 space-y-4 pb-36">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-neutral-500">Sugerido</div>
            <div className="flex items-center gap-2 mt-2">
              <ToggleGroup options={["A","B","Movilidad"]} value={dayType} onChange={setDayType} />
              <div className="ml-auto text-xs text-neutral-500">Último: {lastType ?? "—"}</div>
            </div>
          </div>

          {dayType === "A" && (
            <div className="space-y-4">
              <StaticListCard title="Pre-Movilidad" hint="5–8 min rápido" items={[{n:"Respiración 360°",rec:"2×5"},{n:"Cat-Camel",rec:"1×8"},{n:"90/90 cadera",rec:"1×6/lado"},{n:"Tobillo rocks",rec:"1×10/lado"}]} state={sessionInputs.preA} setState={(p)=>handleInput(["preA"],p)} />
              <HeavyLiftCard title={"Sentadilla — " + config.variants.squat} hint={"Top 3–5 @ RPE8 · Back-offs 2×5 @ ~90% (~"+roundToStep(weights.squat*0.9,config.rounding)+" "+config.units+")"} state={sessionInputs.squat} setState={(p)=>handleInput(["squat"],p)} rounding={config.rounding} units={config.units} />
              <DoubleProgCard title="Press de Banca" hint={"3×5–8 @ "+weights.bench+" "+config.units} state={sessionInputs.bench} setState={(p)=>handleInput(["bench"],p)} units={config.units} rounding={config.rounding} rec={weights.bench} />
              <DoubleProgCard title={"Remo — "+config.variants.row} hint={"3×6–10 @ "+weights.row+" "+config.units} state={sessionInputs.row} setState={(p)=>handleInput(["row"],p)} units={config.units} rounding={config.rounding} rec={weights.row} />
              <AccessoryCard title="Hip Thrust" hint="3×6–10" state={sessionInputs.hipthrust} setState={(p)=>handleInput(["hipthrust"],p)} units={config.units} rec={weights.hipthrustAcc} withWeight />
              <AccessoryPairCard title="Postura + Brazos" hint="Face Pulls 3×10–15 · Curl Martillo 3×8–12" aLabel="Face Pulls" bLabel="Curl Martillo" state={sessionInputs.posturaBrazosA} setState={(p)=>handleInput(["posturaBrazosA"],p)} units={config.units} aRec={weights.facepulls} bRec={weights.curl} aWithWeight bWithWeight />
              <AccessoryCard title="Core: Dead Bug" hint="3×8–10" state={sessionInputs.coreA} setState={(p)=>handleInput(["coreA"],p)} simple withWeight={false} />
              <AccessoryPairCard title="Pies" hint="Gemelos 3×10–15 · Tibialis 3×12–20" aLabel="Gemelos" bLabel="Tibialis" state={sessionInputs.piesA} setState={(p)=>handleInput(["piesA"],p)} units={config.units} aWithWeight={false} bWithWeight={false} />
              <StaticListCard title="Post-Movilidad" hint="3–5 min suave" items={[{n:"Toe Splay",rec:"2×20–30s"},{n:"Short-Foot",rec:"2×20–30s"}]} state={sessionInputs.postA} setState={(p)=>handleInput(["postA"],p)} />
            </div>
          )}

          {dayType === "B" && (
            <div className="space-y-4">
              <StaticListCard title="Pre-Movilidad" hint="5–8 min rápido" items={[{n:"Respiración 360°",rec:"2×5"},{n:"Cat-Camel",rec:"1×8"},{n:"Tobillo rocks",rec:"1×10/lado"}]} state={sessionInputs.preB} setState={(p)=>handleInput(["preB"],p)} />
              <HeavyLiftCard title={"Peso Muerto — " + config.variants.deadlift} hint={"Top 3–5 @ RPE8 · Back-offs 2×5 @ ~90% (~"+roundToStep(weights.deadlift*0.9,config.rounding)+" "+config.units+")"} state={sessionInputs.deadlift} setState={(p)=>handleInput(["deadlift"],p)} rounding={config.rounding} units={config.units} />
              <DoubleProgCard title={config.variants.press} hint={"3×5–8 @ "+weights.press+" "+config.units} state={sessionInputs.press} setState={(p)=>handleInput(["press"],p)} units={config.units} rounding={config.rounding} rec={weights.press} />
              <DoubleProgCard title={config.variants.pulldown} hint={"3×6–10 @ "+weights.pulldown+" "+config.units} state={sessionInputs.pulldown} setState={(p)=>handleInput(["pulldown"],p)} units={config.units} rounding={config.rounding} rec={weights.pulldown} />
              <DoubleProgCard title="Hip Thrust (Fuerza)" hint={"3×6–10 @ "+weights.hipthrust+" "+config.units} state={sessionInputs.hipthrustB} setState={(p)=>handleInput(["hipthrustB"],p)} units={config.units} rounding={config.rounding} rec={weights.hipthrust} />
              <AccessoryPairCard title="Glúteo medio / Estabilidad" hint="Lateral Walks 2–3×15–20 · Clamshells 2×15–20" aLabel="Lateral Band Walks" bLabel="Clamshells" state={sessionInputs.gluteoMedio} setState={(p)=>handleInput(["gluteoMedio"],p)} units={config.units} aWithWeight={false} bWithWeight={false} />
              <AccessoryCard title="Tríceps en cuerda" hint="3×8–12" state={sessionInputs.triceps} setState={(p)=>handleInput(["triceps"],p)} units={config.units} rec={weights.triceps} withWeight />
              <AccessoryCard title="Core: Pallof / Side Plank" hint="Pallof 3×10/lado o Plank 2–3×20–30s" state={sessionInputs.coreB} setState={(p)=>handleInput(["coreB"],p)} simple withWeight={false} />
              <AccessoryPairCard title="Pies" hint="Gemelos 3×10–15 · Tibialis 3×12–20" aLabel="Gemelos" bLabel="Tibialis" state={sessionInputs.piesB} setState={(p)=>handleInput(["piesB"],p)} units={config.units} aWithWeight={false} bWithWeight={false} />
              <StaticListCard title="Post-Movilidad" hint="3–5 min suave" items={[{n:"Toe Splay",rec:"2×20–30s"},{n:"Short-Foot",rec:"2×20–30s"}]} state={sessionInputs.postB} setState={(p)=>handleInput(["postB"],p)} />
            </div>
          )}

          {dayType === "Movilidad" && (
            <div className="space-y-4">
              <StaticListCard title="Al despertar" hint="8–10 min" items={[{n:"Respiración 360°",rec:"2×5"},{n:"Cat-Camel",rec:"1×8"},{n:"90/90 cadera",rec:"1×6/lado"},{n:"Tobillo rocks",rec:"1×10/lado"},{n:"Toe Splay",rec:"2×20–30s"},{n:"Short-Foot",rec:"2×20–30s"}]} state={sessionInputs.morn} setState={(p)=>handleInput(["morn"],p)} />
              <StaticListCard title="Durante el día (oficina/postura)" hint="micro-pauses" items={[{n:"Chin Tucks",rec:"2×10"},{n:"Wall Slides",rec:"2×10"},{n:"Face Pulls banda",rec:"2×12"},{n:"Y-T-W en apoyo",rec:"1–2×8"},{n:"De pie 2–3 min/hora",rec:"check"}]} state={sessionInputs.day} setState={(p)=>handleInput(["day"],p)} />
            </div>
          )}

          <button onClick={completeSession} className="fixed bottom-6 left-4 right-4 py-4 rounded-2xl text-center font-semibold bg-indigo-600 text-white shadow-md">Guardar Sesión</button>
        </main>
      )}

      {tab === "plan" && <main className="p-4 pb-24"><PlanText /></main>}

      {tab === "historial" && (
        <main className="p-4 space-y-3 pb-24">
          {logs.length === 0 && <div className="text-sm text-neutral-500">Aún no hay sesiones guardadas.</div>}
          {[...logs].reverse().map((l, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{formatDate(l.date)} — {l.dayType}</div>
                <div className="text-xs text-neutral-500">{summaryHeadline(l)}</div>
              </div>
              <div className="mt-2 text-xs text-neutral-600 space-y-1">
                {Object.entries(l.exercises).map(([k, v]) => (<div key={k}>{prettyExerciseRow(k, v)}</div>))}
              </div>
            </div>
          ))}
        </main>
      )}

      {tab === "ajustes" && (
        <main className="p-4 space-y-4 pb-24">
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold">Unidades y redondeo</div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-xs text-neutral-500">Unidades</label>
                <select className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" value={config.units} onChange={(e)=>setConfig({...config,units:e.target.value})}><option value="kg">kg</option><option value="lb">lb</option></select>
              </div>
              <div>
                <label className="text-xs text-neutral-500">Redondeo</label>
                <input className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" step="0.25" value={config.rounding} onChange={(e)=>setConfig({...config,rounding:parseFloat(e.target.value||0.5)})} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold">Variantes</div>
            <SelectRow label="Sentadilla" value={config.variants.squat} onChange={(v)=>setConfig({...config,variants:{...config.variants,squat:v}})} options={["Box Squat","Front Squat"]} />
            <SelectRow label="Peso Muerto" value={config.variants.deadlift} onChange={(v)=>setConfig({...config,variants:{...config.variants,deadlift:v}})} options={["Trap Bar","Convencional desde bloques"]} />
            <SelectRow label="Press (día B)" value={config.variants.press} onChange={(v)=>setConfig({...config,variants:{...config.variants,press:v}})} options={["Press Inclinado","Landmine Press"]} />
            <SelectRow label="Remo" value={config.variants.row} onChange={(v)=>setConfig({...config,variants:{...config.variants,row:v}})} options={["Remo con Pecho Apoyado","Pendlay mod."]} />
            <SelectRow label="Jalón" value={config.variants.pulldown} onChange={(v)=>setConfig({...config,variants:{...config.variants,pulldown:v}})} options={["Jalón Supino","Dominadas Asistidas"]} />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold">Pesos actuales (recomendados)</div>
            <NumberRow label={"Sentadilla ("+config.variants.squat+")"} value={weights.squat} onChange={(v)=>setWeights({...weights,squat:v})} step={config.rounding} />
            <NumberRow label={"Peso Muerto ("+config.variants.deadlift+")"} value={weights.deadlift} onChange={(v)=>setWeights({...weights,deadlift:v})} step={config.rounding} />
            <NumberRow label="Banca" value={weights.bench} onChange={(v)=>setWeights({...weights,bench:v})} step={config.rounding} />
            <NumberRow label={config.variants.press} value={weights.press} onChange={(v)=>setWeights({...weights,press:v})} step={config.rounding} />
            <NumberRow label="Remo" value={weights.row} onChange={(v)=>setWeights({...weights,row:v})} step={config.rounding} />
            <NumberRow label="Jalón" value={weights.pulldown} onChange={(v)=>setWeights({...weights,pulldown:v})} step={config.rounding} />
            <NumberRow label="Hip Thrust (fuerza)" value={weights.hipthrust} onChange={(v)=>setWeights({...weights,hipthrust:v})} step={config.rounding} />
            <NumberRow label="Hip Thrust (accesorio)" value={weights.hipthrustAcc} onChange={(v)=>setWeights({...weights,hipthrustAcc:v})} step={config.rounding} />
            <NumberRow label="Face Pulls" value={weights.facepulls} onChange={(v)=>setWeights({...weights,facepulls:v})} step={config.rounding} />
            <NumberRow label="Curl Martillo" value={weights.curl} onChange={(v)=>setWeights({...weights,curl:v})} step={config.rounding} />
            <NumberRow label="Tríceps" value={weights.triceps} onChange={(v)=>setWeights({...weights,triceps:v})} step={config.rounding} />
            <NumberRow label="Gemelos" value={weights.calves} onChange={(v)=>setWeights({...weights,calves:v})} step={config.rounding} />
            <NumberRow label="Tibialis" value={weights.tibialis} onChange={(v)=>setWeights({...weights,tibialis:v})} step={config.rounding} />
          </div>
        </main>
      )}

      <footer className="h-6" />
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (<button onClick={onClick} className={"py-2 rounded-xl font-medium "+(active?"bg-neutral-900 text-white":"bg-neutral-100")}>{children}</button>);
}

function summaryHeadline(l) {
  const a = [];
  if (l.exercises.squat) a.push(l.exercises.squat.topWeight + "×" + l.exercises.squat.topReps);
  if (l.exercises.deadlift) a.push(l.exercises.deadlift.topWeight + "×" + l.exercises.deadlift.topReps);
  if (l.exercises.bench) a.push("BP " + l.exercises.bench.weight + "×" + l.exercises.bench.reps.join("/"));
  if (l.exercises.press) a.push("PR " + l.exercises.press.weight + "×" + l.exercises.press.reps.join("/"));
  if (l.exercises.hipthrustB) a.push("HT " + l.exercises.hipthrustB.weight + "×" + l.exercises.hipthrustB.reps.join("/"));
  return a.join(" · ");
}
