import { create } from "zustand"
import type { Environment, HistoricalData, ThresholdUpdate, SensorUpdate } from "@/types/environment"
import { apiService } from "@/services/api"

interface EnvironmentStore {
  environments: Environment[]
  historicalData: Record<string, HistoricalData[]>
  loading: boolean
  error: string | null

  // Actions
  fetchEnvironments: () => Promise<void>
  fetchHistoricalData: (environmentId: string, parameterId: string, hours?: number) => Promise<void>
  refreshEnvironment: (environmentId: string) => Promise<void>
  updateThresholds: (update: ThresholdUpdate) => Promise<void>
  updateSensor: (update: SensorUpdate) => Promise<void>
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  environments: [],
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
              parameters: env.parameters.map((param) =>
                param.id === update.parameterId
                  ? { ...param, thresholds: update.thresholds }
                  : param
              ),
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
            return {
              ...env,
              parameters: env.parameters.map((param) =>
                param.id === update.parameterId
                  ? {
                      ...param,
                      sensors: param.sensors.map((sensor) =>
                        sensor.id === update.sensorId
                          ? { ...sensor, isActive: update.isActive }
                          : sensor
                      ),
                    }
                  : param
              ),
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
