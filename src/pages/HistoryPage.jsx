import React from "react";
import { usePlanStore } from "../state/PlanStore.jsx";
import { formatDate } from "../lib/utils.js";

export default function HistoryPage() {
  const { logs, prettyExerciseRow } = usePlanStore();
  return (
    <main className="p-4 space-y-3 pb-24">
      {logs.length === 0 && <div className="text-sm text-neutral-500">Aún no hay sesiones guardadas.</div>}
      {[...logs].reverse().map((l, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm font-semibold">{formatDate(l.date)} — {l.dayType}</div>
          <div className="mt-2 text-xs text-neutral-600 space-y-1">
            {Object.entries(l.exercises).map(([k, v]) => (<div key={k}>{prettyExerciseRow(k, v)}</div>))}
          </div>
        </div>
      ))}
    </main>
  );
}
