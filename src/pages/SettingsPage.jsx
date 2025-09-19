import React from "react";
import { usePlanStore } from "../state/PlanStore.jsx";
import NumberRow from "../components/ui/NumberRow.jsx";
import SelectRow from "../components/ui/SelectRow.jsx";

export default function SettingsPage() {
  const { config, setConfig, weights, setWeights } = usePlanStore();
  return (
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
  );
}
