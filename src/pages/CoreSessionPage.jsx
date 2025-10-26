import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../state/useAppStore.js'

function CoreSessionPage() {
  const navigate = useNavigate()
  const roundsTarget = useAppStore((s) => s.progression.core.roundsPerDay)
  const markCoreDone = useAppStore((s) => s.markCoreDone)

  const [roundsDone, setRoundsDone] = useState(0)

  function addRound() {
    if (roundsDone < roundsTarget) {
      setRoundsDone((r) => r + 1)
    }
  }

  function removeRound() {
    if (roundsDone > 0) {
      setRoundsDone((r) => r - 1)
    }
  }

  function finish() {
    const completed = roundsDone > 0 ? roundsDone : 0
    markCoreDone(new Date(), completed)
    navigate('/')
  }

  return (
    <div className="space-y-6 pb-24 text-neutral-900 dark:text-neutral-100">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Core lumbar / estabilidad
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Objetivo hoy: {roundsTarget} rondas controladas
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
          <h2 className="text-base font-medium text-neutral-900 dark:text-white">
            Curl-up modificado (McGill)
          </h2>
          <p className="text-neutral-700 dark:text-neutral-400">
            Boca arriba con una pierna extendida y la otra flexionada. Manos
            bajo la zona lumbar para mantener una curva neutra, levanta
            ligeramente cabeza y hombros sin tirar del cuello. Mantén 8–10 s.
            3 series x 6–8 repeticiones por lado.
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
          <h2 className="text-base font-medium text-neutral-900 dark:text-white">
            Plancha lateral corta
          </h2>
          <p className="text-neutral-700 dark:text-neutral-400">
            Apoya rodillas y antebrazo. Alinea rodillas, cadera y hombro.
            Mantén 8–10 s por lado. 3 rondas por lado. Descansa 5–10 s.
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
          <h2 className="text-base font-medium text-neutral-900 dark:text-white">
            Bird-dog
          </h2>
          <p className="text-neutral-700 dark:text-neutral-400">
            Cuadrupedia. Estira brazo y pierna contraria manteniendo cadera
            paralela al suelo, cuello largo mirando al suelo. Mantén 8–10 s.
            3 series x 6–8 repeticiones por lado.
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
          <h2 className="text-base font-medium text-neutral-900 dark:text-white">
            Puente de glúteo
          </h2>
          <p className="text-neutral-700 dark:text-neutral-400">
            Retroversión pélvica suave, sube apretando glúteos sin arquear la
            zona lumbar. Pausa arriba 2–3 s. 2–3 series de 10–12 repeticiones.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
        <div className="text-sm">
          <div className="text-neutral-600 dark:text-neutral-400">
            Rondas completadas
          </div>
          <div className="text-lg font-semibold text-neutral-900 dark:text-white">
            {roundsDone} / {roundsTarget}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={removeRound}
            className="rounded-xl bg-neutral-200 px-4 py-2 text-lg font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200"
          >
            −
          </button>
          <button
            onClick={addRound}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-lg font-semibold text-white dark:bg-indigo-500 dark:text-neutral-900"
          >
            +
          </button>
        </div>
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

export default CoreSessionPage
