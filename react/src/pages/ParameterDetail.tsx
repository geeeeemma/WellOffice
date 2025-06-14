import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEnvironmentStore } from "@/store/useEnvironmentStore"
import type { Environment, EnvironmentParameter } from "@/types/environment"
import { HistoricalChart } from "@/components/HistoricalChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AISuggestions } from "@/components/AISuggestions"

export function ParameterDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const { environments, historicalData, suggestions, fetchEnvironments, fetchHistoricalData, fetchSuggestions } =
    useEnvironmentStore()

  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [parameter, setParameter] = useState<EnvironmentParameter | null>(null)
  const [loading, setLoading] = useState(true)
  const [applyingSuggestion, setApplyingSuggestion] = useState<string | null>(null)
  const { toast } = useToast()

  const environmentId = params.id as string
  const parameterId = params.parameterId as string

  useEffect(() => {
    const loadData = async () => {
      if (environments.length === 0) {
        await fetchEnvironments()
      }

      // Carica anche i suggerimenti
      await fetchSuggestions()

      const env = environments.find((e) => e.id === environmentId)
      if (env) {
        setEnvironment(env)
        const param = env.parameters[parameterId as keyof typeof env.parameters]
        if (param) {
          setParameter(param)
          await fetchHistoricalData(environmentId, parameterId, 168) // 7 giorni
        }
      }
      setLoading(false)
    }

    loadData()
  }, [environmentId, parameterId, environments, fetchEnvironments, fetchHistoricalData, fetchSuggestions])

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!environment || !parameter) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Parametro non trovato</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dataKey = `${environmentId}-${parameterId}`
  const data = historicalData[dataKey] || []

  // Calcola trend
  const trend = data.length >= 2 ? data[data.length - 1].value - data[data.length - 2].value : 0

  const parameterSuggestions = suggestions.filter(
    (s) => s.environmentId === environmentId && s.parameterId === parameterId,
  )

  const statusColors = {
    optimal: "bg-green-100 text-green-800 border-green-200",
    borderline: "bg-yellow-100 text-yellow-800 border-yellow-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  const statusLabels = {
    optimal: "Ottimale",
    borderline: "Attenzione",
    critical: "Critico",
  }

  const handleApplySuggestion = async (suggestionId: string, suggestionTitle: string) => {
    setApplyingSuggestion(suggestionId)

    // Simula l'applicazione del suggerimento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Suggerimento Applicato!",
      description: `"${suggestionTitle}" è stato applicato con successo.`,
      duration: 4000,
    })

    setApplyingSuggestion(null)
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Indietro</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">{parameter.name}</h1>
              <p className="text-muted-foreground text-sm sm:text-base truncate">
                {environment.name} • {parameter.unit}
              </p>
            </div>
          </div>
          <Button onClick={() => fetchHistoricalData(environmentId, parameterId, 168)} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
        </div>

        {/* Current Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Valore Attuale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                {parameter.isActive ? (
                  <>
                    {parameter.value}
                    <span className="text-lg font-normal text-muted-foreground ml-1">{parameter.unit}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Sensore offline</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                <Badge variant="outline" className={statusColors[parameter.status || "optimal"]}>
                  {statusLabels[parameter.status || "optimal"]}
                </Badge>
                {trend !== 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    {trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : trend < 0 ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={trend > 0 ? "text-red-500" : "text-green-500"}>
                      {Math.abs(trend).toFixed(1)} {parameter.unit}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Range Ottimale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {parameter.thresholds.optimal.min} - {parameter.thresholds.optimal.max}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{parameter.unit}</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Range Accettabile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {parameter.thresholds.borderline.min} - {parameter.thresholds.borderline.max}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{parameter.unit}</p>
            </CardContent>
          </Card>
        </div>

        {/* Historical Chart */}
        <HistoricalChart
          data={data}
          title={`${parameter.name} - Ultimi 7 giorni`}
          unit={parameter.unit}
          color={parameter.status === "critical" ? "#ef4444" : parameter.status === "borderline" ? "#f59e0b" : "#10b981"}
        />

        {/* AI-Generated Suggestions */}
        <AISuggestions environment={environment} parameter={parameter} historicalData={data} />
      </div>
    </div>
  )
} 