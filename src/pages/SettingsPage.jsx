import React from "react";
import { usePlanStore } from "../state/PlanStore.jsx";
import NumberRow from "../components/ui/NumberRow.jsx";
import SelectRow from "../components/ui/SelectRow.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

export default function SettingsPage() {
  const { config, setConfig, weights, setWeights } = usePlanStore();

  return (
    <main className="p-4 space-y-4 pb-24">
      {/* Apariencia */}
      <section className="card p-4 space-y-3">
        <div className="text-sm font-semibold">Apariencia</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            Tema
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Cambia entre claro y oscuro. Se recuerda en este dispositivo.
            </div>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* Unidades y redondeo */}
      <section className="card p-4 space-y-3">
        <div className="text-sm font-semibold">Unidades y redondeo</div>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <label className="text-xs text-neutral-500 dark:text-neutral-400">Unidades</label>
            <select
              className="select mt-1"
              value={config.units}
              onChange={(e) => setConfig({ ...config, units: e.target.value })}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-500 dark:text-neutral-400">Redondeo</label>
            <input
              type="number"
              step="0.25"
              min="0"
              className="input mt-1"
              value={config.rounding}
              onChange={(e) => setConfig({ ...config, rounding: parseFloat(e.target.value || 0.5) })}
            />
          </div>
        </div>
      </section>

      {/* Variantes */}
      <section className="card p-4 space-y-3">
        <div className="text-sm font-semibold">Variantes</div>
        <SelectRow
          label="Sentadilla"
          value={config.variants.squat}
          onChange={(v) => setConfig({ ...config, variants: { ...config.variants, squat: v } })}
          options={["Box Squat", "Front Squat"]}
        />
        <SelectRow
          label="Peso Muerto"
          value={config.variants.deadlift}
          onChange={(v) => setConfig({ ...config, variants: { ...config.variants, deadlift: v } })}
          options={["Trap Bar", "Convencional desde bloques"]}
        />
        <SelectRow
          label="Press (día B)"
          value={config.variants.press}
          onChange={(v) => setConfig({ ...config, variants: { ...config.variants, press: v } })}
          options={["Press Inclinado", "Landmine Press"]}
        />
        <SelectRow
          label="Remo"
          value={config.variants.row}
          onChange={(v) => setConfig({ ...config, variants: { ...config.variants, row: v } })}
          options={["Remo con Pecho Apoyado", "Remo Pendlay"]}
        />
        <SelectRow
          label="Jalón"
          value={config.variants.pulldown}
          onChange={(v) => setConfig({ ...config, variants: { ...config.variants, pulldown: v } })}
          options={["Jalón Supino", "Jalón Neutral"]}
        />
      </section>
    </main>
  );
}
