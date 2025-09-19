import React from "react";

export default function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="bg-neutral-100 p-1 rounded-xl flex w-full">
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)} className={"flex-1 px-4 py-2 rounded-lg text-sm " + (value === opt ? "bg-white shadow-sm font-semibold" : "opacity-70")}>{opt}</button>
      ))}
    </div>
  );
}
