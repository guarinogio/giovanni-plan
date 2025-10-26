import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../state/useAppStore.js'
import {
  getAllSessions,
  getSuggestedSessions,
  dateKey
} from '../lib/getPlanForDate.js'

function TodayPage() {
  const navigate = useNavigate()

  const progression = useAppStore((s) => s.progression)
  const historyByDate = useAppStore((s) => s.historyByDate)
  const finalizeDay = useAppStore((s) => s.finalizeDay)
  const markErgoDone = useAppStore((s) => s.markErgoDone)

  const today = new Date()
  const todayK = dateKey(today)
  const dayLog = historyByDate[todayK] || {}

  const suggestedSessions = useMemo(
    () =>
      getSuggestedSessions(
        today,
        progression,
        historyByDate
      ),
    [today, progression, historyByDate]
  )

  const allSessionsFull = useMemo(
    () => getAllSessions(progression),
    [progression]
  )

  const suggestedIds = new Set(
    suggestedSessions.map((s) => s.id)
  )
  const otherSessions = allSessionsFull.filter(
    (s) => !suggestedIds.has(s.id)
  )

  function goToSession(session) {
    if (session.type === 'core') {
      navigate('/core')
      return
    }
    if (session.type === 'cardio') {
      navigate('/cardio')
      return
    }
    if (session.type === 'strength') {
      navigate('/strength/' + session.routine)
      return
    }
    if (session.type === 'mobility') {
      navigate(
        '/mobility?variant=' +
          (session.variant || 'rapida')
      )
      return
    }
    if (session.type === 'ergonomia') {
      markErgoDone(today)
      return
    }
  }

  function renderSessionList(list) {
    return (
      <div className="space-y-3">
        {list.map((session) => (
          <button
            key={session.id}
            onClick={() => goToSession(session)}
            className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-base font-medium text-neutral-900 dark:text-white">
                  {session.title}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {session.summary}
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end">
                <span className="rounded-lg bg-indigo-600 px-2 py-1 text-xs font-semibold text-white dark:bg-indigo-500 dark:text-neutral-900">
                  Ir
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-24 text-neutral-900 dark:text-neutral-100">
      <header className="px-1 pt-2 space-y-2">
        <div className="text-xs text-neutral-500 dark:text-neutral-500">
          {today.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Hoy
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Elige qué sesión quieres hacer ahora.
        </p>
      </header>

      <section className="space-y-4">
        <div className="px-1 text-sm font-medium text-neutral-900 dark:text-neutral-200">
          Sugerido hoy
        </div>
        {renderSessionList(suggestedSessions)}
      </section>

      {otherSessions.length > 0 && (
        <section className="space-y-4">
          <div className="px-1 text-sm font-medium text-neutral-900 dark:text-neutral-200">
            Más sesiones
          </div>
          {renderSessionList(otherSessions)}
        </section>
      )}

      <div className="px-1 pt-4">
        <button
          onClick={() => finalizeDay(today)}
          className="w-full rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white dark:bg-indigo-500 dark:text-neutral-900"
        >
          Guardar día y actualizar metas
        </button>
      </div>
    </div>
  )
}

export default TodayPage
