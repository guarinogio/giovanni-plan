import React from "react";
import HeaderRow from "../ui/HeaderRow.jsx";
import Stepper from "../ui/Stepper.jsx";

export default function HeavyLiftCard({ title, hint, state, setState, rounding, units, recTop = 0 }) {
  const s = state ?? {
    topWeight: recTop || 0,
    topReps: 0,
    topRPE: 8,
    backoffs: [
      { weight: recTop ? Math.round((recTop * 0.9) / rounding) * rounding : 0, reps: 0 },
      { weight: recTop ? Math.round((recTop * 0.9) / rounding) * rounding : 0, reps: 0 }
    ]
  };

  React.useEffect(() => {
    if (!s.backoffs[0].weight && s.topWeight) {
      const bo = Math.round((s.topWeight * 0.9) / rounding) * rounding;
      setState({ ...s, backoffs: [{ ...s.backoffs[0], weight: bo }, { ...s.backoffs[1], weight: bo }] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.topWeight]);

  const boRec = s.topWeight ? Math.round((s.topWeight * 0.9) / rounding) * rounding : 0;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderRow title={title} hint={hint} recRestSec={150} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <div className="text-xs text-neutral-500">Top set — peso ({units})</div>
          <Stepper value={s.topWeight ?? 0} onChange={(v)=>setState({ ...s, topWeight: v })} step={rounding} unit={units} className="mt-1" />
        </div>
        <div>
          <div className="text-xs text-neutral-500">Top set — reps (3–5)</div>
          <Stepper value={s.topReps ?? 0} onChange={(v)=>setState({ ...s, topReps: Math.max(0, Math.round(v)) })} step={1} className="mt-1" />
        </div>
        <div>
          <div className="text-xs text-neutral-500">Top set — RPE</div>
          <Stepper value={s.topRPE ?? 8} onChange={(v)=>setState({ ...s, topRPE: v })} step={0.5} className="mt-1" />
        </div>
      </div>

      <div className="text-xs text-neutral-500 mt-1">Back-offs 2×5 @ ~90%</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {s.backoffs.map((bo, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">Back-off {i+1} — peso ({units})</div>
                <div className="text-[11px] text-neutral-400">Rec: {boRec} {units}</div>
              </div>
              <Stepper value={bo.weight ?? 0} onChange={(v)=>setState({ ...s, backoffs: s.backoffs.map((x,idx)=>idx===i?{...x,weight:v}:x) })} step={rounding} unit={units} className="mt-1" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Back-off {i+1} — reps</div>
              <Stepper value={bo.reps ?? 0} onChange={(v)=>setState({ ...s, backoffs: s.backoffs.map((x,idx)=>idx===i?{...x,reps:Math.max(0,Math.round(v))}:x) })} step={1} className="mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
