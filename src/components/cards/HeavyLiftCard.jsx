import React, { useEffect } from "react";
import HeaderWithHint from "../ui/HeaderWithHint.jsx";
import Stepper from "../Stepper.jsx";

export default function HeavyLiftCard({ title, hint, state, setState, rounding, units }) {
  const s = state ?? { topWeight: 0, topReps: 0, topRPE: 8, backoffs: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }] };

  useEffect(() => {
    if (!s.backoffs[0].weight && s.topWeight) {
      const bo = Math.round(((s.topWeight || 0) * 0.9) / rounding) * rounding;
      setState({ ...s, backoffs: [{ ...s.backoffs[0], weight: bo }, { ...s.backoffs[1], weight: bo }] });
    }
  }, [s.topWeight]);

  const boRef = s.topWeight ? Math.round(((s.topWeight || 0) * 0.9) / rounding) * rounding : 0;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} recRestSec={150} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <div className="text-xs text-neutral-500">Top set — peso ({units})</div>
          <Stepper value={s.topWeight ?? 0} onChange={(v)=>setState({ ...s, topWeight:v })} step={rounding} unit={units} className="mt-1" />
        </div>
        <div>
          <div className="text-xs text-neutral-500">Top set — reps (3–5)</div>
          <Stepper value={s.topReps ?? 0} onChange={(v)=>setState({ ...s, topReps: Math.max(0,Math.round(v)) })} step={1} className="mt-1" />
        </div>
        <div>
          <div className="text-xs text-neutral-500">Top set — RPE</div>
          <Stepper value={s.topRPE ?? 8} onChange={(v)=>setState({ ...s, topRPE:v })} step={0.5} className="mt-1" />
        </div>
      </div>

      <div className="text-xs text-neutral-500 mt-1">Back-offs 2×5 @ ~90%</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {s.backoffs.map((b,i)=>(
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">Back-off {i+1} — peso ({units})</div>
                <div className="text-[11px] text-neutral-400">Rec: {boRef} {units}</div>
              </div>
              <Stepper value={b.weight ?? 0} onChange={(v)=>setState({ ...s, backoffs: s.backoffs.map((x,idx)=>idx===i?{...x,weight:v}:x) })} step={rounding} unit={units} className="mt-1" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Back-off {i+1} — reps</div>
              <Stepper value={b.reps ?? 0} onChange={(v)=>setState({ ...s, backoffs: s.backoffs.map((x,idx)=>idx===i?{...x,reps:Math.max(0,Math.round(v))}:x) })} step={1} className="mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
