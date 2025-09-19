import React from "react";
import Stepper from "../Stepper.jsx";

export default function NumberRow({ label, value, onChange, step=0.5 }) {
  return (
    <div className="grid grid-cols-2 gap-2 items-center">
      <div className="text-xs text-neutral-500">{label}</div>
      <Stepper value={value} onChange={onChange} step={step} />
    </div>
  );
}
