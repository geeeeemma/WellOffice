"use client"

import { useEffect } from "react"
import { useEnvironmentStore } from "@/store/useEnvironmentStore"
import { EnvironmentPanel } from "@/components/EnvironmentPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"

export default function Dashboard() {
  const { environments, suggestions, loading, error, fetchEnvironments } = useEnvironmentStore()

  useEffect(() => {
    fetchEnvironments()
  }, [fetchEnvironments])

  const handleRefreshAll = async () => {
    await Promise.all([fetchEnvironments()])
  }

  const totalCritical = environments.reduce(
    (acc, env) => acc + Object.values(env.parameters).filter((p) => p.status === "critical").length,
    0,
  )

  const totalWarning = environments.reduce(
    (acc, env) => acc + Object.values(env.parameters).filter((p) => p.status === "borderline").length,
    0,
  )

  const totalOptimal = environments.reduce(
    (acc, env) => acc + Object.values(env.parameters).filter((p) => p.status === "optimal").length,
    0,
  )

  if (loading && environments.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-5 w-5" />
              <p>Errore nel caricamento dei dati: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                WellOffice Dashboard
              </h1>
              <p className="text-blue-100 text-lg">Monitoraggio comfort ambientale in tempo reale</p>
            </div>
            <Button
              onClick={handleRefreshAll}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-6 py-3"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
              Aggiorna Tutto
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Ambienti Monitorati
              </CardTitle>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{environments.length}</div>
              <p className="text-xs text-gray-500 mt-1">Spazi di lavoro attivi</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Parametri Ottimali
              </CardTitle>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalOptimal}</div>
              <p className="text-xs text-gray-500 mt-1">Valori nella norma</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-950 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-10 translate-x-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Attenzioni</CardTitle>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{totalWarning}</div>
              <p className="text-xs text-gray-500 mt-1">Richiedono monitoraggio</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-950 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -translate-y-10 translate-x-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Critici</CardTitle>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{totalCritical}</div>
              <p className="text-xs text-gray-500 mt-1">Intervento immediato</p>
            </CardContent>
          </Card>
        </div>

        {/* Environments Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Ambienti Monitorati
            </h2>
          </div>
          {environments.map((environment) => (
            <EnvironmentPanel key={environment.id} environment={environment} />
          ))}
        </div>
      </div>
    </div>
  )
}
