import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { dateKey } from '../lib/getPlanForDate.js'

function minRepsFromScheme(scheme) {
  if (!scheme) return 8
  const match = scheme.match(/(\d+)[^\d]+(\d+)/)
  if (match) {
    const a = parseInt(match[1], 10)
    const b = parseInt(match[2], 10)
    return Math.min(a, b)
  }
  const solo = scheme.match(/(\d+)/)
  if (solo) {
    return parseInt(solo[1], 10)
  }
  return 8
}

const defaultProgression = {
  core: { roundsPerDay: 2 },
  cardio: { targetMinutes: 25, maxMinutes: 45 },
  strength: {
    exercises: {
      'bisagra cadera': { weight: 0, repsScheme: '3x8-12' },
      'empuje horizontal': { weight: 0, repsScheme: '3x8-12' },
      'tirón horizontal': { weight: 0, repsScheme: '3x8-12' },
      'pierna dominante rodilla': {
        weight: 0,
        repsScheme: '3x8-12'
      },
      'glúteo/abducción': {
        weight: 0,
        repsScheme: '3x12-15'
      }
    }
  },
  mobility: {
    preferredVariant: 'rapida'
  }
}

const useAppStore = create(
  persist(
    (set, get) => ({
      progression: defaultProgression,
      historyByDate: {},
      theme: 'dark',

      getDayLog: (date) => {
        const k = typeof date === 'string' ? date : dateKey(date)
        return get().historyByDate[k] || {}
      },

      setTheme: (mode) => {
        set({ theme: mode === 'light' ? 'light' : 'dark' })
      },

      markCoreDone: (date, roundsCompleted) => {
        const k = typeof date === 'string' ? date : dateKey(date)
        set((state) => {
          const day = state.historyByDate[k] || {}
          const newDay = {
            ...day,
            core: { done: true, rounds: roundsCompleted }
          }
          return {
            historyByDate: { ...state.historyByDate, [k]: newDay }
          }
        })
      },

      markCardioDone: (date, minutesActual, mode) => {
        const k = typeof date === 'string' ? date : dateKey(date)
        set((state) => {
          const day = state.historyByDate[k] || {}
          const newDay = {
            ...day,
            cardio: {
              done: true,
              minutes: minutesActual,
              mode
            }
          }

          let newProgression = state.progression
          if (
            minutesActual >=
              state.progression.cardio.targetMinutes &&
            state.progression.cardio.targetMinutes <
              state.progression.cardio.maxMinutes
          ) {
            const nextTarget = Math.min(
              state.progression.cardio.targetMinutes + 2,
              state.progression.cardio.maxMinutes
            )
            newProgression = {
              ...state.progression,
              cardio: {
                ...state.progression.cardio,
                targetMinutes: nextTarget
              }
            }
          }

          return {
            historyByDate: {
              ...state.historyByDate,
              [k]: newDay
            },
            progression: newProgression
          }
        })
      },

      markStrengthDone: (date, routine, exercisesResults) => {
        const k = typeof date === 'string' ? date : dateKey(date)

        set((state) => {
          const day = state.historyByDate[k] || {}

          const prevSessions = Array.isArray(
            day.strengthSessions
          )
            ? day.strengthSessions
            : day.strength
            ? [day.strength]
            : []

          const newSession = {
            done: true,
            routine,
            results: exercisesResults
          }

          const newDay = {
            ...day,
            strengthSessions: [...prevSessions, newSession]
          }

          const updatedExercises = {
            ...state.progression.strength.exercises
          }

          exercisesResults.forEach((exerciseObj) => {
            const keyMap = {
              'Bisagra de cadera': 'bisagra cadera',
              Empuje: 'empuje horizontal',
              Tirón: 'tirón horizontal',
              Pierna: 'pierna dominante rodilla',
              Glúteo: 'glúteo/abducción'
            }

            const storeKey = keyMap[exerciseObj.name]
            if (!storeKey) return

            const prev = updatedExercises[storeKey] || {
              weight: 0,
              repsScheme: exerciseObj.repsScheme || ''
            }

            const minTarget = minRepsFromScheme(
              exerciseObj.repsScheme ||
                prev.repsScheme
            )

            const allSetsOk = Array.isArray(
              exerciseObj.sets
            )
              ? exerciseObj.sets.length > 0 &&
                exerciseObj.sets.every(
                  (s) =>
                    s &&
                    s.ok === true &&
                    typeof s.reps === 'number' &&
                    s.reps >= minTarget
                )
              : false

            const lastSet = Array.isArray(exerciseObj.sets)
              ? exerciseObj.sets[
                  exerciseObj.sets.length - 1
                ]
              : null

            const lastWeightNum = lastSet
              ? parseFloat(
                  lastSet.weight || prev.weight
                ) || 0
              : prev.weight || 0

            if (allSetsOk) {
              updatedExercises[storeKey] = {
                weight: lastWeightNum + 2.5,
                repsScheme:
                  exerciseObj.repsScheme ||
                  prev.repsScheme
              }
            } else {
              updatedExercises[storeKey] = {
                weight: lastWeightNum,
                repsScheme:
                  exerciseObj.repsScheme ||
                  prev.repsScheme
              }
            }
          })

          const newProgression = {
            ...state.progression,
            strength: {
              ...state.progression.strength,
              exercises: updatedExercises
            }
          }

          return {
            historyByDate: {
              ...state.historyByDate,
              [k]: newDay
            },
            progression: newProgression
          }
        })
      },

      markMobilityDone: (date, variant) => {
        const k = typeof date === 'string' ? date : dateKey(date)
        set((state) => {
          const day = state.historyByDate[k] || {}
          const newDay = {
            ...day,
            mobility: { done: true, variant }
          }
          const newProgression = {
            ...state.progression,
            mobility: {
              preferredVariant:
                variant ||
                state.progression.mobility
                  .preferredVariant
            }
          }
          return {
            historyByDate: {
              ...state.historyByDate,
              [k]: newDay
            },
            progression: newProgression
          }
        })
      },

      markErgoDone: (date) => {
        const k = typeof date === 'string' ? date : dateKey(date)
        set((state) => {
          const day = state.historyByDate[k] || {}
          const newDay = {
            ...day,
            ergonomia: { done: true, ts: Date.now() }
          }
          return {
            historyByDate: {
              ...state.historyByDate,
              [k]: newDay
            }
          }
        })
      },

      finalizeDay: (date) => {
        const d = new Date(date)
        set((state) => {
          let newProgression = state.progression

          const last7Keys = []
          for (let i = 0; i < 7; i++) {
            const dd = new Date(d)
            dd.setDate(d.getDate() - i)
            last7Keys.push(dateKey(dd))
          }

          let coreCount = 0
          last7Keys.forEach((k) => {
            if (state.historyByDate[k]?.core?.done) {
              coreCount += 1
            }
          })

          if (
            coreCount >= 5 &&
            newProgression.core.roundsPerDay < 3
          ) {
            newProgression = {
              ...newProgression,
              core: {
                ...newProgression.core,
                roundsPerDay:
                  newProgression.core.roundsPerDay + 1
              }
            }
          }

          let missedMobilityStreak = 0
          for (let i = 0; i < 2; i++) {
            const dd = new Date(d)
            dd.setDate(d.getDate() - i)
            const k = dateKey(dd)
            if (
              !(
                state.historyByDate[k]?.mobility
                  ?.done
              )
            ) {
              missedMobilityStreak += 1
            } else {
              break
            }
          }
          if (missedMobilityStreak >= 2) {
            newProgression = {
              ...newProgression,
              mobility: {
                ...newProgression.mobility,
                preferredVariant:
                  'completa'
              }
            }
          }

          const kToday = dateKey(d)
          const todayDay = state.historyByDate[kToday] || {}

          return {
            progression: newProgression,
            historyByDate: {
              ...state.historyByDate,
              [kToday]: todayDay
            }
          }
        })
      }
    }),
    {
      name: 'app-state',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useAppStore
