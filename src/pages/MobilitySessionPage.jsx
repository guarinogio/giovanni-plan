import { useSearchParams, useNavigate } from 'react-router-dom'
import useAppStore from '../state/useAppStore.js'

function MobilitySessionPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const markMobilityDone = useAppStore((s) => s.markMobilityDone)

  const variant = params.get('variant') || 'rapida'

  function finish() {
    markMobilityDone(new Date(), variant)
    navigate('/')
  }

  return (
    <div className="space-y-6 pb-24 text-neutral-900 dark:text-neutral-100">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Movilidad
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {variant === 'completa'
            ? 'Versión completa (~10 min): cadera/flexores, pecho, torácica, gemelos/planta, cuello'
            : 'Versión rápida: flexor cadera, pecho abierto, cuello neutro'}
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed">
        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
          <h2 className="text-base font-medium text-neutral-900 dark:text-white">
            Cadera / flexores
          </h2>
          <ul className="list-disc space-y-1 pl-4 text-neutral-700 dark:text-neutral-400">
            <li>
              Zanca tipo couch stretch suave, rodilla acolchada. Aprieta glúteo
              de la pierna atrasada, costillas abajo. 2×30–45 s por lado.
            </li>
          </ul>
        </div>

        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
          <h2 className="text-base font-medium text-neutral-900 dark:text-white">
            Pecho / hombro
          </h2>
          <ul className="list-disc space-y-1 pl-4 text-neutral-700 dark:text-neutral-400">
            <li>
              Estiramiento pectoral en marco de puerta. Hombro bajo, lejos de la
              oreja. 2×30 s por lado.
            </li>
            <li>
              Retracción escapular suave: junta omóplatos abajo y atrás 15–20
              repeticiones.
            </li>
          </ul>
        </div>

        {variant === 'completa' && (
          <>
            <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
              <h2 className="text-base font-medium text-neutral-900 dark:text-white">
                Torácica / espalda alta
              </h2>
              <ul className="list-disc space-y-1 pl-4 text-neutral-700 dark:text-neutral-400">
                <li>
                  Extensión torácica sobre rodillo o toalla enrollada. Mueve el
                  punto en la zona media/alta, no en la lumbar. 1–2 min total.
                </li>
                <li>
                  T y Y boca abajo o banco inclinado: 1×10–12 de cada, apretando
                  escápulas abajo y atrás.
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
              <h2 className="text-base font-medium text-neutral-900 dark:text-white">
                Gemelos / fascia plantar
              </h2>
              <ul className="list-disc space-y-1 pl-4 text-neutral-700 dark:text-neutral-400">
                <li>
                  Estiramiento gemelo pared: 30 s rodilla estirada + 30 s
                  rodilla flexionada por lado.
                </li>
                <li>
                  Liberación plantar con pelota dura ~1 min por pie. Presión
                  tolerable, sin dolor punzante en el talón.
                </li>
              </ul>
            </div>
          </>
        )}

        <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
          <h2 className="text-base font-medium text-neutral-900 dark:text-white">
            Cuello
          </h2>
          <ul className="list-disc space-y-1 pl-4 text-neutral-700 dark:text-neutral-400">
            <li>
              Chin tucks: lleva el mentón hacia atrás y la coronilla hacia
              arriba sin mirar al techo. 2×10 repeticiones.
            </li>
          </ul>
        </div>

        <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-500">
          Para de inmediato si notas hormigueo, entumecimiento, dolor que baja
          por brazo o pierna, mareo o visión rara.
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

export default MobilitySessionPage
