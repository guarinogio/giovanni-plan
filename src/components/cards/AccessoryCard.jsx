import React from "react";
import HeaderRow from "../ui/HeaderRow.jsx";
import Stepper from "../ui/Stepper.jsx";

export default function AccessoryCard({ title, hint, state, setState, simple=false, units="kg", rec=0, withWeight=true }) {
  const sets = simple ? 2 : 3;
  const s = normalize(state, withWeight, rec, sets);

  function normalize(value, withW, base, N) {
    if (!value) return withW ? { weight: base, reps: Array.from({length:N},()=>0) } : { reps: Array.from({length:N},()=>0) };
    if (Array.isArray(value.sets)) {
      const reps = Array.from({length:N},(_,i)=>Math.max(0, Math.round(value.sets[i]?.reps ?? 0)));
      const w = value.sets.find(x=>typeof x?.weight === "number")?.weight ?? (withW ? base : undefined);
      return withW ? { weight: w, reps } : { reps };
    }
    if (Array.isArray(value.reps)) {
      const reps = Array.from({length:N},(_,i)=>Math.max(0, Math.round(value.reps[i] ?? 0)));
      const w = typeof value.weight === "number" ? value.weight : (withW ? base : undefined);
      return withW ? { weight: w, reps } : { reps };
    }
    return withW ? { weight: base, reps: Array.from({length:N},()=>0) } : { reps: Array.from({length:N},()=>0) };
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderRow title={title} hint={hint} recRestSec={75} />
      {withWeight && (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-500">Peso ({units})</div>
            <div className="text-[11px] text-neutral-400">Rec: {rec} {units}</div>
          </div>
          <Stepper value={s.weight ?? rec} onChange={(v)=>setState({ ...s, weight: v })} step={0.5} unit={units} className="mt-1" />
        </div>
      )}

      <div className={`grid grid-cols-1 ${simple ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-3`}>
        {s.reps.map((r,i)=>(
          <div key={i}>
            <div className="text-xs text-neutral-500">Serie {i+1} — Reps</div>
            <Stepper value={r ?? 0} onChange={(v)=>setState({ ...s, reps: s.reps.map((x,idx)=>idx===i?Math.max(0,Math.round(v)):x) })} step={1} className="mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
