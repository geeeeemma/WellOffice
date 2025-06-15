import type { Environment, HistoricalData, Suggestion, ThresholdUpdate, SensorUpdate } from "@/types/environment"

import config from '../src/config/env'

const API_BASE_URL = config.apiUrl

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    console.log(`${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async getEnvironments(): Promise<Environment[]> {
    try {
      const response = await this.request<any>('/dashboard/environments')
      console.log('🔍 API Response data:', response)
      
      // Gestisce la struttura .NET con $values
      let environments: Environment[]
      
      if (response && response.$values && Array.isArray(response.$values)) {
        // Struttura .NET con ReferenceHandler.Preserve
        environments = response.$values.map((env: any) => ({
          id: env.id,
          name: env.name,
          type: env.type,
          area: env.area,
          parameters: env.parameters && env.parameters.$values ? env.parameters.$values.map((param: any) => ({
            id: param.id,
            name: param.name,
            value: param.value,
            unit: param.unit,
            status: param.status,
            thresholds: param.thresholds ? {
              optimal: param.thresholds.optimal,
              borderline: param.thresholds.borderline
            } : undefined,
            isActive: param.isActive,
            sensors: param.sensors && param.sensors.$values ? param.sensors.$values.map((sensor: any) => ({
              id: sensor.id,
              name: sensor.name,
              isActive: sensor.isActive
            })) : []
          })) : [],
          lastUpdated: env.lastUpdated
        }))
      } else if (Array.isArray(response)) {
        // Struttura normale array
        environments = response
      } else {
        throw new Error('Invalid API response structure')
      }
      
      console.log('✅ Parsed environments:', environments)
      return environments
    } catch (error) {
      console.error('❌ Error fetching environments:', error)
      throw error
    }
  }

  async getEnvironment(id: string): Promise<Environment> {
    try {
      const environments = await this.getEnvironments()
      const environment = environments.find((env) => env.id === id)
      if (!environment) {
        throw new Error(`Environment with id ${id} not found`)
      }
      return environment
    } catch (error) {
      console.error('Error fetching environment:', error)
      throw error
    }
  }

  async getHistoricalData(environmentId: string, parameterId: string, hours = 24): Promise<HistoricalData[]> {
    // Mock data per ora
    return Promise.resolve(generateMockHistoricalData(hours))
  }

  async updateThresholds(update: ThresholdUpdate): Promise<void> {
    // Mock implementation - sostituire con vera chiamata API
    console.log("Updating thresholds:", update)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  async updateSensor(update: SensorUpdate): Promise<void> {
    // Mock implementation - sostituire con vera chiamata API
    console.log("Updating sensor:", update)
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
}

// Mock data con sensori
const mockEnvironments: Environment[] = [
  {
    id: "office-1",
    name: "Ufficio Operativo",
    type: "office",
    area: 45,
    parameters: [
      {
        id: "occupancy",
        name: "Occupancy",
        value: 0.18,
        unit: "people/m²",
        status: "optimal",
        thresholds: { optimal: { min: 0.1, max: 0.2 }, borderline: { min: 0.05, max: 0.3 } },
        isActive: true,
        sensors: [
          { id: "occ-1", name: "Entrance Motion Sensor", isActive: true },
          { id: "occ-2", name: "Central Motion Sensor", isActive: true },
        ],
      },
      {
        id: "lighting",
        name: "Lighting",
        value: 520,
        unit: "lux",
        status: "optimal",
        thresholds: { optimal: { min: 500, max: 750 }, borderline: { min: 300, max: 1000 } },
        isActive: true,
        sensors: [
          { id: "light-1", name: "Window Light Meter", isActive: true },
          { id: "light-2", name: "Desk Light Meter", isActive: false },
        ],
      },
      {
        id: "temperature", 
        name: "Temperature",
        value: 22.5,
        unit: "°C",
        status: "optimal",
        thresholds: { optimal: { min: 20, max: 24 }, borderline: { min: 18, max: 26 } },
        isActive: true,
        sensors: [{ id: "temp-1", name: "Room Thermometer", isActive: true }],
      },
      {
        id: "noise",
        name: "Acoustics",
        value: 45,
        unit: "dB",
        status: "borderline",
        thresholds: { optimal: { min: 30, max: 50 }, borderline: { min: 25, max: 60 } },
        isActive: true,
        sensors: [{ id: "noise-1", name: "Central Sound Meter", isActive: true }],
      },
      {
        id: "humidity",
        name: "Humidity",
        value: 55,
        unit: "%",
        thresholds: { optimal: { min: 40, max: 60 }, borderline: { min: 30, max: 70 } },
        isActive: false,
        sensors: [{ id: "hum-1", name: "Wall Hygrometer", isActive: false }],
      },
      {
        id: "air_quality",
        name: "Air Quality",
        value: 42,
        unit: "IAQ",
        status: "optimal",
        thresholds: { optimal: { min: 0, max: 50 }, borderline: { min: 51, max: 100 } },
        isActive: true,
        sensors: [{ id: "air-1", name: "Air Quality Sensor", isActive: true }],
      },
      {
        id: "co2",
        name: "CO2",
        value: 420,
        unit: "ppm",
        status: "optimal",
        thresholds: { optimal: { min: 400, max: 800 }, borderline: { min: 350, max: 1000 } },
        isActive: true,
        sensors: [{ id: "co2-1", name: "CO2 Sensor", isActive: true }],
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "meeting-1",
    name: "Meeting Room",
    type: "meeting-room",
    area: 25,
    parameters: [
      {
        id: "occupancy",
        name: "Occupancy",
        value: 0.32,
        unit: "people/m²",
        status: "critical",
        thresholds: { optimal: { min: 0.1, max: 0.25 }, borderline: { min: 0.05, max: 0.35 } },
        isActive: true,
        sensors: [{ id: "occ-3", name: "Table Presence Sensor", isActive: true }],
      },
      {
        id: "lighting",
        name: "Lighting",
        value: 680,
        unit: "lux",
        status: "optimal",
        thresholds: { optimal: { min: 500, max: 750 }, borderline: { min: 300, max: 1000 } },
        isActive: true,
        sensors: [{ id: "light-3", name: "Ceiling Light Meter", isActive: true }],
      },
      {
        id: "temperature",
        name: "Temperature",
        value: 26.8,
        unit: "°C",
        status: "critical",
        thresholds: { optimal: { min: 20, max: 24 }, borderline: { min: 18, max: 26 } },
        isActive: true,
        sensors: [
          { id: "temp-2", name: "Wall Thermometer", isActive: true },
          { id: "temp-3", name: "Table Thermometer", isActive: true },
        ],
      },
      {
        id: "noise",
        name: "Acoustics",
        value: 58,
        unit: "dB",
        status: "borderline",
        thresholds: { optimal: { min: 30, max: 50 }, borderline: { min: 25, max: 60 } },
        isActive: true,
        sensors: [{ id: "noise-2", name: "Room Microphone", isActive: true }],
      },
      {
        id: "humidity",
        name: "Humidity",
        value: 48,
        unit: "%",
        status: "optimal",
        thresholds: { optimal: { min: 40, max: 60 }, borderline: { min: 30, max: 70 } },
        isActive: true,
        sensors: [{ id: "hum-2", name: "Digital Hygrometer", isActive: true }],
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "openspace-1",
    name: "Open Space",
    type: "open-space",
    area: 120,
    parameters: [
      {
        id: "occupancy",
        name: "Occupancy",
        value: 0.15,
        unit: "people/m²",
        status: "optimal",
        thresholds: { optimal: { min: 0.08, max: 0.18 }, borderline: { min: 0.05, max: 0.25 } },
        isActive: true,
        sensors: [
          { id: "occ-4", name: "Zone A Sensor", isActive: true },
          { id: "occ-5", name: "Zone B Sensor", isActive: true },
          { id: "occ-6", name: "Zone C Sensor", isActive: false },
        ],
      },
      {
        id: "lighting",
        name: "Lighting",
        value: 420,
        unit: "lux",
        status: "borderline",
        thresholds: { optimal: { min: 500, max: 750 }, borderline: { min: 300, max: 1000 } },
        isActive: true,
        sensors: [
          { id: "light-4", name: "North Light Meter", isActive: true },
          { id: "light-5", name: "South Light Meter", isActive: true },
        ],
      },
      {
        id: "temperature",
        name: "Temperature",
        value: 21.2,
        unit: "°C",
        status: "optimal",
        thresholds: { optimal: { min: 20, max: 24 }, borderline: { min: 18, max: 26 } },
        isActive: true,
        sensors: [
          { id: "temp-4", name: "Zone A Thermometer", isActive: true },
          { id: "temp-5", name: "Zone B Thermometer", isActive: true },
        ],
      },
      {
        id: "noise",
        name: "Acoustics",
        value: 62,
        unit: "dB",
        status: "critical",
        thresholds: { optimal: { min: 30, max: 50 }, borderline: { min: 25, max: 60 } },
        isActive: true,
        sensors: [{ id: "noise-3", name: "Central Sound Meter", isActive: true }],
      },
      {
        id: "humidity",
        name: "Umidità",
        value: 38,
        unit: "%",
        status: "borderline",
        thresholds: { optimal: { min: 40, max: 60 }, borderline: { min: 30, max: 70 } },
        isActive: true,
        sensors: [{ id: "hum-3", name: "Igrometro Wireless", isActive: true }],
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
]

function generateMockHistoricalData(hours: number): HistoricalData[] {
  const data: HistoricalData[] = []
  const now = new Date()

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const baseValue = 22 + Math.sin(i / 4) * 2
    const noise = (Math.random() - 0.5) * 1
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.round((baseValue + noise) * 10) / 10,
    })
  }

  return data
}

export const apiService = new ApiService()
