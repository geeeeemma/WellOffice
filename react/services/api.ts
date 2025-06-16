import type { Environment, HistoricalData, ThresholdUpdate, SensorUpdate } from "@/types/environment"
import { WellOfficeApiClient } from '../src/services/generated/api-client'

import config from '../src/config/env'

const API_BASE_URL = config.apiUrl

class ApiService {
  private apiClient: WellOfficeApiClient

  constructor() {
    this.apiClient = new WellOfficeApiClient(API_BASE_URL)
  }
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
    try {
      console.log(`🔍 Fetching historical data for environment ${environmentId}, parameter ${parameterId}, hours ${hours}`)
      
      const response = await this.apiClient.historical(environmentId, parameterId, hours)
      
      console.log('✅ Historical data response:', response)
      
      // Converte dal formato DTO al formato atteso dal frontend
      const historicalData: HistoricalData[] = response.map(item => ({
        timestamp: item.timestamp || '',
        value: item.value || 0
      }))
      
      return historicalData
    } catch (error) {
      console.error('❌ Error fetching historical data:', error)
      // Fallback ai dati mock in caso di errore
      console.log('📊 Using mock data as fallback')
      return generateMockHistoricalData(hours)
    }
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
