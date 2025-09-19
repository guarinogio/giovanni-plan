import React from "react";
import { usePlanStore } from "../state/PlanStore.jsx";
import ToggleGroup from "../components/ui/ToggleGroup.jsx";
import StaticListCard from "../components/cards/StaticListCard.jsx";
import HeavyLiftCard from "../components/cards/HeavyLiftCard.jsx";
import DoubleProgCard from "../components/cards/DoubleProgCard.jsx";
import AccessoryCard from "../components/cards/AccessoryCard.jsx";
import AccessoryPairCard from "../components/cards/AccessoryPairCard.jsx";

export default function SessionPage() {
  const { dayType, setDayType, lastType, sessionInputs, handleInput, config, weights, roundToStep, completeSession } = usePlanStore();

  return (
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
          <HeavyLiftCard title={"Sentadilla — " + config.variants.squat} hint={"Top 3–5 @ RPE8 · Back-offs 2×5 @ ~90% (~"+roundToStep(weights.squat*0.9,config.rounding)+" "+config.units+")"} state={sessionInputs.squat} setState={(p)=>handleInput(["squat"],p)} rounding={config.rounding} units={config.units} recTop={weights.squat} />
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
          <HeavyLiftCard title={"Peso Muerto — " + config.variants.deadlift} hint={"Top 3–5 @ RPE8 · Back-offs 2×5 @ ~90% (~"+roundToStep(weights.deadlift*0.9,config.rounding)+" "+config.units+")"} state={sessionInputs.deadlift} setState={(p)=>handleInput(["deadlift"],p)} rounding={config.rounding} units={config.units} recTop={weights.deadlift} />
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
  );
}
