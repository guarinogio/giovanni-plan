import React from "react";
import HeaderWithHint from "../ui/HeaderWithHint.jsx";
import Stepper from "../Stepper.jsx";

export default function AccessoryCard({ title, hint, state, setState, simple=false, units="kg", rec=0, withWeight=true }) {
  const targetLen = simple ? 2 : 3;

  const migrate = (s) => {
    if (!s) return { weight: withWeight ? rec : 0, reps: Array.from({ length: targetLen }, () => 0) };
    if (Array.isArray(s.sets)) {
      const reps = Array.from({ length: targetLen }, (_, i) => Math.max(0, Math.round(s.sets[i]?.reps ?? 0)));
      const firstW = s.sets.find((x) => typeof x?.weight === "number")?.weight ?? (withWeight ? rec : 0);
      return { weight: firstW, reps };
    }
    if (Array.isArray(s.reps)) {
      const reps = Array.from({ length: targetLen }, (_, i) => Math.max(0, Math.round(s.reps[i] ?? 0)));
      const weight = typeof s.weight === "number" ? s.weight : (withWeight ? rec : 0);
      return { weight, reps };
    }
    return { weight: withWeight ? rec : 0, reps: Array.from({ length: targetLen }, () => 0) };
  };

  const s = migrate(state);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} recRestSec={75} />

      {withWeight && (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-500">Peso ({units})</div>
            <div className="text-[11px] text-neutral-400">Rec: {rec} {units}</div>
          </div>
          <Stepper value={s.weight ?? 0} onChange={(v)=>setState({ ...s, weight:v })} step={0.5} unit={units} className="mt-1" />
        </div>
      )}

      <div className={"grid grid-cols-1 "+(simple?"sm:grid-cols-2":"sm:grid-cols-3")+" gap-3"}>
        {s.reps.map((val, i) => (
          <div key={i}>
            <div className="text-xs text-neutral-500">Serie {i + 1} — Reps</div>
            <Stepper value={val ?? 0} onChange={(v)=>setState({ ...s, reps:s.reps.map((r,idx)=>idx===i?Math.max(0,Math.round(v)):r) })} step={1} className="mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
