import useAppStore from '../state/useAppStore.js'

export default function SettingsPage() {
  const theme = useAppStore((s) => s.theme || 'dark')
  const setTheme = useAppStore((s) => s.setTheme)

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="space-y-6 pb-24 text-neutral-900 dark:text-neutral-100">
      <header className="px-4 pt-6 space-y-1">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Ajustes
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Todo esto es solo para ti. Tus datos viven en este dispositivo.
        </p>
      </header>

      <section className="mx-4 space-y-4 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-200">
              Tema
            </h2>
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Claro u oscuro. Se guarda en este dispositivo.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className={
              theme === 'dark'
                ? 'rounded-full bg-neutral-800 px-4 py-2 text-xs font-semibold text-white ring-1 ring-neutral-700'
                : 'rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-900 ring-1 ring-neutral-300'
            }
          >
            {theme === 'dark' ? 'Oscuro' : 'Claro'}
          </button>
        </div>
      </section>

      <section className="mx-4 space-y-2 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
        <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
          Estado
        </h2>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          No hay login, nube ni analíticas. El progreso vive en localStorage.
          Si borras datos del navegador, pierdes el progreso guardado.
        </p>
      </section>

      <section className="mx-4 space-y-2 rounded-2xl bg-white p-4 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
        <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
          Autoprogresión
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <li>
            Core: sube rondas semanales si lo haces casi todos los días sin que
            la lumbar pase de 2/10.
          </li>
          <li>
            Cardio Zona 2: sube minutos objetivo si cumples tiempo suave sin
            dolor raro en lumbar ni falta de aire fuerte.
          </li>
          <li>
            Fuerza técnica: si completas todas las series limpias en un
            ejercicio, siguiente vez ese ejercicio empieza un poco más pesado.
          </li>
          <li>
            Movilidad: si la vas saltando, el sistema fuerza versión completa
            para que abras cadera, pecho y cuello.
          </li>
        </ul>
      </section>

      <section className="mx-4 pb-24 text-center text-[10px] leading-relaxed text-neutral-600 dark:text-neutral-600">
        <p>
          Si aparece hormigueo, entumecimiento, debilidad repentina o dolor que
          baja por la pierna, paras y pides valoración médica.
        </p>
      </section>
    </div>
  )
}
