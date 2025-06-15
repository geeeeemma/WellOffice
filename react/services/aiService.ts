"use client"

import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import config from '../src/config/env'
import type { AIAnalysisRequest, AIAnalysisResponse, AIServiceConfig, HistoricalData } from "@/types/ai"
import { useState } from "react"

/**
 * WellOffice AI Service
 *
 * Questo servizio integra OpenAI per generare suggerimenti intelligenti
 * per il miglioramento del comfort ambientale negli spazi di lavoro.
 *
 * Funzionalità principali:
 * - Analisi completa dei parametri ambientali
 * - Generazione di suggerimenti personalizzati
 * - Analisi predittiva basata sui dati storici
 * - Valutazione dell'impatto e della fattibilità
 *
 * @example
 * \`\`\`typescript
 * const aiService = new AIService({
 *   apiKey: process.env.OPENAI_API_KEY!,
 *   model: "gpt-4",
 *   maxTokens: 2000,
 *   temperature: 0.3
 * })
 *
 * const suggestions = await aiService.generateSuggestions(analysisRequest)
 * \`\`\`
 */
class AIService {
  private config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    this.config = config
  }

  /**
   * Genera suggerimenti intelligenti per un parametro ambientale specifico
   *
   * @param request - Dati completi dell'ambiente e parametro da analizzare
   * @returns Promise<AIAnalysisResponse> - Suggerimenti e analisi generate dall'IA
   *
   * @throws {Error} Se la chiamata API fallisce o i dati sono insufficienti
   *
   * @example
   * \`\`\`typescript
   * const request: AIAnalysisRequest = {
   *   environment: environmentData,
   *   targetParameter: temperatureParameter,
   *   historicalData: last7DaysData,
   *   context: {
   *     timeOfDay: "14:30",
   *     dayOfWeek: "Tuesday",
   *     season: "summer"
   *   }
   * }
   *
   * const response = await aiService.generateSuggestions(request)
   * console.log(response.suggestions)
   * \`\`\`
   */
  async generateSuggestions(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      const prompt = this.buildAnalysisPrompt(request)
      
      // Crea l'istanza OpenAI con la chiave API
      const openai = createOpenAI({
        apiKey: this.config.apiKey,
      })

      const result = await generateObject({
        model: openai(this.config.model),
        maxTokens: this.config.maxTokens,
        temperature: this.config.temperature,
        schema: this.getResponseSchema(),
        prompt,
      })

      return result.object as AIAnalysisResponse
    } catch (error) {
      console.error("AI Service Error:", error)
      throw new Error(
        `Errore nella generazione dei suggerimenti: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
      )
    }
  }

  /**
   * Costruisce il prompt per l'analisi AI
   * Include tutti i dati necessari per un'analisi completa
   */
  private buildAnalysisPrompt(request: AIAnalysisRequest): string {
    const { environment, targetParameter, historicalData, context } = request

    // Calcola statistiche sui dati storici
    const stats = this.calculateHistoricalStats(historicalData)

    // Analizza gli altri parametri per correlazioni
    const otherParameters = Object.values(environment.parameters)
      .filter((p) => p.id !== targetParameter.id)
      .map((p) => `${p.name}: ${p.value} ${p.unit} (Status: ${p.status || "N/A"})`)
      .join(", ")

    return `
Sei un esperto consulente in comfort ambientale e qualità dell'aria negli spazi di lavoro.
Analizza i seguenti dati e genera suggerimenti specifici e attuabili.

## AMBIENTE ANALIZZATO
- Nome: ${environment.name}
- Tipo: ${environment.type}
- Area: ${environment.area} m²
- Ultimo aggiornamento: ${new Date(environment.lastUpdated).toLocaleString("it-IT")}

## PARAMETRO TARGET: ${targetParameter.name}
- Valore attuale: ${targetParameter.value} ${targetParameter.unit}
- Status: ${targetParameter.status || "N/A"}
    - Sensor active: ${targetParameter.isActive ? "Yes" : "No"}
- Soglia ottimale: ${targetParameter.thresholds.optimal.min}-${targetParameter.thresholds.optimal.max} ${targetParameter.unit}
- Soglia accettabile: ${targetParameter.thresholds.borderline.min}-${targetParameter.thresholds.borderline.max} ${targetParameter.unit}

## ALTRI PARAMETRI AMBIENTALI
${otherParameters}

## DATI STORICI (${historicalData.length} rilevazioni)
- Valore medio: ${stats.average.toFixed(2)} ${targetParameter.unit}
- Valore minimo: ${stats.min} ${targetParameter.unit}
- Valore massimo: ${stats.max} ${targetParameter.unit}
- Deviazione standard: ${stats.stdDev.toFixed(2)}
- Trend: ${stats.trend > 0 ? "In aumento" : stats.trend < 0 ? "In diminuzione" : "Stabile"}

## CONTESTO TEMPORALE
- Ora: ${context.timeOfDay}
- Giorno: ${context.dayOfWeek}
- Stagione: ${context.season}
${context.weatherConditions ? `- Condizioni meteo: ${context.weatherConditions}` : ""}
${context.occupancyPattern ? `- Pattern occupazione: ${context.occupancyPattern}` : ""}

## NORMATIVE DI RIFERIMENTO
Considera le seguenti normative per i tuoi suggerimenti:
- UNI EN ISO 7730 (Comfort termico)
- D.Lgs. 81/2008 (Sicurezza sul lavoro)
- UNI 10339 (Qualità dell'aria)
- Linee guida WHO per ambienti interni

## RICHIESTA
Genera suggerimenti specifici, pratici e prioritizzati per migliorare il parametro ${targetParameter.name}.
Considera l'impatto sugli altri parametri e la fattibilità di implementazione.
Fornisci ragionamenti dettagliati basati sui dati e sulle best practice.
`
  }

  /**
   * Calcola statistiche sui dati storici
   */
  private calculateHistoricalStats(data: HistoricalData[]) {
    if (data.length === 0) {
      return { average: 0, min: 0, max: 0, stdDev: 0, trend: 0 }
    }

    const values = data.map((d) => d.value)
    const average = values.reduce((sum, val) => sum + val, 0) / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    // Calcola deviazione standard
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    // Calcola trend (differenza tra prima e ultima metà dei dati)
    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length
    const trend = secondAvg - firstAvg

    return { average, min, max, stdDev, trend }
  }

  /**
   * Schema Zod per validare la risposta dell'IA
   */
  private getResponseSchema() {
    return z.object({
      suggestions: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          action: z.string(),
          priority: z.union([
            z.literal(1), z.literal(2), z.literal(3),
            z.literal("1"), z.literal("2"), z.literal("3")
          ]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
          type: z.enum(["immediate", "short-term", "long-term"]),
          estimatedImpact: z.enum(["high", "medium", "low"]),
          implementationDifficulty: z.enum(["easy", "medium", "hard"]),
          estimatedCost: z.enum(["low", "medium", "high"]).optional(),
          reasoning: z.string(),
          relatedParameters: z.array(z.string()).optional(),
        }),
      ),
      overallAssessment: z.object({
        status: z.enum(["excellent", "good", "concerning", "critical"]),
        summary: z.string(),
        keyInsights: z.array(z.string()),
      }),
      predictiveAnalysis: z
        .object({
          trend: z.enum(["improving", "stable", "declining"]),
          forecast: z.string(),
          recommendedMonitoring: z.array(z.string()),
        })
        .optional(),
    })
  }

  /**
   * Valida la configurazione del servizio
   */
  static validateConfig(config: Partial<AIServiceConfig>): AIServiceConfig {
    if (!config.apiKey) {
      throw new Error("API Key OpenAI richiesta")
    }

    return {
      apiKey: config.apiKey,
      model: config.model || "gpt-4",
      maxTokens: config.maxTokens || 2000,
      temperature: config.temperature || 0.3,
    }
  }
}

// Istanza singleton del servizio
let aiServiceInstance: AIService | null = null

/**
 * Factory function per ottenere l'istanza del servizio AI
 *
 * @param config - Configurazione opzionale (richiesta solo al primo utilizzo)
 * @returns AIService instance
 *
 * @example
 * \`\`\`typescript
 * // Prima inizializzazione
 * const aiService = getAIService({
 *   apiKey: process.env.OPENAI_API_KEY!
 * })
 *
 * // Utilizzi successivi
 * const aiService = getAIService()
 * \`\`\`
 */
export function getAIService(config?: Partial<AIServiceConfig>): AIService {
  if (!aiServiceInstance) {
    if (!config) {
      throw new Error("Configurazione richiesta per la prima inizializzazione del servizio AI")
    }

    const validatedConfig = AIService.validateConfig(config)
    aiServiceInstance = new AIService(validatedConfig)
  }

  return aiServiceInstance
}

/**
 * Hook per utilizzare il servizio AI nei componenti React
 *
 * @returns Oggetto con metodi per interagire con il servizio AI
 *
 * @example
 * \`\`\`typescript
 * function MyComponent() {
 *   const { generateSuggestions, loading, error } = useAIService()
 *
 *   const handleAnalyze = async () => {
 *     const suggestions = await generateSuggestions(analysisRequest)
 *     console.log(suggestions)
 *   }
 * }
 * \`\`\`
 */
export function useAIService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSuggestions = async (request: AIAnalysisRequest): Promise<AIAnalysisResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const aiService = getAIService({
        apiKey: config.openaiApiKey,
      })

      const response = await aiService.generateSuggestions(request)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Errore sconosciuto"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    generateSuggestions,
    loading,
    error,
  }
}

export default AIService
