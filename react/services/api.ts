import type { Environment, HistoricalData, Suggestion, ThresholdUpdate, SensorUpdate } from "@/types/environment"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
    // Mock data per ora - sostituire con vera chiamata API
    return Promise.resolve(mockEnvironments)
  }

  async getEnvironment(id: string): Promise<Environment> {
    const environments = await this.getEnvironments()
    const environment = environments.find((env) => env.id === id)
    if (!environment) {
      throw new Error(`Environment with id ${id} not found`)
    }
    return environment
  }

  async getHistoricalData(environmentId: string, parameterId: string, hours = 24): Promise<HistoricalData[]> {
    // Mock data per ora
    return Promise.resolve(generateMockHistoricalData(hours))
  }

  async getSuggestions(): Promise<Suggestion[]> {
    // Mock data per ora
    return Promise.resolve(mockSuggestions)
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
    parameters: {
      occupancy: {
        id: "occupancy",
        name: "Popolosità",
        value: 0.18,
        unit: "persone/m²",
        status: "optimal",
        thresholds: { optimal: { min: 0.1, max: 0.2 }, borderline: { min: 0.05, max: 0.3 } },
        isActive: true,
        sensors: [
          { id: "occ-1", name: "Sensore Movimento Ingresso", isActive: true },
          { id: "occ-2", name: "Sensore Movimento Centrale", isActive: true },
        ],
      },
      lighting: {
        id: "lighting",
        name: "Luminosità",
        value: 520,
        unit: "lux",
        status: "optimal",
        thresholds: { optimal: { min: 500, max: 750 }, borderline: { min: 300, max: 1000 } },
        isActive: true,
        sensors: [
          { id: "light-1", name: "Luxmetro Finestra", isActive: true },
          { id: "light-2", name: "Luxmetro Scrivania", isActive: false },
        ],
      },
      temperature: {
        id: "temperature",
        name: "Temperatura",
        value: 22.5,
        unit: "°C",
        status: "optimal",
        thresholds: { optimal: { min: 20, max: 24 }, borderline: { min: 18, max: 26 } },
        isActive: true,
        sensors: [{ id: "temp-1", name: "Termometro Ambiente", isActive: true }],
      },
      noise: {
        id: "noise",
        name: "Acustica",
        value: 45,
        unit: "dB",
        status: "borderline",
        thresholds: { optimal: { min: 30, max: 50 }, borderline: { min: 25, max: 60 } },
        isActive: true,
        sensors: [{ id: "noise-1", name: "Fonometro Centrale", isActive: true }],
      },
      humidity: {
        id: "humidity",
        name: "Umidità",
        value: 55,
        unit: "%",
        thresholds: { optimal: { min: 40, max: 60 }, borderline: { min: 30, max: 70 } },
        isActive: false,
        sensors: [{ id: "hum-1", name: "Igrometro Parete", isActive: false }],
      },
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "meeting-1",
    name: "Sala Riunioni",
    type: "meeting-room",
    area: 25,
    parameters: {
      occupancy: {
        id: "occupancy",
        name: "Popolosità",
        value: 0.32,
        unit: "persone/m²",
        status: "critical",
        thresholds: { optimal: { min: 0.1, max: 0.25 }, borderline: { min: 0.05, max: 0.35 } },
        isActive: true,
        sensors: [{ id: "occ-3", name: "Sensore Presenza Tavolo", isActive: true }],
      },
      lighting: {
        id: "lighting",
        name: "Luminosità",
        value: 680,
        unit: "lux",
        status: "optimal",
        thresholds: { optimal: { min: 500, max: 750 }, borderline: { min: 300, max: 1000 } },
        isActive: true,
        sensors: [{ id: "light-3", name: "Luxmetro Soffitto", isActive: true }],
      },
      temperature: {
        id: "temperature",
        name: "Temperatura",
        value: 26.8,
        unit: "°C",
        status: "critical",
        thresholds: { optimal: { min: 20, max: 24 }, borderline: { min: 18, max: 26 } },
        isActive: true,
        sensors: [
          { id: "temp-2", name: "Termometro Parete", isActive: true },
          { id: "temp-3", name: "Termometro Tavolo", isActive: true },
        ],
      },
      noise: {
        id: "noise",
        name: "Acustica",
        value: 58,
        unit: "dB",
        status: "borderline",
        thresholds: { optimal: { min: 30, max: 50 }, borderline: { min: 25, max: 60 } },
        isActive: true,
        sensors: [{ id: "noise-2", name: "Microfono Ambiente", isActive: true }],
      },
      humidity: {
        id: "humidity",
        name: "Umidità",
        value: 48,
        unit: "%",
        status: "optimal",
        thresholds: { optimal: { min: 40, max: 60 }, borderline: { min: 30, max: 70 } },
        isActive: true,
        sensors: [{ id: "hum-2", name: "Igrometro Digitale", isActive: true }],
      },
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "openspace-1",
    name: "Open Space",
    type: "open-space",
    area: 120,
    parameters: {
      occupancy: {
        id: "occupancy",
        name: "Popolosità",
        value: 0.15,
        unit: "persone/m²",
        status: "optimal",
        thresholds: { optimal: { min: 0.08, max: 0.18 }, borderline: { min: 0.05, max: 0.25 } },
        isActive: true,
        sensors: [
          { id: "occ-4", name: "Sensore Zona A", isActive: true },
          { id: "occ-5", name: "Sensore Zona B", isActive: true },
          { id: "occ-6", name: "Sensore Zona C", isActive: false },
        ],
      },
      lighting: {
        id: "lighting",
        name: "Luminosità",
        value: 420,
        unit: "lux",
        status: "borderline",
        thresholds: { optimal: { min: 500, max: 750 }, borderline: { min: 300, max: 1000 } },
        isActive: true,
        sensors: [
          { id: "light-4", name: "Luxmetro Nord", isActive: true },
          { id: "light-5", name: "Luxmetro Sud", isActive: true },
        ],
      },
      temperature: {
        id: "temperature",
        name: "Temperatura",
        value: 21.2,
        unit: "°C",
        status: "optimal",
        thresholds: { optimal: { min: 20, max: 24 }, borderline: { min: 18, max: 26 } },
        isActive: true,
        sensors: [
          { id: "temp-4", name: "Termometro Zona A", isActive: true },
          { id: "temp-5", name: "Termometro Zona B", isActive: true },
        ],
      },
      noise: {
        id: "noise",
        name: "Acustica",
        value: 62,
        unit: "dB",
        status: "critical",
        thresholds: { optimal: { min: 30, max: 50 }, borderline: { min: 25, max: 60 } },
        isActive: true,
        sensors: [{ id: "noise-3", name: "Fonometro Centrale", isActive: true }],
      },
      humidity: {
        id: "humidity",
        name: "Umidità",
        value: 38,
        unit: "%",
        status: "borderline",
        thresholds: { optimal: { min: 40, max: 60 }, borderline: { min: 30, max: 70 } },
        isActive: true,
        sensors: [{ id: "hum-3", name: "Igrometro Wireless", isActive: true }],
      },
    },
    lastUpdated: new Date().toISOString(),
  },
]

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    environmentId: "meeting-1",
    parameterId: "occupancy",
    type: "critical",
    title: "Sovraffollamento Sala Riunioni",
    description: "La densità di occupazione supera i limiti raccomandati",
    action: "Ridurre il numero di partecipanti o utilizzare una sala più grande",
    priority: 1,
  },
  {
    id: "2",
    environmentId: "meeting-1",
    parameterId: "temperature",
    type: "critical",
    title: "Temperatura Elevata",
    description: "La temperatura è superiore ai valori di comfort",
    action: "Regolare il sistema di climatizzazione o migliorare la ventilazione",
    priority: 1,
  },
  {
    id: "3",
    environmentId: "openspace-1",
    parameterId: "noise",
    type: "warning",
    title: "Livello Acustico Alto",
    description: "Il rumore supera i livelli ottimali per la produttività",
    action: "Installare pannelli fonoassorbenti o creare zone silenziose",
    priority: 2,
  },
  {
    id: "4",
    environmentId: "openspace-1",
    parameterId: "lighting",
    type: "warning",
    title: "Illuminazione Insufficiente",
    description: "I livelli di luce sono sotto la soglia ottimale",
    action: "Aumentare l'illuminazione artificiale o migliorare quella naturale",
    priority: 2,
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
