import React, { useEffect, useMemo, useState } from "react";

export default function MobilePlanGiovanni() {
  const [tab, setTab] = useState("sesion");
  const [dayType, setDayType] = useState("A");
  const [config, setConfig] = useLocalStorage("giov_plan_config", {
    units: "kg",
    rounding: 0.5,
    heavyIncrement: 5,
    heavySmallIncrement: 2.5,
    benchIncrement: 2.5,
    pressIncrement: 2.5,
    rowIncrement: 5,
    pulldownIncrement: 2.5,
    hipthrustIncrement: 5,
    variants: {
      squat: "Box Squat",
      deadlift: "Trap Bar",
      bench: "Press de Banca",
      press: "Press Inclinado",
      row: "Remo con Pecho Apoyado",
      pulldown: "Jalón Supino",
    },
  });
  const [weights, setWeights] = useLocalStorage("giov_plan_weights", {
    squat: 60,
    deadlift: 80,
    bench: 50,
    press: 40,
    row: 60,
    pulldown: 50,
    hipthrust: 80,
  });
  const [logs, setLogs] = useLocalStorage("giov_plan_logs", []);
  const [lastType, setLastType] = useLocalStorage("giov_plan_lastType", null);
  const [sessionInputs, setSessionInputs] = useState(createEmptySession(dayType, config, weights));

  useEffect(() => {
    const suggested = lastType === "A" ? "B" : lastType === "B" ? "Movilidad" : lastType === "Movilidad" ? "A" : "A";
    setDayType(suggested);
    setSessionInputs(createEmptySession(suggested, config, weights));
  }, []);

  useEffect(() => {
    setSessionInputs(createEmptySession(dayType, config, weights));
  }, [dayType, config, weights]);

  const today = useMemo(() => new Date().toISOString(), []);

  const lastFor = (key) => {
    const found = [...logs].reverse().find((l) => l.exercises[key]);
    return found ? { date: found.date, data: found.exercises[key] } : null;
  };

  const exportCSV = () => {
    const lifts = [
      { key: "squat", name: "Sentadilla — " + config.variants.squat, scheme: "Top 3-5 + 2x5@90%", rec: weights.squat },
      { key: "deadlift", name: "Peso Muerto — " + config.variants.deadlift, scheme: "Top 3-5 + 2x5@90%", rec: weights.deadlift },
      { key: "bench", name: "Press de Banca", scheme: "3x5-8", rec: weights.bench },
      { key: "row", name: "Remo — " + config.variants.row, scheme: "3x6-10", rec: weights.row },
      { key: "press", name: config.variants.press, scheme: "3x5-8", rec: weights.press },
      { key: "pulldown", name: config.variants.pulldown, scheme: "3x6-10", rec: weights.pulldown },
      { key: "hipthrustB", name: "Hip Thrust (Fuerza)", scheme: "3x6-10", rec: weights.hipthrust },
    ];
    const rows = [
      ["ejercicio","variante_o_nombre","peso_recomendado","unidades","esquema","ultima_fecha","ultimo_detalle"],
      ...lifts.map((l) => {
        const last = lastFor(l.key);
        let detalle = "";
        if (last) {
          const v = last.data;
          if (v.topWeight !== undefined) detalle = v.topWeight + "x" + v.topReps + " RPE " + v.topRPE;
          else if (v.weight !== undefined && v.reps) detalle = v.weight + "x" + v.reps.join("/");
        }
        return [l.key, l.name, l.rec, config.units, l.scheme, last ? formatDate(last.date) : "", detalle];
      })
    ];
    const escapeCSV = (val) => {
      const s = String(val == null ? "" : val);
      const needsQuotes = s.includes(",") || s.includes('"') || s.includes("\n");
      return needsQuotes ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "giovanni-fuerza-" + new Date().toISOString().slice(0,10) + ".csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const resetAllStorage = () => {
    localStorage.clear();
    location.reload();
  };

  const handleInput = (path, value) => {
    setSessionInputs((prev) => setDeep(prev, path, value));
  };

  const completeSession = () => {
    const stamped = { date: today, dayType, exercises: sessionInputs };
    const newLogs = [...logs, stamped];
    const nextWeights = applyProgressions({ weights, config, logs: newLogs });
    setLogs(newLogs);
    setWeights(nextWeights);
    setLastType(dayType);
    setSessionInputs(createEmptySession(dayType, config, nextWeights));
    setTab("historial");
  };

  const resetData = () => {
    setLogs([]);
    setLastType(null);
  };

  const planText = (
    <div className="space-y-4 text-sm leading-6">
      <Section title="Objetivo">
        <p>bajar grasa preservando músculo, proteger lumbar/fascitis y mejorar postura mediante más "tirón" que "empuje".</p>
      </Section>
      <Section title="Estructura General">
        <ul className="list-disc pl-5 space-y-1">
          <li>Frecuencia: 3 días/semana, alternando A / B / A (semana 1), B / A / B (semana 2). Añadido bloque "Movilidad" diario.</li>
          <li>Esfuerzo objetivo: RPE 7–8 (2–3 reps en recámara).</li>
          <li>Relación tirón:empuje ≥ 2:1.</li>
          <li>Descansos: principales 2–4 min; accesorios 60–90 s.</li>
          <li>Calentamiento por rampas: barra vacía → 40%×5 → 60%×3 → 80%×1–2 → trabajo.</li>
          <li>Respiración/bracing: aire 360° al abdomen; sin apneas largas.</li>
        </ul>
      </Section>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <header className="px-4 pt-4 pb-3 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="font-black text-base">Plan de Fuerza + Accesorios — Giovanni</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={exportCSV}>⬇️ CSV</button>
            <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={resetAllStorage}>🧹 Reset</button>
            <button className="px-3 py-2 rounded-xl bg-neutral-100" onClick={() => setTab("ajustes")}>⚙️</button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <TabButton active={tab === "sesion"} onClick={() => setTab("sesion")}>Sesión</TabButton>
          <TabButton active={tab === "plan"} onClick={() => setTab("plan")}>Plan</TabButton>
          <TabButton active={tab === "historial"} onClick={() => setTab("historial")}>Historial</TabButton>
        </div>
      </header>

      {tab === "sesion" && (
        <main className="p-4 space-y-4 pb-36">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-neutral-500">Sugerido</div>
            <div className="flex items-center gap-2 mt-2">
              <ToggleGroup options={["A", "B", "Movilidad"]} value={dayType} onChange={setDayType} />
              <div className="ml-auto text-xs text-neutral-500">Último: {lastType ?? "—"}</div>
            </div>
          </div>

          {dayType === "A" && (
            <div className="space-y-4">
              <StaticListCard title="Pre-Movilidad" hint="5–8 min rápido" items={[
                { n: "Respiración 360°", rec: "2×5" },
                { n: "Cat-Camel", rec: "1×8" },
                { n: "90/90 cadera", rec: "1×6/lado" },
                { n: "Tobillo rocks", rec: "1×10/lado" },
              ]} state={sessionInputs.preA} setState={(p)=>handleInput(["preA"],p)} />

              <HeavyLiftCard
                title={"Sentadilla — " + config.variants.squat}
                hint={"Top 3–5 @ RPE8 · Back-offs 2×5 @ ~90% (~" + roundToStep(weights.squat*0.9,config.rounding) + " " + config.units + ")"}
                state={sessionInputs.squat}
                setState={(p) => handleInput(["squat"], p)}
                rounding={config.rounding}
                units={config.units}
              />
              <DoubleProgCard
                title="Press de Banca"
                hint={"3×5–8 @ " + weights.bench + " " + config.units}
                state={sessionInputs.bench}
                setState={(p) => handleInput(["bench"], p)}
                units={config.units}
                rounding={config.rounding}
              />
              <DoubleProgCard
                title={"Remo — " + config.variants.row}
                hint={"3×6–10 @ " + weights.row + " " + config.units}
                state={sessionInputs.row}
                setState={(p) => handleInput(["row"], p)}
                units={config.units}
                rounding={config.rounding}
              />
              <AccessoryCard title="Hip Thrust" hint="3×6–10" state={sessionInputs.hipthrust} setState={(p) => handleInput(["hipthrust"], p)} />
              <AccessoryPairCard
                title="Postura + Brazos"
                hint="Face Pulls 3×12 · Curl Martillo 2–3×8–12"
                aLabel="Face Pulls"
                bLabel="Curl Martillo"
                state={sessionInputs.posturaBrazosA}
                setState={(p) => handleInput(["posturaBrazosA"], p)}
              />
              <AccessoryCard title="Core: Dead Bug" hint="3×8–10" state={sessionInputs.coreA} setState={(p) => handleInput(["coreA"], p)} simple />
              <AccessoryPairCard
                title="Pies"
                hint="Gemelos 3×12 · Tibialis 2–3×15"
                aLabel="Gemelos"
                bLabel="Tibialis"
                state={sessionInputs.piesA}
                setState={(p) => handleInput(["piesA"], p)}
              />
              <StaticListCard title="Post-Movilidad" hint="3–5 min suave" items={[
                { n: "Toe Splay", rec: "2×20–30s" },
                { n: "Short-Foot", rec: "2×20–30s" },
              ]} state={sessionInputs.postA} setState={(p)=>handleInput(["postA"],p)} />
            </div>
          )}

          {dayType === "B" && (
            <div className="space-y-4">
              <StaticListCard title="Pre-Movilidad" hint="5–8 min rápido" items={[
                { n: "Respiración 360°", rec: "2×5" },
                { n: "Cat-Camel", rec: "1×8" },
                { n: "Tobillo rocks", rec: "1×10/lado" },
              ]} state={sessionInputs.preB} setState={(p)=>handleInput(["preB"],p)} />

              <HeavyLiftCard
                title={"Peso Muerto — " + config.variants.deadlift}
                hint={"Top 3–5 @ RPE8 · Back-offs 2×5 @ ~90% (~" + roundToStep(weights.deadlift*0.9,config.rounding) + " " + config.units + ")"}
                state={sessionInputs.deadlift}
                setState={(p) => handleInput(["deadlift"], p)}
                rounding={config.rounding}
                units={config.units}
              />
              <DoubleProgCard
                title={config.variants.press}
                hint={"3×5–8 @ " + weights.press + " " + config.units}
                state={sessionInputs.press}
                setState={(p) => handleInput(["press"], p)}
                units={config.units}
                rounding={config.rounding}
              />
              <DoubleProgCard
                title={config.variants.pulldown}
                hint={"3×6–10 @ " + weights.pulldown + " " + config.units}
                state={sessionInputs.pulldown}
                setState={(p) => handleInput(["pulldown"], p)}
                units={config.units}
                rounding={config.rounding}
              />
              <DoubleProgCard
                title="Hip Thrust (Fuerza)"
                hint={"3×6–10 @ " + weights.hipthrust + " " + config.units}
                state={sessionInputs.hipthrustB}
                setState={(p) => handleInput(["hipthrustB"], p)}
                units={config.units}
                rounding={config.rounding}
              />
              <AccessoryPairCard
                title="Glúteo medio / Estabilidad"
                hint="Lateral Walks 2–3×15–20 · Clamshells 2×15–20"
                aLabel="Lateral Band Walks"
                bLabel="Clamshells"
                state={sessionInputs.gluteoMedio}
                setState={(p) => handleInput(["gluteoMedio"], p)}
              />
              <AccessoryCard title="Tríceps en cuerda" hint="2–3×8–12" state={sessionInputs.triceps} setState={(p) => handleInput(["triceps"], p)} />
              <AccessoryCard title="Core: Pallof / Side Plank" hint="Pallof 3×10/lado o Plank 2–3×20–30s" state={sessionInputs.coreB} setState={(p) => handleInput(["coreB"], p)} simple />
              <AccessoryPairCard
                title="Pies"
                hint="Gemelos 3×12 · Tibialis 2–3×15"
                aLabel="Gemelos"
                bLabel="Tibialis"
                state={sessionInputs.piesB}
                setState={(p) => handleInput(["piesB"], p)}
              />
              <StaticListCard title="Post-Movilidad" hint="3–5 min suave" items={[
                { n: "Toe Splay", rec: "2×20–30s" },
                { n: "Short-Foot", rec: "2×20–30s" },
              ]} state={sessionInputs.postB} setState={(p)=>handleInput(["postB"],p)} />
            </div>
          )}

          {dayType === "Movilidad" && (
            <div className="space-y-4">
              <StaticListCard title="Al despertar" hint="8–10 min" items={[
                { n: "Respiración 360°", rec: "2×5" },
                { n: "Cat-Camel", rec: "1×8" },
                { n: "90/90 cadera", rec: "1×6/lado" },
                { n: "Tobillo rocks", rec: "1×10/lado" },
                { n: "Toe Splay", rec: "2×20–30s" },
                { n: "Short-Foot", rec: "2×20–30s" },
              ]} state={sessionInputs.morn} setState={(p)=>handleInput(["morn"],p)} />
              <StaticListCard title="Durante el día (oficina/postura)" hint="micro-pauses" items={[
                { n: "Chin Tucks", rec: "2×10" },
                { n: "Wall Slides", rec: "2×10" },
                { n: "Face Pulls banda", rec: "2×12" },
                { n: "Y-T-W en apoyo", rec: "1–2×8" },
                { n: "De pie 2–3 min/hora", rec: "check" },
              ]} state={sessionInputs.day} setState={(p)=>handleInput(["day"],p)} />
            </div>
          )}

          <button onClick={completeSession} className="fixed bottom-6 left-4 right-4 py-4 rounded-2xl text-center font-semibold bg-indigo-600 text-white shadow-md">Guardar Sesión</button>
        </main>
      )}

      {tab === "plan" && <main className="p-4 pb-24">{planText}</main>}

      {tab === "historial" && (
        <main className="p-4 space-y-3 pb-24">
          {logs.length === 0 && <div className="text-sm text-neutral-500">Aún no hay sesiones guardadas.</div>}
          {[...logs].reverse().map((l, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{formatDate(l.date)} — {l.dayType}</div>
                <div className="text-xs text-neutral-500">{summaryHeadline(l)}</div>
              </div>
              <div className="mt-2 text-xs text-neutral-600 space-y-1">
                {Object.entries(l.exercises).map(([k, v]) => (
                  <div key={k}>{prettyExerciseRow(k, v)}</div>
                ))}
              </div>
            </div>
          ))}
        </main>
      )}

      {tab === "ajustes" && (
        <main className="p-4 space-y-4 pb-24">
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold">Unidades y redondeo</div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-xs text-neutral-500">Unidades</label>
                <select className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" value={config.units} onChange={(e) => setConfig({ ...config, units: e.target.value })}>
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-500">Redondeo</label>
                <input className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" step="0.25" value={config.rounding} onChange={(e) => setConfig({ ...config, rounding: parseFloat(e.target.value || 0.5) })} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold">Variantes</div>
            <SelectRow label="Sentadilla" value={config.variants.squat} onChange={(v) => setConfig({ ...config, variants: { ...config.variants, squat: v } })} options={["Box Squat", "Front Squat"]} />
            <SelectRow label="Peso Muerto" value={config.variants.deadlift} onChange={(v) => setConfig({ ...config, variants: { ...config.variants, deadlift: v } })} options={["Trap Bar", "Convencional desde bloques"]} />
            <SelectRow label="Press (día B)" value={config.variants.press} onChange={(v) => setConfig({ ...config, variants: { ...config.variants, press: v } })} options={["Press Inclinado", "Landmine Press"]} />
            <SelectRow label="Remo" value={config.variants.row} onChange={(v) => setConfig({ ...config, variants: { ...config.variants, row: v } })} options={["Remo con Pecho Apoyado", "Pendlay mod."]} />
            <SelectRow label="Jalón" value={config.variants.pulldown} onChange={(v) => setConfig({ ...config, variants: { ...config.variants, pulldown: v } })} options={["Jalón Supino", "Dominadas Asistidas"]} />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold">Incrementos</div>
            <NumberRow label="Pesados (±)" value={config.heavyIncrement} onChange={(v) => setConfig({ ...config, heavyIncrement: v })} step={0.5} />
            <NumberRow label="Pesados mini (±)" value={config.heavySmallIncrement} onChange={(v) => setConfig({ ...config, heavySmallIncrement: v })} step={0.5} />
            <NumberRow label="Banca/Press (±)" value={config.benchIncrement} onChange={(v) => setConfig({ ...config, benchIncrement: v })} step={0.5} />
            <NumberRow label="Press B (±)" value={config.pressIncrement} onChange={(v) => setConfig({ ...config, pressIncrement: v })} step={0.5} />
            <NumberRow label="Remo (±)" value={config.rowIncrement} onChange={(v) => setConfig({ ...config, rowIncrement: v })} step={0.5} />
            <NumberRow label="Jalón (±)" value={config.pulldownIncrement} onChange={(v) => setConfig({ ...config, pulldownIncrement: v })} step={0.5} />
            <NumberRow label="Hip Thrust (±)" value={config.hipthrustIncrement} onChange={(v) => setConfig({ ...config, hipthrustIncrement: v })} step={0.5} />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold">Pesos actuales</div>
            <NumberRow label={"Sentadilla ("+config.variants.squat+")"} value={weights.squat} onChange={(v) => setWeights({ ...weights, squat: v })} step={config.rounding} />
            <NumberRow label={"Peso Muerto ("+config.variants.deadlift+")"} value={weights.deadlift} onChange={(v) => setWeights({ ...weights, deadlift: v })} step={config.rounding} />
            <NumberRow label="Banca" value={weights.bench} onChange={(v) => setWeights({ ...weights, bench: v })} step={config.rounding} />
            <NumberRow label={config.variants.press} value={weights.press} onChange={(v) => setWeights({ ...weights, press: v })} step={config.rounding} />
            <NumberRow label="Remo" value={weights.row} onChange={(v) => setWeights({ ...weights, row: v })} step={config.rounding} />
            <NumberRow label="Jalón" value={weights.pulldown} onChange={(v) => setWeights({ ...weights, pulldown: v })} step={config.rounding} />
            <NumberRow label="Hip Thrust" value={weights.hipthrust} onChange={(v) => setWeights({ ...weights, hipthrust: v })} step={config.rounding} />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-sm font-semibold">Datos</div>
            <div className="text-xs text-neutral-500">Último día: {lastType ?? "—"}</div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 rounded-xl bg-neutral-100" onClick={() => resetData()}>Borrar historial</button>
              <button className="flex-1 px-4 py-2 rounded-xl bg-neutral-100" onClick={() => { localStorage.removeItem("giov_plan_config"); localStorage.removeItem("giov_plan_weights"); localStorage.removeItem("giov_plan_logs"); localStorage.removeItem("giov_plan_lastType"); location.reload(); }}>Restablecer todo</button>
            </div>
          </div>
        </main>
      )}

      <footer className="h-6" />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={"py-2 rounded-xl font-medium " + (active ? "bg-neutral-900 text-white" : "bg-neutral-100")}>{children}</button>
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="bg-neutral-100 p-1 rounded-xl flex w-full">
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)} className={"flex-1 px-4 py-2 rounded-lg text-sm " + (value === opt ? "bg-white shadow-sm font-semibold" : "opacity-70")}>{opt}</button>
      ))}
    </div>
  );
}

