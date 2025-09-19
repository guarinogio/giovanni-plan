import React from "react";

export default function HeaderWithHint({ title, hint }) {
  return (
    <div className="flex items-center gap-2">
      <div className="font-semibold">{title}</div>
      {hint ? <div className="text-xs text-neutral-500">{hint}</div> : null}
    </div>
  );
}
