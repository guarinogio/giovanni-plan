import React from "react";

export default function HeaderWithHint({ title, hint, recRestSec = null }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="font-semibold">{title}</div>
        {hint ? <div className="text-xs text-neutral-500">{hint}</div> : null}
      </div>
      {recRestSec ? (
        <div className="text-[11px] px-2 py-1 rounded-lg bg-neutral-100 text-neutral-600 whitespace-nowrap">
          Descanso: {recRestSec}s
        </div>
      ) : null}
    </div>
  );
}
