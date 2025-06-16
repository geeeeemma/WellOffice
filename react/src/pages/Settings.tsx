import { useEffect, useState } from "react"
import { useEnvironmentStore } from "@/store/useEnvironmentStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Sliders, Wifi, WifiOff, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WellOfficeApiClient, Sensor, Threshold } from "../services/generated/api-client"
import config from "../config/env"
import { Button } from "@/components/ui/button"

const apiClient = new WellOfficeApiClient(config.apiUrl)

export function Settings() {
  const { environments, fetchEnvironments } = useEnvironmentStore()
  const [saving, setSaving] = useState<string | null>(null)
  const [thresholdValues, setThresholdValues] = useState<Record<string, {
    optimal: { min: number; max: number };
    borderline: { min: number; max: number };
  }>>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchEnvironments()
  }, [fetchEnvironments])

  // Initialize threshold values when environments are loaded
  useEffect(() => {
    const newThresholdValues: Record<string, {
      optimal: { min: number; max: number };
      borderline: { min: number; max: number };
    }> = {}
    
    environments.forEach(environment => {
      Object.values(environment.parameters).forEach(parameter => {
        if (parameter.thresholds) {
          newThresholdValues[parameter.id] = {
            optimal: {
              min: parameter.thresholds.optimal.min,
              max: parameter.thresholds.optimal.max
            },
            borderline: {
              min: parameter.thresholds.borderline.min,
              max: parameter.thresholds.borderline.max
            }
          }
        }
      })
    })
    
    setThresholdValues(newThresholdValues)
  }, [environments])

  const handleThresholdValueChange = (
    parameterId: string,
    field: "optimal" | "borderline",
    type: "min" | "max",
    value: number
  ) => {
    setThresholdValues(prev => ({
      ...prev,
      [parameterId]: {
        ...prev[parameterId],
        [field]: {
          ...prev[parameterId][field],
          [type]: value
        }
      }
    }))
  }

  const handleThresholdSave = async (parameterId: string) => {
    try {
      setSaving(parameterId)

      // Get the current threshold data
      const thresholdData = await apiClient.thresholdGET(parameterId)
      if (!thresholdData) {
        throw new Error("Threshold not found")
      }

      const values = thresholdValues[parameterId]
      if (!values) {
        throw new Error("No threshold values to save")
      }

      // Create a new Threshold instance with the updated data
      const updatedThreshold = new Threshold({
        ...thresholdData,
        optimalMinValue: values.optimal.min,
        optimalMaxValue: values.optimal.max,
        acceptableMinValue: values.borderline.min,
        acceptableMaxValue: values.borderline.max,
      })

      // Update the threshold
      await apiClient.thresholdPUT(parameterId, updatedThreshold)

      toast({
        title: "Thresholds Updated",
        description: "Thresholds have been saved successfully.",
      })

      // Refresh data
      await fetchEnvironments()
    } catch (error) {
      console.error("Error updating thresholds:", error)
      toast({
        title: "Error",
        description: "Failed to update thresholds. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const handleSensorToggle = async (
    sensorId: string,
    isActive: boolean,
  ) => {
    try {
      setSaving(sensorId)
      
      // Get the current sensor data
      const sensorData = await apiClient.sensorGET(sensorId)
      if (!sensorData) {
        throw new Error("Sensor not found")
      }

      // Create a new Sensor instance with the updated data
      const updatedSensor = new Sensor({
        ...sensorData,
        isActive
      })

      // Update the sensor with the new isActive status
      await apiClient.sensorPUT(sensorId, updatedSensor)

      toast({
        title: "Sensor Updated",
        description: `Sensor ${sensorData.name} has been ${isActive ? "activated" : "deactivated"}.`,
      })

      // Refresh data
      await fetchEnvironments()
    } catch (error) {
      console.error("Error updating sensor:", error)
      toast({
        title: "Error",
        description: "Failed to update sensor status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  if (environments.length === 0) {
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
                    <Tabs defaultValue="thresholds">
                      <TabsList>
                        <TabsTrigger value="thresholds" className="flex items-center gap-2">
                          <Sliders className="h-4 w-4" />
                          Soglie
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="thresholds" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{parameter.name}</h3>
                          <Button
                            onClick={() => handleThresholdSave(parameter.id)}
                            disabled={saving === parameter.id}
                            className="flex items-center gap-2"
                          >
                            {saving === parameter.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            Salva Soglie
                          </Button>
                        </div>

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
                                  value={thresholdValues[parameter.id]?.optimal.min ?? parameter.thresholds.optimal.min}
                                  onChange={(e) =>
                                    handleThresholdValueChange(
                                      parameter.id,
                                      "optimal",
                                      "min",
                                      Number.parseFloat(e.target.value)
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
                                  value={thresholdValues[parameter.id]?.optimal.max ?? parameter.thresholds.optimal.max}
                                  onChange={(e) =>
                                    handleThresholdValueChange(
                                      parameter.id,
                                      "optimal",
                                      "max",
                                      Number.parseFloat(e.target.value)
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
                                  value={thresholdValues[parameter.id]?.borderline.min ?? parameter.thresholds.borderline.min}
                                  onChange={(e) =>
                                    handleThresholdValueChange(
                                      parameter.id,
                                      "borderline",
                                      "min",
                                      Number.parseFloat(e.target.value)
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
                                  value={thresholdValues[parameter.id]?.borderline.max ?? parameter.thresholds.borderline.max}
                                  onChange={(e) =>
                                    handleThresholdValueChange(
                                      parameter.id,
                                      "borderline",
                                      "max",
                                      Number.parseFloat(e.target.value)
                                    )
                                  }
                                  className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

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
                                    handleSensorToggle(sensor.id, checked )
                                  }
                                  disabled={saving === sensor.id}
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
