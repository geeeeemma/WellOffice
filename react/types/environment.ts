export interface Sensor {
  id: string
  name: string
  isActive: boolean
}

export interface EnvironmentParameter {
  id: string
  name: string
  value: number
  unit: string
  status?: "optimal" | "borderline" | "critical" // Opzionale per parametri inattivi
  thresholds: {
    optimal: { min: number; max: number }
    borderline: { min: number; max: number }
  }
  isActive: boolean
  sensors: Sensor[]
}

export interface Environment {
  id: string
  name: string
  type: "office" | "meeting-room" | "open-space"
  area: number // m²
  parameters: {
    occupancy: EnvironmentParameter
    lighting: EnvironmentParameter
    temperature: EnvironmentParameter
    noise: EnvironmentParameter
    humidity: EnvironmentParameter
  }
  lastUpdated: string
}

export interface HistoricalData {
  timestamp: string
  value: number
}

export interface Suggestion {
  id: string
  environmentId: string
  parameterId: string
  type: "warning" | "critical" | "info"
  title: string
  description: string
  action: string
  priority: number
}

export interface ThresholdUpdate {
  environmentId: string
  parameterId: string
  thresholds: {
    optimal: { min: number; max: number }
    borderline: { min: number; max: number }
  }
}

export interface SensorUpdate {
  environmentId: string
  parameterId: string
  sensorId: string
  isActive: boolean
}
