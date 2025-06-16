import type { Environment, EnvironmentParameter } from "./environment"

export interface AIAnalysisRequest {
  environment: Environment
  targetParameter: EnvironmentParameter
  historicalData: HistoricalData[]
  context: {
    timeOfDay: string
    dayOfWeek: string
    season: string
    weatherConditions?: string
    occupancyPattern?: string
  }
}

export interface AIGeneratedSuggestion {
  id: string
  title: string
  description: string
  action: string
  priority: 1 | 2 | 3 // 1 = critico, 2 = importante, 3 = raccomandato
  type: "immediate" | "short-term" | "long-term"
  estimatedImpact: "high" | "medium" | "low"
  implementationDifficulty: "easy" | "medium" | "hard"
  estimatedCost?: "low" | "medium" | "high"
  reasoning: string
  relatedParameters?: string[]
}

export interface AIAnalysisResponse {
  suggestions: AIGeneratedSuggestion[]
  overallAssessment: {
    status: "excellent" | "good" | "concerning" | "critical"
    summary: string
    keyInsights: string[]
  }
  predictiveAnalysis?: {
    trend: "improving" | "stable" | "declining"
    forecast: string
    recommendedMonitoring: string[]
  }
}

export interface AIServiceConfig {
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
}

export interface HistoricalData {
  timestamp: string
  value: number
}
