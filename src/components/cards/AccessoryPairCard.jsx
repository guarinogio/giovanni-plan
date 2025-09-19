import React from "react";
import HeaderWithHint from "../ui/HeaderWithHint.jsx";
import Stepper from "../Stepper.jsx";

export default function AccessoryPairCard({ title, hint, aLabel, bLabel, state, setState, units="kg", aRec=0, bRec=0, aWithWeight=true, bWithWeight=true, sets=3 }) {
  const tgt = sets;

  const migSide = (obj, withWeight, rec) => {
    if (!obj) return { weight: withWeight ? rec : 0, reps: Array.from({ length: tgt }, () => 0) };
    if (Array.isArray(obj.reps) || typeof obj.weight === "number") {
      const weight = withWeight ? (typeof obj.weight === "number" ? obj.weight : rec) : 0;
      const reps = Array.from({ length: tgt }, (_, i) => Math.max(0, Math.round(obj.reps?.[i] ?? 0)));
      return { weight, reps };
    }
    if (Array.isArray(obj)) {
      const reps = Array.from({ length: tgt }, (_, i) => Math.max(0, Math.round(obj[i]?.reps ?? 0)));
      const firstW = obj.find((x) => typeof x?.weight === "number")?.weight ?? (withWeight ? rec : 0);
      return { weight: firstW, reps };
    }
    return { weight: withWeight ? rec : 0, reps: Array.from({ length: tgt }, () => 0) };
  };

  const sRaw = state ?? {};
  const s = { a: migSide(sRaw.a || sRaw.aSets, aWithWeight, aRec), b: migSide(sRaw.b || sRaw.bSets, bWithWeight, bRec) };

  const setA = (patch) => setState({ ...s, a: { ...s.a, ...patch } });
  const setB = (patch) => setState({ ...s, b: { ...s.b, ...patch } });

  const idxs = Array.from({ length: tgt }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
      <HeaderWithHint title={title} hint={hint} recRestSec={75} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="text-xs font-medium text-neutral-600">{aLabel}</div>
          {aWithWeight && (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">Peso ({units})</div>
                <div className="text-[11px] text-neutral-400">Rec: {aRec} {units}</div>
              </div>
              <Stepper value={s.a.weight ?? 0} onChange={(v)=>setA({weight:v})} step={0.5} unit={units} className="mt-1" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {idxs.map((i)=>(
              <div key={i}>
                <div className="text-[11px] text-neutral-500">Serie {i+1} — Reps</div>
                <Stepper value={s.a.reps[i] ?? 0} onChange={(v)=>setA({reps:s.a.reps.map((r,idx)=>idx===i?Math.max(0,Math.round(v)):r)})} step={1} className="mt-1" />
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
              <Stepper value={s.b.weight ?? 0} onChange={(v)=>setB({weight:v})} step={0.5} unit={units} className="mt-1" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {idxs.map((i)=>(
              <div key={i}>
                <div className="text-[11px] text-neutral-500">Serie {i+1} — Reps</div>
                <Stepper value={s.b.reps[i] ?? 0} onChange={(v)=>setB({reps:s.b.reps.map((r,idx)=>idx===i?Math.max(0,Math.round(v)):r)})} step={1} className="mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
