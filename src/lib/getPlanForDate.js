export function dateKey(d) {
  const iso = new Date(d).toISOString()
  return iso.slice(0, 10)
}

function buildSessions(progression) {
  return [
    {
      id: 'core',
      type: 'core',
      title: 'Core lumbar / estabilidad',
      summary:
        'Rondas ' +
        progression.core.roundsPerDay +
        ' (McGill + glúteo)'
    },
    {
      id: 'cardio',
      type: 'cardio',
      title: 'Cardio Zona 2',
      summary:
        progression.cardio.targetMinutes +
        ' min RPE 3–4/10 respirando normal'
    },
    {
      id: 'strengthA',
      type: 'strength',
      routine: 'A',
      title: 'Fuerza Rutina A',
      summary: 'Bisagra cadera, empuje, tirón, pierna, glúteo'
    },
    {
      id: 'strengthB',
      type: 'strength',
      routine: 'B',
      title: 'Fuerza Rutina B',
      summary: 'Pull-through, prensa pierna, remo pecho-soportado'
    },
    {
      id: 'mobilityFast',
      type: 'mobility',
      variant: 'rapida',
      title: 'Movilidad rápida',
      summary: 'Cadera, pecho, cuello (~10 min)'
    },
    {
      id: 'mobilityFull',
      type: 'mobility',
      variant: 'completa',
      title: 'Movilidad completa',
      summary: 'Cadera + torácica + planta pie (~10 min)'
    },
    {
      id: 'ergonomia',
      type: 'ergonomia',
      title: 'Pausas activas / ergonomía',
      summary:
        'Hombros atrás, cuello neutro cada 30–45 min'
    }
  ]
}

export function getAllSessions(progression) {
  return buildSessions(progression)
}

function getLastStrengthRoutine(historyByDate, todayKey) {
  const keys = Object.keys(historyByDate).sort((a, b) =>
    a < b ? 1 : -1
  )
  for (const k of keys) {
    if (k === todayKey) continue
    const day = historyByDate[k]
    if (!day) continue
    if (Array.isArray(day.strengthSessions)) {
      for (let i = day.strengthSessions.length - 1; i >= 0; i--) {
        const s = day.strengthSessions[i]
        if (s && s.routine) return s.routine
      }
    }
    if (day.strength && day.strength.routine) {
      return day.strength.routine
    }
  }
  return null
}

export function getSuggestedSessions(date, progression, historyByDate) {
  const todayKeyStr = dateKey(date)
  const all = buildSessions(progression)

  const core = all.find((s) => s.id === 'core')
  const mobilityFast = all.find((s) => s.id === 'mobilityFast')
  const cardio = all.find((s) => s.id === 'cardio')
  const strengthA = all.find((s) => s.id === 'strengthA')
  const strengthB = all.find((s) => s.id === 'strengthB')

  const lastStrength = getLastStrengthRoutine(
    historyByDate,
    todayKeyStr
  )
  const nextStrength =
    lastStrength === 'A' ? strengthB : strengthA

  const dayLog = historyByDate[todayKeyStr] || {}
  const cardioAlready = !!dayLog.cardio?.done

  const suggestion = []
  if (core) suggestion.push(core)
  if (nextStrength) suggestion.push(nextStrength)
  if (!cardioAlready && cardio) suggestion.push(cardio)
  if (mobilityFast) suggestion.push(mobilityFast)

  return suggestion.filter(Boolean)
}
