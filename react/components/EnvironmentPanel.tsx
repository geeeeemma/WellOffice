"use client"

import type { Environment } from "@/types/environment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParameterCard } from "./ParameterCard"
import { Building2, RefreshCw, ExternalLink, MapPin, Calendar, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEnvironmentStore } from "@/store/useEnvironmentStore"

interface EnvironmentPanelProps {
  environment: Environment
}

const environmentTypeLabels = {
  office: "Ufficio",
  "meeting-room": "Sala Riunioni",
  "open-space": "Open Space",
}

export function EnvironmentPanel({ environment }: EnvironmentPanelProps) {
  const router = useRouter()
  const { refreshEnvironment } = useEnvironmentStore()

  const handleParameterClick = (parameterId: string) => {
    router.push(`/environment/${environment.id}/parameter/${parameterId}`)
  }

  const handleRefresh = async () => {
    await refreshEnvironment(environment.id)
  }

  const activeParameters = Object.values(environment.parameters).filter((p) => p.isActive)
  const criticalCount = activeParameters.filter((p) => p.status === "critical").length
  const warningCount = activeParameters.filter((p) => p.status === "borderline").length
  const optimalCount = activeParameters.filter((p) => p.status === "optimal").length

  return (
    <Card className="w-full overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header neutro con gradiente grigio */}
      <div className="bg-gradient-to-r from-slate-600 to-gray-700 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

        <CardHeader className="p-0 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-1">{environment.name}</CardTitle>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {environmentTypeLabels[environment.type]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    {environment.area} m²
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(environment.lastUpdated).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {new Date(environment.lastUpdated).toLocaleTimeString("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Status badges */}
              <div className="flex gap-2">
                {optimalCount > 0 && (
                  <Badge className="bg-green-500/20 text-green-100 border-green-400/30 backdrop-blur-sm">
                    {optimalCount} Ottimali
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 backdrop-blur-sm">
                    {warningCount} Attenzione
                  </Badge>
                )}
                {criticalCount > 0 && (
                  <Badge className="bg-red-500/20 text-red-100 border-red-400/30 backdrop-blur-sm animate-pulse">
                    {criticalCount} Critici
                  </Badge>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRefresh}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(`/environment/${environment.id}`)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </div>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {Object.values(environment.parameters).map((parameter) => (
            <ParameterCard
              key={parameter.id}
              parameter={parameter}
              onClick={() => handleParameterClick(parameter.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
