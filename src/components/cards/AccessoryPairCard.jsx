import React from "react";
import HeaderRow from "../ui/HeaderRow.jsx";
import Stepper from "../ui/Stepper.jsx";

export default function AccessoryPairCard({
  title, hint,
  aLabel, bLabel,
  state, setState,
  units="kg",
  aRec=0, bRec=0,
  aWithWeight=true, bWithWeight=true,
  sets=3
}) {
  const s = state ?? {
    a: aWithWeight ? { weight: aRec, reps: Array.from({length:sets},()=>0) } : { reps: Array.from({length:sets},()=>0) },
    b: bWithWeight ? { weight: bRec, reps: Array.from({length:sets},()=>0) } : { reps: Array.from({length:sets},()=>0) },
  };

  const updateA = (patch) => setState({ ...s, a: { ...s.a, ...patch } });
  const updateB = (patch) => setState({ ...s, b: { ...s.b, ...patch } });

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
      <HeaderRow title={title} hint={hint} recRestSec={75} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="text-xs font-medium text-neutral-600">{aLabel}</div>
          {aWithWeight && (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">Peso ({units})</div>
                <div className="text-[11px] text-neutral-400">Rec: {aRec} {units}</div>
              </div>
              <Stepper value={s.a.weight ?? aRec} onChange={(v)=>updateA({ weight: v })} step={0.5} unit={units} className="mt-1" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Array.from({length:sets}).map((_,i)=>(
              <div key={i}>
                <div className="text-[11px] text-neutral-500">Serie {i+1} — Reps</div>
                <Stepper value={s.a.reps?.[i] ?? 0} onChange={(v)=>updateA({ reps: (s.a.reps ?? Array.from({length:sets},()=>0)).map((x,idx)=>idx===i?Math.max(0,Math.round(v)):x) })} step={1} className="mt-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-medium text-neutral-600">{bLabel}</div>
          {bWithWeight && (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">Peso ({units})</div>
                <div className="text-[11px] text-neutral-400">Rec: {bRec} {units}</div>
              </div>
              <Stepper value={s.b.weight ?? bRec} onChange={(v)=>updateB({ weight: v })} step={0.5} unit={units} className="mt-1" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Array.from({length:sets}).map((_,i)=>(
              <div key={i}>
                <div className="text-[11px] text-neutral-500">Serie {i+1} — Reps</div>
                <Stepper value={s.b.reps?.[i] ?? 0} onChange={(v)=>updateB({ reps: (s.b.reps ?? Array.from({length:sets},()=>0)).map((x,idx)=>idx===i?Math.max(0,Math.round(v)):x) })} step={1} className="mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
