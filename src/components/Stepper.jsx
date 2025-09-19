import React from "react";

export default function Stepper({ value=0, onChange, step=1, min=-Infinity, max=Infinity, unit="", size="md", className="" }) {
  const round = (v) => Math.round((v + Number.EPSILON) / step) * step;
  const dec = () => onChange(Math.max(min, round(value - step)));
  const inc = () => onChange(Math.min(max, round(value + step)));
  const sizes = { sm: { btn: "h-9 w-9 text-base", lab: "px-3 py-2 text-sm" }, md: { btn: "h-10 w-10 text-lg", lab: "px-4 py-2.5" }, lg: { btn: "h-12 w-12 text-xl", lab: "px-5 py-3 text-lg" } };
  const s = sizes[size] || sizes.md;
  return (
    <div className={"flex items-center gap-2 " + className}>
      <button type="button" onClick={dec} className={"rounded-xl bg-neutral-100 " + s.btn}>−</button>
      <div className={"min-w-24 text-center rounded-xl bg-neutral-100 " + s.lab}>{Number.isFinite(value) ? value : 0}{unit ? " " + unit : ""}</div>
      <button type="button" onClick={inc} className={"rounded-xl bg-neutral-100 " + s.btn}>＋</button>
    </div>
  );
}
