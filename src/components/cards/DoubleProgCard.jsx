import React from "react";
import HeaderWithHint from "../ui/HeaderWithHint.jsx";
import Stepper from "../Stepper.jsx";

export default function DoubleProgCard({ title, hint, state, setState, units, rounding, rec=0 }) {
  const s = state ?? { weight: 0, reps: [0,0,0] };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} />

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-500">Peso ({units})</div>
            <div className="text-[11px] text-neutral-400">Recomendado: {rec} {units}</div>
          </div>
          <Stepper value={s.weight ?? 0} onChange={(v)=>setState({ ...s, weight:v })} step={rounding} unit={units} className="mt-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0,1,2].map((i)=>(
            <div key={i}>
              <div className="text-xs text-neutral-500">Serie {i+1} — reps</div>
              <Stepper value={s.reps[i] ?? 0} onChange={(v)=>setState({ ...s, reps:s.reps.map((r,idx)=>idx===i?Math.max(0,Math.round(v)):r) })} step={1} className="mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
