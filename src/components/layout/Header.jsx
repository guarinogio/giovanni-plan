import React from "react";
import { usePlanStore } from "../../state/PlanStore.jsx";
import RestTimerControl from "../timer/RestTimerControl.jsx";

export default function Header() {
  const { tab, setTab, exportCSV, resetAll } = usePlanStore();
  return (
    <header
      className="
        px-4 pt-4 pb-3 sticky top-0 z-10 shadow-sm
        bg-white dark:bg-neutral-900
        supports-[backdrop-filter]:backdrop-blur
        supports-[backdrop-filter]:bg-white/80
        dark:supports-[backdrop-filter]:bg-neutral-900/80
      "
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="font-black text-base truncate">
            Plan de Fuerza + Accesorios — Giovanni
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="btn" onClick={exportCSV}>⬇️ CSV</button>
            <button className="btn" onClick={resetAll}>🧹 Reset</button>
            <button className="btn" onClick={() => setTab("ajustes")}>⚙️</button>
          </div>
        </div>

        {/* Tabs responsive */}
        <nav className="w-full">
          <div className="tabbar w-full grid grid-cols-3 gap-1 overflow-hidden min-w-0">
            <TabButton active={tab === "sesion"} onClick={() => setTab("sesion")}>Sesión</TabButton>
            <TabButton active={tab === "plan"} onClick={() => setTab("plan")}>Plan</TabButton>
            <TabButton active={tab === "historial"} onClick={() => setTab("historial")}>Historial</TabButton>
          </div>
        </nav>

        <div className="w-full">
          <RestTimerControl />
        </div>
      </div>
    </header>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full min-w-0 text-center py-2 rounded-xl transition-colors " +
        (active ? "tab-active" : "opacity-70")
      }
    >
      <span className="block truncate">{children}</span>
    </button>
  );
}
