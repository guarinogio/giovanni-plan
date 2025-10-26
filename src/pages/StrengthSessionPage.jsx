import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAppStore from '../state/useAppStore.js'

function StrengthSessionPage() {
  const navigate = useNavigate()
  const { routine } = useParams()
  const markStrengthDone = useAppStore((s) => s.markStrengthDone)
  const prog = useAppStore((s) => s.progression.strength.exercises)

  const templates = {
    A: [
      {
        name: 'Bisagra de cadera',
        cue: 'Peso muerto rumano mancuernas. Cadera atrás, espalda alta tensa, lumbar neutra.',
        repsScheme: '3x8-12',
        key: 'bisagra cadera',
        setsTarget: 3
      },
      {
        name: 'Empuje',
        cue: 'Push-up inclinado o press horizontal cómodo. Pecho abierto, hombros abajo.',
        repsScheme: '3x8-12',
        key: 'empuje horizontal',
        setsTarget: 3
      },
      {
        name: 'Tirón',
        cue: 'Remo sentado banda/máquina. Escápulas atrás y abajo, cuello largo.',
        repsScheme: '3x8-12',
        key: 'tirón horizontal',
        setsTarget: 3
      },
      {
        name: 'Pierna',
        cue: 'Sentadilla a cajón cómodo o prensa rango cómodo.',
        repsScheme: '3x8-12',
        key: 'pierna dominante rodilla',
        setsTarget: 3
      },
      {
        name: 'Glúteo',
        cue: 'Puente / hip thrust con pausa arriba 2–3 s.',
        repsScheme: '3x12-15',
        key: 'glúteo/abducción',
        setsTarget: 3
      }
    ],
    B: [
      {
        name: 'Bisagra de cadera',
        cue: 'Pull-through banda/cable. Empuja cadera atrás, no arches lumbar.',
        repsScheme: '3x8-12',
        key: 'bisagra cadera',
        setsTarget: 3
      },
      {
        name: 'Empuje',
        cue: 'Press máquina o mancuerna banco inclinado. Hombros abajo.',
        repsScheme: '3x8-12',
        key: 'empuje horizontal',
        setsTarget: 3
      },
      {
        name: 'Tirón',
        cue: 'Remo pecho-soportado. Pecho apoyado, tira con espalda alta.',
        repsScheme: '3x8-12',
        key: 'tirón horizontal',
        setsTarget: 3
      },
      {
        name: 'Pierna',
        cue: 'Prensa de piernas rango cómodo, rodilla alineada con pie.',
        repsScheme: '3x8-12',
        key: 'pierna dominante rodilla',
        setsTarget: 3
      },
      {
        name: 'Glúteo',
        cue: 'Hip thrust banco con pausa arriba 2–3 s.',
        repsScheme: '3x12-15',
        key: 'glúteo/abducción',
        setsTarget: 3
      }
    ]
  }

  const plan = templates[routine === 'B' ? 'B' : 'A'] || templates.A

  const [exercisesState, setExercisesState] = useState(() =>
    plan.map((ex) => {
      const baseWeight = prog[ex.key]?.weight || 0
      const setsArr = Array.from({ length: ex.setsTarget }).map(() => ({
        reps: '',
        weight: baseWeight,
        ok: false
      }))
      return {
        name: ex.name,
        repsScheme: ex.repsScheme,
        key: ex.key,
        cue: ex.cue,
        sets: setsArr
      }
    })
  )

  function updateSet(exIdx, setIdx, field, value) {
    setExercisesState((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex
        const newSets = ex.sets.map((s, j) => {
          if (j !== setIdx) return s
          if (field === 'ok') {
            return { ...s, ok: !s.ok }
          }
          if (field === 'reps') {
            const vNum = value === '' ? '' : parseInt(value, 10) || 0
            return { ...s, reps: vNum }
          }
          if (field === 'weight') {
            const clean = value.replace(',', '.')
            return { ...s, weight: clean }
          }
          return s
        })
        return { ...ex, sets: newSets }
      })
    )
  }

  function finish() {
    const payload = exercisesState.map((ex) => ({
      name: ex.name,
      repsScheme: ex.repsScheme,
      sets: ex.sets.map((s) => ({
        reps: typeof s.reps === 'string' ? parseInt(s.reps || '0', 10) : s.reps,
        weight: parseFloat(s.weight || '0'),
        ok: s.ok
      }))
    }))

    markStrengthDone(new Date(), routine === 'B' ? 'B' : 'A', payload)
    navigate('/')
  }

  return (
    <div className="space-y-6 pb-24 text-neutral-900 dark:text-neutral-100">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Fuerza técnica Rutina {routine === 'B' ? 'B' : 'A'}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Meta: 3x8–12 (o 3x12–15 en glúteo). RPE 6–7. Control limpio. Parar si
          hay pinchazo lumbar agudo, irradiado o entumecimiento.
        </p>
      </header>

      <section className="space-y-4">
        {exercisesState.map((ex, exIdx) => (
          <div
            key={exIdx}
            className="space-y-4 rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800"
          >
            <div>
              <div className="text-base font-medium text-neutral-900 dark:text-white">
                {ex.name}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {ex.cue}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-500">
                {ex.repsScheme} sugerido • peso base {prog[ex.key]?.weight || 0}{' '}
                kg
              </div>
            </div>

            <div className="space-y-2">
              {ex.sets.map((set, setIdx) => (
                <div
                  key={setIdx}
                  className="flex flex-col gap-3 rounded-lg bg-neutral-100 p-3 ring-1 ring-neutral-200 dark:bg-neutral-800/60 dark:ring-neutral-700"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                    <span>Serie {setIdx + 1}</span>
                    <button
                      onClick={() => updateSet(exIdx, setIdx, 'ok')}
                      className={
                        set.ok
                          ? 'rounded-md bg-emerald-500 px-2 py-1 font-semibold text-neutral-900'
                          : 'rounded-md bg-neutral-200 px-2 py-1 font-semibold text-neutral-900 ring-1 ring-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-600'
                      }
                    >
                      {set.ok ? 'OK reps' : 'No OK'}
                    </button>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
                        Reps
                      </label>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-center text-sm text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(exIdx, setIdx, 'reps', e.target.value)
                        }
                        min={0}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-neutral-600 dark:text-neutral-400">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-center text-sm text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(exIdx, setIdx, 'weight', e.target.value)
                        }
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <button
        onClick={finish}
        className="w-full rounded-xl bg-emerald-500 py-3 text-center font-semibold text-neutral-900"
      >
        Terminar bloque
      </button>
    </div>
  )
}

export default StrengthSessionPage
