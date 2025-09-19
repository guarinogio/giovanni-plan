import React from "react";

export default function PlanText() {
  return (
    <div className="space-y-4 text-sm leading-6">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="font-semibold mb-2">Objetivo</div>
        <p>bajar grasa preservando músculo, proteger lumbar/fascitis y mejorar postura mediante más "tirón" que "empuje".</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="font-semibold mb-2">Estructura General</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Frecuencia: 3 días/semana, alternando A/B; y bloque Movilidad diario.</li>
          <li>RPE 7–8, relación tirón:empuje ≥ 2:1.</li>
          <li>Descansos: principales 2–4 min; accesorios 60–90 s.</li>
          <li>Calentamiento por rampas; bracing 360°.</li>
        </ul>
      </div>
    </div>
  );
}
