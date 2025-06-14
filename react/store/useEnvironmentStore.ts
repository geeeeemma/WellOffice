import { create } from "zustand"
import type { Environment, HistoricalData, Suggestion, ThresholdUpdate, SensorUpdate } from "@/types/environment"
import { apiService } from "@/services/api"

interface EnvironmentStore {
  environments: Environment[]
  suggestions: Suggestion[]
  historicalData: Record<string, HistoricalData[]>
  loading: boolean
  error: string | null

  // Actions
  fetchEnvironments: () => Promise<void>
  fetchSuggestions: () => Promise<void>
  fetchHistoricalData: (environmentId: string, parameterId: string, hours?: number) => Promise<void>
  refreshEnvironment: (environmentId: string) => Promise<void>
  updateThresholds: (update: ThresholdUpdate) => Promise<void>
  updateSensor: (update: SensorUpdate) => Promise<void>
}

export const useEnvironmentStore = create<EnvironmentStore>((set, get) => ({
  environments: [],
  suggestions: [],
  historicalData: {},
  loading: false,
  error: null,

  fetchEnvironments: async () => {
    set({ loading: true, error: null })
    try {
      const environments = await apiService.getEnvironments()
      set({ environments, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  fetchSuggestions: async () => {
    try {
      const suggestions = await apiService.getSuggestions()
      set({ suggestions })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  fetchHistoricalData: async (environmentId: string, parameterId: string, hours = 24) => {
    try {
      const data = await apiService.getHistoricalData(environmentId, parameterId, hours)
      const key = `${environmentId}-${parameterId}`
      set((state) => ({
        historicalData: {
          ...state.historicalData,
          [key]: data,
        },
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  refreshEnvironment: async (environmentId: string) => {
    try {
      const environment = await apiService.getEnvironment(environmentId)
      set((state) => ({
        environments: state.environments.map((env) => (env.id === environmentId ? environment : env)),
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  updateThresholds: async (update: ThresholdUpdate) => {
    try {
      await apiService.updateThresholds(update)
      // Aggiorna lo stato locale
      set((state) => ({
        environments: state.environments.map((env) => {
          if (env.id === update.environmentId) {
            return {
              ...env,
              parameters: {
                ...env.parameters,
                [update.parameterId]: {
                  ...env.parameters[update.parameterId as keyof typeof env.parameters],
                  thresholds: update.thresholds,
                },
              },
            }
          }
          return env
        }),
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  updateSensor: async (update: SensorUpdate) => {
    try {
      await apiService.updateSensor(update)
      // Aggiorna lo stato locale
      set((state) => ({
        environments: state.environments.map((env) => {
          if (env.id === update.environmentId) {
            const parameter = env.parameters[update.parameterId as keyof typeof env.parameters]
            return {
              ...env,
              parameters: {
                ...env.parameters,
                [update.parameterId]: {
                  ...parameter,
                  sensors: parameter.sensors.map((sensor) =>
                    sensor.id === update.sensorId ? { ...sensor, isActive: update.isActive } : sensor,
                  ),
                },
              },
            }
          }
          return env
        }),
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