function NumberRow({ label, value, onChange, step = 0.5 }) {
  return (
    <div>
      <label className="text-xs text-neutral-500">{label}</label>
      <input className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value || 0))} />
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs text-neutral-500">{label}</label>
      <select className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function HeaderWithHint({ title, hint }) {
  return (
    <div className="flex items-center gap-2">
      <div className="font-semibold">{title}</div>
      {hint ? <div className="text-xs text-neutral-500">{hint}</div> : null}
    </div>
  );
}

function HeavyLiftCard({ title, hint, state, setState, rounding, units }) {
  const s = state ?? { topWeight: 0, topReps: 0, topRPE: 8, backoffs: [{ weight: 0, reps: 0 }, { weight: 0, reps: 0 }] };
  useEffect(() => {
    if (!s.backoffs[0].weight && s.topWeight) {
      const bo = roundToStep((s.topWeight || 0) * 0.9, rounding);
      setState({ ...s, backoffs: [{ ...s.backoffs[0], weight: bo }, { ...s.backoffs[1], weight: bo }] });
    }
  }, [s.topWeight]);
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        <div>
          <div className="text-xs text-neutral-500">Top set peso ({units})</div>
          <input className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" step={rounding} value={s.topWeight ?? ""} onChange={(e) => setState({ ...s, topWeight: num(e.target.value) })} />
        </div>
        <div>
          <div className="text-xs text-neutral-500">Reps (3–5)</div>
          <input className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" value={s.topReps ?? ""} onChange={(e) => setState({ ...s, topReps: int(e.target.value) })} />
        </div>
        <div>
          <div className="text-xs text-neutral-500">RPE</div>
          <input className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" step="0.5" value={s.topRPE ?? ""} onChange={(e) => setState({ ...s, topRPE: num(e.target.value) })} />
        </div>
      </div>
      <div className="text-xs text-neutral-500">Back-offs 2×5 @ ~90%</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
        {s.backoffs.map((b, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
            <input className="w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" step={rounding} value={b.weight ?? ""} onChange={(e) => setState(updateBackoff(s, i, { weight: num(e.target.value) }))} />
            <input className="w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" value={b.reps ?? ""} onChange={(e) => setState(updateBackoff(s, i, { reps: int(e.target.value) }))} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DoubleProgCard({ title, hint, state, setState, units, rounding }) {
  const s = state ?? { weight: 0, reps: [0, 0, 0] };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
        <div>
          <div className="text-xs text-neutral-500">Peso ({units})</div>
          <input className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" step={rounding} value={s.weight ?? ""} onChange={(e) => setState({ ...s, weight: num(e.target.value) })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
          {[0, 1, 2].map((i) => (
            <input key={i} className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" placeholder={"S" + (i + 1)} value={s.reps[i] ?? ""} onChange={(e) => setState({ ...s, reps: s.reps.map((r, idx) => (idx === i ? int(e.target.value) : r)) })} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccessoryCard({ title, hint, state, setState, simple = false }) {
  const defaultSets = simple ? [{}, {}] : [{}, {}, {}];
  const s = state ?? { sets: defaultSets };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        {(simple ? [0, 1] : [0, 1, 2]).map((i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
            <input className="w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" placeholder="kg" value={s.sets[i]?.weight ?? ""} onChange={(e) => setState(updateSet(s, i, { weight: num(e.target.value) }))} />
            <input className="w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" placeholder="reps" value={s.sets[i]?.reps ?? ""} onChange={(e) => setState(updateSet(s, i, { reps: int(e.target.value) }))} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AccessoryPairCard({ title, hint, aLabel, bLabel, state, setState }) {
  const s = state ?? { a: [0, 0], b: [0, 0] };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
        <div>
          <div className="text-xs text-neutral-500">{aLabel}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end mt-1">
            {[0, 1].map((i) => (
              <input key={i} className="w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" placeholder="reps" value={s.a[i] ?? ""} onChange={(e) => setState({ ...s, a: s.a.map((x, idx) => (idx === i ? int(e.target.value) : x)) })} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">{bLabel}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end mt-1">
            {[0, 1].map((i) => (
              <input key={i} className="w-full px-3 py-2 rounded-xl bg-neutral-100" type="number" placeholder="reps" value={s.b[i] ?? ""} onChange={(e) => setState({ ...s, b: s.b.map((x, idx) => (idx === i ? int(e.target.value) : x)) })} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StaticListCard({ title, hint, items, state, setState }) {
  const s = state ?? { done: items.map(() => false) };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <HeaderWithHint title={title} hint={hint} />
      <div className="space-y-2">
        {items.map((it, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!s.done[i]} onChange={(e)=> setState({ done: s.done.map((v,idx)=> idx===i ? e.target.checked : v) })} />
            <span className="flex-1">{it.n}</span>
            <span className="text-xs text-neutral-500">{it.rec}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function createEmptySession(dayType, config, weights) {
  if (dayType === "A") {
    return {
      preA: { done: [false,false,false,false] },
      squat: { topWeight: weights.squat, topReps: 0, topRPE: 8, backoffs: [{ weight: roundToStep(weights.squat * 0.9, config.rounding), reps: 0 }, { weight: roundToStep(weights.squat * 0.9, config.rounding), reps: 0 }] },
      bench: { weight: weights.bench, reps: [0, 0, 0] },
      row: { weight: weights.row, reps: [0, 0, 0] },
      hipthrust: { sets: [{}, {}, {}] },
      posturaBrazosA: { a: [0, 0], b: [0, 0] },
      coreA: { sets: [{}, {}] },
      piesA: { a: [0, 0], b: [0, 0] },
      postA: { done: [false,false] },
    };
  } else if (dayType === "B") {
    return {
      preB: { done: [false,false,false] },
      deadlift: { topWeight: weights.deadlift, topReps: 0, topRPE: 8, backoffs: [{ weight: roundToStep(weights.deadlift * 0.9, config.rounding), reps: 0 }, { weight: roundToStep(weights.deadlift * 0.9, config.rounding), reps: 0 }] },
      press: { weight: weights.press, reps: [0, 0, 0] },
      pulldown: { weight: weights.pulldown, reps: [0, 0, 0] },
      hipthrustB: { weight: weights.hipthrust, reps: [0, 0, 0] },
      gluteoMedio: { a: [0, 0], b: [0, 0] },
      triceps: { sets: [{}, {}, {}] },
      coreB: { sets: [{}, {}] },
      piesB: { a: [0, 0], b: [0, 0] },
      postB: { done: [false,false] },
    };
  } else {
    return {
      morn: { done: [false,false,false,false,false,false] },
      day: { done: [false,false,false,false,false] },
    };
  }
}

function setDeep(obj, path, value) {
  const clone = { ...obj };
  let cur = clone;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    cur[k] = { ...cur[k] };
    cur = cur[k];
  }
  const last = path[path.length - 1];
  cur[last] = value;
  return clone;
}

function updateBackoff(state, idx, patch) {
  const arr = state.backoffs.map((b, i) => (i === idx ? { ...b, ...patch } : b));
  return { ...state, backoffs: arr };
}

function updateSet(state, idx, patch) {
  const clone = state.sets.slice();
  clone[idx] = { ...clone[idx], ...patch };
  return { ...state, sets: clone };
}

function num(v) {
  const x = parseFloat(v);
  return isNaN(x) ? 0 : x;
}

function int(v) {
  const x = parseInt(v);
  return isNaN(x) ? 0 : x;
}

function roundToStep(v, step) {
  if (!step) return v;
  return Math.round(v / step) * step;
}

function applyProgressions({ weights, config, logs }) {
  const last = logs[logs.length - 1];
  const prev = logs.slice(0, -1).reverse();
  const getLiftHistory = (key) => prev.filter((s) => s.exercises[key]).map((s) => ({ key, data: s.exercises[key] }));
  let next = { ...weights };
  if (last.exercises.squat) {
    const history = getLiftHistory("squat");
    const seq = [last.exercises.squat, ...history.map((h) => h.data)];
    next.squat = evolveHeavy(weights.squat, seq, config);
  }
  if (last.exercises.deadlift) {
    const history = getLiftHistory("deadlift");
    const seq = [last.exercises.deadlift, ...history.map((h) => h.data)];
    next.deadlift = evolveHeavy(weights.deadlift, seq, config);
  }
  if (last.exercises.bench) next.bench = evolveDouble(weights.bench, last.exercises.bench, config.benchIncrement, config.rounding);
  if (last.exercises.row) next.row = evolveDouble(weights.row, last.exercises.row, config.rowIncrement, config.rounding);
  if (last.exercises.press) next.press = evolveDouble(weights.press, last.exercises.press, config.pressIncrement, config.rounding);
  if (last.exercises.pulldown) next.pulldown = evolveDouble(weights.pulldown, last.exercises.pulldown, config.pulldownIncrement, config.rounding);
  if (last.exercises.hipthrustB) next.hipthrust = evolveDouble(weights.hipthrust, last.exercises.hipthrustB, config.hipthrustIncrement, config.rounding);
  return next;
}

function evolveHeavy(current, sequence, config) {
  const ok = (s) => (s.topRPE ?? 10) <= 8 && (s.topReps ?? 0) >= 3 && (s.topReps ?? 0) <= 5;
  const fail = (s) => (s.topRPE ?? 10) > 8 || (s.topReps ?? 0) < 3;
  const s0 = sequence[0];
  const s1 = sequence[1];
  if (s0 && s1 && ok(s0) && ok(s1)) return roundToStep(current + config.heavyIncrement, config.rounding);
  if (s0 && s1 && fail(s0) && fail(s1) && s0.topWeight === s1.topWeight) return roundToStep(current * 0.9, config.rounding);
  return current;
}

function evolveDouble(current, now, inc, rounding) {
  const pass = now.reps.filter((r) => (r ?? 0) >= 8).length === 3;
  if (pass) return roundToStep(current + inc, rounding);
  return current;
}

function summaryHeadline(l) {
  const a = [];
  if (l.exercises.squat) a.push(l.exercises.squat.topWeight + "×" + l.exercises.squat.topReps);
  if (l.exercises.deadlift) a.push(l.exercises.deadlift.topWeight + "×" + l.exercises.deadlift.topReps);
  if (l.exercises.bench) a.push("BP " + l.exercises.bench.weight + "×" + l.exercises.bench.reps.join("/"));
  if (l.exercises.press) a.push("PR " + l.exercises.press.weight + "×" + l.exercises.press.reps.join("/"));
  if (l.exercises.hipthrustB) a.push("HT " + l.exercises.hipthrustB.weight + "×" + l.exercises.hipthrustB.reps.join("/"));
  return a.join(" · ");
}

function prettyExerciseRow(key, v) {
  if (v && v.topWeight !== undefined) return prettyName(key) + " Top " + v.topWeight + "×" + v.topReps + " RPE " + v.topRPE + " | Back-offs " + v.backoffs.map((b) => b.weight + "×" + b.reps).join(", ");
  if (v && v.weight !== undefined && v.reps) return prettyName(key) + " " + v.weight + "×" + v.reps.join("/");
  if (v && v.sets) return prettyName(key) + " " + v.sets.map((s) => (s && s.weight ? s.weight + "×" + (s.reps || "") : (s && s.reps ? s.reps : "") + " reps")).join(", ");
  if (v && v.a && v.b) return prettyName(key) + " A:" + v.a.join("/") + " B:" + v.b.join("/");
  if (v && v.done) return prettyName(key) + " " + v.done.filter(Boolean).length + "/" + v.done.length + " completados";
  return prettyName(key);
}

function prettyName(k) {
  const map = { preA: "Pre-Mov A", postA: "Post-Mov A", preB: "Pre-Mov B", postB: "Post-Mov B", morn: "Mov. Mañana", day: "Mov. Día", squat: "Sentadilla", deadlift: "Peso Muerto", bench: "Banca", row: "Remo", press: "Press", pulldown: "Jalón", hipthrust: "Hip Thrust", hipthrustB: "Hip Thrust (Fuerza)", posturaBrazosA: "Face Pulls + Curl", coreA: "Dead Bug", piesA: "Pies", gluteoMedio: "Abducciones", triceps: "Tríceps", coreB: "Core", piesB: "Pies" };
  return map[k] || k;
}

function formatDate(iso) {
  const d = new Date(iso);
  const dd = d.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" });
  const hh = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return dd + " " + hh;
}

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);
  return [state, setState];
}
