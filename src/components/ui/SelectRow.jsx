import React from "react";

export default function SelectRow({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs text-neutral-500">{label}</label>
      <select className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
}
