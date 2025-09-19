import React from "react";
import { usePlanStore } from "../../state/PlanStore.jsx";
import RestTimerControl from "../timer/RestTimerControl.jsx";

export default function Header() {
  const { tab, setTab, exportCSV, resetAll } = usePlanStore();
  return (
    <header className="px-4 pt-4 pb-3 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="font-black text-base truncate">Plan de Fuerza + Accesorios — Giovanni</div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={exportCSV}>⬇️ CSV</button>
            <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={resetAll}>🧹 Reset</button>
            <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={()=>setTab("ajustes")}>⚙️</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <TabButton active={tab==="sesion"} onClick={()=>setTab("sesion")}>Sesión</TabButton>
          <TabButton active={tab==="plan"} onClick={()=>setTab("plan")}>Plan</TabButton>
          <TabButton active={tab==="historial"} onClick={()=>setTab("historial")}>Historial</TabButton>
        </div>
        <div className="w-full"><RestTimerControl/></div>
      </div>
    </header>
  );
}

function TabButton({ active, onClick, children }) {
  return <button onClick={onClick} className={"py-2 rounded-xl font-medium "+(active?"bg-neutral-900 text-white":"bg-neutral-100")}>{children}</button>;
}
