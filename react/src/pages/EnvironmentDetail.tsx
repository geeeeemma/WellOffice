import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEnvironmentStore } from "@/store/useEnvironmentStore"
import type { Environment } from "@/types/environment"
import { ParameterCard } from "@/components/ParameterCard"
import { HistoricalChart } from "@/components/HistoricalChart"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, RefreshCw, Calendar, MapPin } from "lucide-react"

export function EnvironmentDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const { environments, historicalData, fetchEnvironments, fetchHistoricalData, refreshEnvironment } =
    useEnvironmentStore()

  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [loading, setLoading] = useState(true)

  const environmentId = params.id as string

  useEffect(() => {
    const loadData = async () => {
      if (environments.length === 0) {
        await fetchEnvironments()
      }

      const env = environments.find((e) => e.id === environmentId)
      if (env) {
        setEnvironment(env)

        // Carica dati storici per tutti i parametri
        Object.keys(env.parameters).forEach((parameterId) => {
          fetchHistoricalData(environmentId, parameterId)
        })
      }
      setLoading(false)
    }

    loadData()
  }, [environmentId, environments, fetchEnvironments, fetchHistoricalData])

  const handleRefresh = async () => {
    if (environment) {
      await refreshEnvironment(environment.id)
      // Ricarica anche i dati storici
      Object.keys(environment.parameters).forEach((parameterId) => {
        fetchHistoricalData(environmentId, parameterId)
      })
    }
  }

  const handleParameterClick = (parameterId: string) => {
    navigate(`/environment/${environmentId}/parameter/${parameterId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!environment) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Ambiente non trovato</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const environmentTypeLabels = {
    office: "Ufficio",
    "meeting-room": "Sala Riunioni",
    "open-space": "Open Space",
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              {environment.name}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {environmentTypeLabels[environment.type]}
              </span>
              <span>{environment.area} m²</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(environment.lastUpdated).toLocaleString("it-IT")}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Aggiorna
        </Button>
      </div>

      {/* Parameters Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Parametri Attuali</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Object.values(environment.parameters).map((parameter) => (
            <ParameterCard
              key={parameter.id}
              parameter={parameter}
              onClick={() => handleParameterClick(parameter.id)}
            />
          ))}
        </div>
      </div>

      {/* Historical Charts */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Andamento Storico</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.values(environment.parameters).map((parameter) => {
            const dataKey = `${environmentId}-${parameter.id}`
            const data = historicalData[dataKey] || []

            return (
              <HistoricalChart
                key={parameter.id}
                data={data}
                title={parameter.name}
                unit={parameter.unit}
                color={
                  parameter.status === "critical"
                    ? "#ef4444"
                    : parameter.status === "borderline"
                      ? "#f59e0b"
                      : "#10b981"
                }
              />
            )
          })}
        </div>
      </div>
    </div>
    </div>
  )
} 