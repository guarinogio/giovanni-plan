import React from "react";
import HeaderWithHint from "../ui/HeaderWithHint.jsx";

export default function StaticListCard({ title, hint, items, state, setState }) {
  const s = state ?? { done: items.map(()=>false) };
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} />
      <div className="space-y-2">
        {items.map((it,i)=>(
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-sky-600 dark:accent-sky-400 w-4 h-4"
              checked={!!s.done[i]}
              onChange={(e) =>
                setState({ done: s.done.map((v,idx)=>idx===i?e.target.checked:v) })
              }
            />
            <span className="flex-1">{it.n}</span>
            <span className="text-xs text-neutral-500">{it.rec}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
