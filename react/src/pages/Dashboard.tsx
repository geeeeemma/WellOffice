import { useEffect } from "react"
import { useEnvironmentStore } from "@/store/useEnvironmentStore"
import { EnvironmentPanel } from "@/components/EnvironmentPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"

export function Dashboard() {
  const { environments, loading, error, fetchEnvironments } = useEnvironmentStore()

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
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
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
    <div className="min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Colorful Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 p-4 sm:p-6 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">WellOffice Dashboard</h1>
              <p className="text-white/90 text-sm sm:text-base">Monitoraggio comfort ambientale in tempo reale</p>
            </div>
            <Button
              onClick={handleRefreshAll}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white border-0 w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Aggiorna Tutto
            </Button>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Ambienti Monitorati */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4 sm:p-6 shadow-lg border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-blue-100">Ambienti Monitorati</h3>
              <div className="p-2 bg-blue-600/30 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-800 dark:text-blue-200" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-100 mb-1">{environments.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-300">Spazi di lavoro attivi</p>
          </div>

          {/* Parametri Ottimali */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-4 sm:p-6 shadow-lg border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-green-800 dark:text-green-100">Parametri Ottimali</h3>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-100 mb-1">{totalOptimal}</div>
            <p className="text-xs text-green-600 dark:text-green-300">Valori nella norma</p>
          </div>

          {/* Attenzioni */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-xl p-4 sm:p-6 shadow-lg border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-100">Attenzioni</h3>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-800 dark:text-yellow-100 mb-1">{totalWarning}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-300">Richiedono monitoraggio</p>
          </div>

          {/* Critici */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl p-4 sm:p-6 shadow-lg border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-red-800 dark:text-red-100">Critici</h3>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-red-800 dark:text-red-100 mb-1">{totalCritical}</div>
            <p className="text-xs text-red-600 dark:text-red-300">Intervento immediato</p>
          </div>
        </div>

        {/* Environments Section */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
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
