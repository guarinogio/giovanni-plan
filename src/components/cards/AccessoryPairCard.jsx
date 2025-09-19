import React from "react";
import HeaderWithHint from "../ui/HeaderWithHint.jsx";
import Stepper from "../Stepper.jsx";

export default function AccessoryPairCard({
  title,
  hint,
  aLabel,
  bLabel,
  state,
  setState,
  units = "kg",
  aRec = 0,
  bRec = 0,
  aWithWeight = true,
  bWithWeight = true,
  sets = 3
}) {
  const tgt = sets;

  const migSide = (obj, withWeight, rec) => {
    if (!obj) return { weight: withWeight ? rec : 0, reps: Array.from({ length: tgt }, () => 0) };
    if (Array.isArray(obj.aSets) || Array.isArray(obj.bSets)) {
      // viejo formato, será manejado más abajo en el merge
    }
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

  const migrateWhole = (s) => {
    if (!s) return { a: migSide(null, aWithWeight, aRec), b: migSide(null, bWithWeight, bRec) };
    // soportar formatos antiguos: aSets/bSets (cada set objeto)
    if (Array.isArray(s.aSets) || Array.isArray(s.bSets)) {
      const a = migSide(s.aSets, aWithWeight, aRec);
      const b = migSide(s.bSets, bWithWeight, bRec);
      return { a, b };
    }
    if (s.a || s.b) {
      return { a: migSide(s.a, aWithWeight, aRec), b: migSide(s.b, bWithWeight, bRec) };
    }
    return { a: migSide(null, aWithWeight, aRec), b: migSide(null, bWithWeight, bRec) };
  };

  const s = migrateWhole(state);

  const setAWeight = (w) => setState({ ...s, a: { ...s.a, weight: w } });
  const setBWeight = (w) => setState({ ...s, b: { ...s.b, weight: w } });

  const setARep = (i, v) => {
    const reps = s.a.reps.map((r, idx) => (idx === i ? Math.max(0, Math.round(v)) : r));
    setState({ ...s, a: { ...s.a, reps } });
  };
  const setBRep = (i, v) => {
    const reps = s.b.reps.map((r, idx) => (idx === i ? Math.max(0, Math.round(v)) : r));
    setState({ ...s, b: { ...s.b, reps } });
  };

  const idxs = Array.from({ length: tgt }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
      <HeaderWithHint title={title} hint={hint} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="text-xs font-medium text-neutral-600">{aLabel}</div>
          {aWithWeight && (
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">Peso ({units})</div>
                <div className="text-[11px] text-neutral-400">Rec: {aRec} {units}</div>
              </div>
              <Stepper value={s.a.weight ?? 0} onChange={setAWeight} step={0.5} unit={units} className="mt-1" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {idxs.map((i) => (
              <div key={i}>
                <div className="text-[11px] text-neutral-500">Serie {i + 1} — Reps</div>
                <Stepper value={s.a.reps[i] ?? 0} onChange={(v) => setARep(i, v)} step={1} className="mt-1" />
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
              <Stepper value={s.b.weight ?? 0} onChange={setBWeight} step={0.5} unit={units} className="mt-1" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {idxs.map((i) => (
              <div key={i}>
                <div className="text-[11px] text-neutral-500">Serie {i + 1} — Reps</div>
                <Stepper value={s.b.reps[i] ?? 0} onChange={(v) => setBRep(i, v)} step={1} className="mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
