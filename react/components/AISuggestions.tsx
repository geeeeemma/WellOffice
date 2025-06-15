"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  Wrench,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAIService } from "@/services/aiService"
import type { Environment, EnvironmentParameter, HistoricalData } from "@/types/environment"
import type { AIGeneratedSuggestion } from "@/types/ai"

interface AISuggestionsProps {
  environment: Environment
  parameter: EnvironmentParameter
  historicalData: HistoricalData[]
}

const priorityColors = {
  1: "bg-red-500/20 text-red-700 border-red-300",
  2: "bg-yellow-500/20 text-yellow-700 border-yellow-300",
  3: "bg-blue-500/20 text-blue-700 border-blue-300",
}

const priorityLabels = {
  1: "Critical",
      2: "Important",
    3: "Recommended",
}

const typeIcons = {
  immediate: AlertTriangle,
  "short-term": Clock,
  "long-term": TrendingUp,
}

const impactColors = {
  high: "text-green-600",
  medium: "text-yellow-600",
  low: "text-gray-600",
}

const difficultyColors = {
  easy: "text-green-600",
  medium: "text-yellow-600",
  hard: "text-red-600",
}

export function AISuggestions({ environment, parameter, historicalData }: AISuggestionsProps) {
  const { generateSuggestions, loading, error } = useAIService()
  const [suggestions, setSuggestions] = useState<AIGeneratedSuggestion[]>([])
  const [overallAssessment, setOverallAssessment] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAISuggestions()
  }, [environment.id, parameter.id])

  const loadAISuggestions = async () => {
    const now = new Date()
    const context = {
          timeOfDay: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
      season: getSeason(now),
      occupancyPattern: getOccupancyPattern(now),
    }

    const analysisRequest = {
      environment,
      targetParameter: parameter,
      historicalData,
      context,
    }

    const response = await generateSuggestions(analysisRequest)
    if (response) {
      setSuggestions(response.suggestions)
      setOverallAssessment(response.overallAssessment)
    }
  }

  const getSeason = (date: Date): string => {
    const month = date.getMonth() + 1
          if (month >= 3 && month <= 5) return "spring"
      if (month >= 6 && month <= 8) return "summer"
    if (month >= 9 && month <= 11) return "autumn"
    return "winter"
  }

  const getOccupancyPattern = (date: Date): string => {
    const hour = date.getHours()
    if (hour >= 9 && hour <= 12) return "mattina-alta"
    if (hour >= 13 && hour <= 17) return "pomeriggio-alta"
    if (hour >= 18 && hour <= 20) return "sera-media"
    return "bassa"
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardContent className="p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
            <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
            <div>
              <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">AI is analyzing data...</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                                  Generating intelligent suggestions in progress
              </p>
            </div>
            <RefreshCw className="h-6 w-6 text-purple-600 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-3 text-red-800 dark:text-red-200">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Errore nell'analisi AI</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <Button
            onClick={loadAISuggestions}
            variant="outline"
            className="mt-4 border-red-300 text-red-700 hover:bg-red-100 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Riprova
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardContent className="p-4 sm:p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">Parameter Optimal!</h3>
          <p className="text-green-600 dark:text-green-400">
                          AI has not detected any issues requiring immediate intervention.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con Assessment Generale */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-lg sm:text-xl">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex-shrink-0">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="min-w-0 flex-1">Analisi AI per {parameter.name}</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0 text-xs sm:text-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              {suggestions.length} suggerimenti
            </Badge>
          </CardTitle>
        </CardHeader>

        {overallAssessment && (
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                className={`${
                  overallAssessment.status === "excellent"
                    ? "bg-green-500"
                    : overallAssessment.status === "good"
                      ? "bg-blue-500"
                      : overallAssessment.status === "concerning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                } text-white border-0 text-xs sm:text-sm`}
              >
                {overallAssessment.status === "excellent"
                                      ? "Excellent"
                  : overallAssessment.status === "good"
                                          ? "Good"
                    : overallAssessment.status === "concerning"
                                              ? "Monitor"
                      : "Critical"}
              </Badge>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{overallAssessment.summary}</p>

            {overallAssessment.keyInsights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 text-sm sm:text-base">Insights Chiave:</h4>
                <ul className="space-y-1">
                  {overallAssessment.keyInsights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Info className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Suggerimenti AI */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const TypeIcon = typeIcons[suggestion.type]

          return (
            <Card key={suggestion.id} className="border-0 shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl text-white flex-shrink-0">
                    <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{suggestion.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{suggestion.description}</p>
                      </div>

                      <Badge className={`${priorityColors[suggestion.priority]} text-xs sm:text-sm flex-shrink-0`}>
                        {priorityLabels[suggestion.priority]}
                      </Badge>
                    </div>

                    {/* Metadati del suggerimento */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 flex-shrink-0" />
                        <span className="text-gray-500">Impatto:</span>
                        <span className={impactColors[suggestion.estimatedImpact]}>
                          {suggestion.estimatedImpact === "high"
                            ? "Alto"
                            : suggestion.estimatedImpact === "medium"
                              ? "Medio"
                              : "Basso"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Wrench className="h-4 w-4 flex-shrink-0" />
                        <span className="text-gray-500">Difficulty:</span>
                        <span className={difficultyColors[suggestion.implementationDifficulty]}>
                          {suggestion.implementationDifficulty === "easy"
                            ? "Facile"
                            : suggestion.implementationDifficulty === "medium"
                              ? "Media"
                              : "Difficile"}
                        </span>
                      </div>

                      {suggestion.estimatedCost && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span className="text-gray-500">Costo:</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {suggestion.estimatedCost === "low"
                              ? "Basso"
                              : suggestion.estimatedCost === "medium"
                                ? "Medio"
                                : "Alto"}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Azione consigliata */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Azione Consigliata</p>
                          <p className="text-blue-700 dark:text-blue-200 text-sm">{suggestion.action}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ragionamento AI */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4 flex-shrink-0" />
                        Ragionamento AI
                      </h5>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{suggestion.reasoning}</p>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Bottone per rigenerare suggerimenti */}
      <div className="flex justify-center">
        <Button
          onClick={loadAISuggestions}
          variant="outline"
          className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950 w-full sm:w-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Rigenera Analisi AI</span>
          <span className="sm:hidden">Rigenera</span>
        </Button>
      </div>
    </div>
  )
}
