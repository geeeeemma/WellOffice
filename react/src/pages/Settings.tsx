import { useEffect, useState } from "react"
import { useEnvironmentStore } from "@/store/useEnvironmentStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Sliders, Wifi, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api"
import type { ThresholdUpdate, SensorUpdate } from "@/types/environment"

export function Settings() {
  const { environments, fetchEnvironments } = useEnvironmentStore()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchEnvironments()
  }, [fetchEnvironments])

  const handleThresholdUpdate = async (
    environmentId: string,
    parameterId: string,
    field: "optimal" | "borderline",
    type: "min" | "max",
    value: number,
  ) => {
    setSaving(`${environmentId}-${parameterId}-threshold`)

    try {
      const environment = environments.find((env) => env.id === environmentId)
      if (!environment) return

      const parameter = environment.parameters[parameterId as keyof typeof environment.parameters]
      if (!parameter) return

      const newThresholds = {
        ...parameter.thresholds,
        [field]: {
          ...parameter.thresholds[field],
          [type]: value,
        },
      }

      const update: ThresholdUpdate = {
        environmentId,
        parameterId,
        thresholds: newThresholds,
      }

      await apiService.updateThresholds(update)

      toast({
                  title: "Thresholds Updated",
          description: `Thresholds for ${parameter.name} have been saved successfully.`,
      })

      // Refresh data
      await fetchEnvironments()
          } catch (error) {
        toast({
          title: "Error",
          description: "Unable to update thresholds. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const handleSensorToggle = async (
    environmentId: string,
    parameterId: string,
    sensorId: string,
    isActive: boolean,
  ) => {
    setSaving(`${environmentId}-${parameterId}-${sensorId}`)

    try {
      const update: SensorUpdate = {
        environmentId,
        parameterId,
        sensorId,
        isActive,
      }

      await apiService.updateSensor(update)

      toast({
                  title: "Sensor Updated",
        description: `Sensor has been ${isActive ? "activated" : "deactivated"} successfully.`,
      })

      // Refresh data
      await fetchEnvironments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to update sensor. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  if (loading && environments.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-600 to-gray-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />

          <div className="relative z-10 flex items-center gap-4">
            
            <div>
              <h1 className="text-4xl font-bold mb-2">Parameter Management</h1>
              <p className="text-gray-100 text-lg">Configure thresholds and sensors for each environment</p>
            </div>
          </div>
        </div>

        {/* Environments Tabs */}
        <Tabs defaultValue={environments[0]?.id} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            {environments.map((environment) => (
              <TabsTrigger key={environment.id} value={environment.id} className="font-medium">
                {environment.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {environments.map((environment) => (
            <TabsContent key={environment.id} value={environment.id} className="space-y-6">
              {Object.values(environment.parameters).map((parameter) => (
                <Card
                  key={parameter.id}
                  className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <Sliders className="h-5 w-5 text-white" />
                      </div>
                      {parameter.name}
                      <Badge variant={parameter.isActive ? "default" : "secondary"}>
                        {parameter.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Thresholds Configuration */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <Sliders className="h-4 w-4" />
                        Threshold Configuration
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Optimal Range */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-green-700 dark:text-green-400">
                            Range Ottimale ({parameter.unit})
                          </Label>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Label htmlFor={`${parameter.id}-opt-min`} className="text-xs text-muted-foreground">
                                Minimo
                              </Label>
                              <Input
                                id={`${parameter.id}-opt-min`}
                                type="number"
                                step="0.1"
                                defaultValue={parameter.thresholds.optimal.min}
                                onBlur={(e) =>
                                  handleThresholdUpdate(
                                    environment.id,
                                    parameter.id,
                                    "optimal",
                                    "min",
                                    Number.parseFloat(e.target.value),
                                  )
                                }
                                className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                              />
                            </div>
                            <span className="text-muted-foreground">-</span>
                            <div className="flex-1">
                              <Label htmlFor={`${parameter.id}-opt-max`} className="text-xs text-muted-foreground">
                                Massimo
                              </Label>
                              <Input
                                id={`${parameter.id}-opt-max`}
                                type="number"
                                step="0.1"
                                defaultValue={parameter.thresholds.optimal.max}
                                onBlur={(e) =>
                                  handleThresholdUpdate(
                                    environment.id,
                                    parameter.id,
                                    "optimal",
                                    "max",
                                    Number.parseFloat(e.target.value),
                                  )
                                }
                                className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Borderline Range */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                            Range Accettabile ({parameter.unit})
                          </Label>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Label htmlFor={`${parameter.id}-bor-min`} className="text-xs text-muted-foreground">
                                Minimo
                              </Label>
                              <Input
                                id={`${parameter.id}-bor-min`}
                                type="number"
                                step="0.1"
                                defaultValue={parameter.thresholds.borderline.min}
                                onBlur={(e) =>
                                  handleThresholdUpdate(
                                    environment.id,
                                    parameter.id,
                                    "borderline",
                                    "min",
                                    Number.parseFloat(e.target.value),
                                  )
                                }
                                className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                              />
                            </div>
                            <span className="text-muted-foreground">-</span>
                            <div className="flex-1">
                              <Label htmlFor={`${parameter.id}-bor-max`} className="text-xs text-muted-foreground">
                                Massimo
                              </Label>
                              <Input
                                id={`${parameter.id}-bor-max`}
                                type="number"
                                step="0.1"
                                defaultValue={parameter.thresholds.borderline.max}
                                onBlur={(e) =>
                                  handleThresholdUpdate(
                                    environment.id,
                                    parameter.id,
                                    "borderline",
                                    "max",
                                    Number.parseFloat(e.target.value),
                                  )
                                }
                                className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Sensors Configuration */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Sensori Associati ({parameter.sensors.length})
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parameter.sensors.map((sensor) => (
                          <Card
                            key={sensor.id}
                            className={`transition-all duration-200 ${
                              sensor.isActive
                                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                                : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      sensor.isActive
                                        ? "bg-green-500/20 text-green-600"
                                        : "bg-gray-500/20 text-gray-600"
                                    }`}
                                  >
                                    {sensor.isActive ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{sensor.name}</p>
                                    <p className="text-xs text-muted-foreground">ID: {sensor.id}</p>
                                  </div>
                                </div>
                                <Switch
                                  checked={sensor.isActive}
                                  onCheckedChange={(checked) =>
                                    handleSensorToggle(environment.id, parameter.id, sensor.id, checked)
                                  }
                                  disabled={saving === `${environment.id}-${parameter.id}-${sensor.id}`}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
