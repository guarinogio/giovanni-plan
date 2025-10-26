import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../state/useAppStore.js'

function CardioSessionPage() {
  const navigate = useNavigate()
  const targetMinutes = useAppStore((s) => s.progression.cardio.targetMinutes)
  const markCardioDone = useAppStore((s) => s.markCardioDone)

  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [mode, setMode] = useState('bici')

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const minutesDisplay = Math.floor(seconds / 60)
  const secondsDisplay = seconds % 60

  function toggleRun() {
    setRunning((r) => !r)
  }

  function finish() {
    const mins = Math.round(seconds / 60)
    markCardioDone(new Date(), mins, mode)
    navigate('/')
  }

  return (
    <div className="space-y-6 pb-24 text-neutral-900 dark:text-neutral-100">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Cardio Zona 2
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Objetivo {targetMinutes} min hoy, RPE 3–4/10. Debes poder hablar en
          frases sin ahogarte.
        </p>
      </header>

      <section className="flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
        <div className="flex items-end gap-2 font-mono text-4xl font-semibold leading-none text-neutral-900 dark:text-white">
          <span className="tabular-nums">
            {minutesDisplay.toString().padStart(2, '0')}
          </span>
          <span className="text-2xl tabular-nums text-neutral-500 dark:text-neutral-500">
            :
          </span>
          <span className="tabular-nums">
            {secondsDisplay.toString().padStart(2, '0')}
          </span>
          <span className="ml-2 text-sm font-normal text-neutral-500 dark:text-neutral-500">
            min:seg
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleRun}
            className={
              running
                ? 'rounded-xl bg-neutral-200 px-4 py-2 text-lg font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200'
                : 'rounded-xl bg-indigo-600 px-4 py-2 text-lg font-semibold text-white dark:bg-indigo-500 dark:text-neutral-900'
            }
          >
            {running ? 'Pausar' : 'Empezar'}
          </button>
          <button
            onClick={() => {
              setSeconds(0)
              setRunning(false)
            }}
            className="rounded-xl bg-neutral-200 px-4 py-2 text-lg font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
          Modalidad de cardio
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {[
            { value: 'bici', label: 'Bici' },
            { value: 'caminata', label: 'Caminata inclinada' },
            { value: 'eliptica', label: 'Elíptica' },
            { value: 'agua', label: 'Agua/Piscina' }
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value)}
              className={
                mode === opt.value
                  ? 'rounded-full bg-indigo-600 px-3 py-2 font-semibold text-white dark:bg-indigo-500 dark:text-neutral-900'
                  : 'rounded-full bg-neutral-200 px-3 py-2 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300'
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-500">
          Mantén RPE 3–4/10. Si subes a 6–7/10 ya no es Zona 2. Para de
          inmediato si hay dolor lumbar punzante, irradiado, mareo o dolor
          torácico.
        </p>
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

export default CardioSessionPage
