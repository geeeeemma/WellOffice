"use client"

import type { EnvironmentParameter } from "@/types/environment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Sun, Thermometer, Volume2, Droplets, WifiOff, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ParameterCardProps {
  parameter: EnvironmentParameter
  onClick?: () => void
}

const parameterIcons = {
  occupancy: Users,
  lighting: Sun,
  temperature: Thermometer,
  noise: Volume2,
  humidity: Droplets,
}

const statusStyles = {
  optimal: {
    badge: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg",
    card: "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    glow: "shadow-green-200 dark:shadow-green-900",
  },
  borderline: {
    badge: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg",
    card: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 dark:border-yellow-800",
    icon: "text-yellow-600 dark:text-yellow-400",
    glow: "shadow-yellow-200 dark:shadow-yellow-900",
  },
  critical: {
    badge: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-lg animate-pulse",
    card: "border-red-200 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    glow: "shadow-red-200 dark:shadow-red-900",
  },
}

const statusLabels = {
  optimal: "Ottimale",
  borderline: "Attenzione",
  critical: "Critico",
}

export function ParameterCard({ parameter, onClick }: ParameterCardProps) {
  const Icon = parameterIcons[parameter.id as keyof typeof parameterIcons] || Users
  const isActive = parameter.isActive
  const status = parameter.status
  const styles = status ? statusStyles[status] : null

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl",
        isActive && status
          ? `${styles.card} ${styles.glow} shadow-lg`
          : "border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 opacity-75",
        "relative overflow-hidden group",
      )}
      onClick={onClick}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

      {/* Animated background for active critical parameters */}
      {isActive && status === "critical" && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 animate-pulse" />
      )}

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <div
            className={cn(
              "p-2 rounded-lg transition-all duration-300",
              isActive && status ? styles.icon : "text-gray-400",
              isActive && status ? "bg-white/50 dark:bg-black/20" : "bg-gray-100 dark:bg-gray-800",
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-gray-700 dark:text-gray-200">{parameter.name}</span>
          {!isActive && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
              <WifiOff className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Offline</span>
            </div>
          )}
        </CardTitle>
        {isActive && status && (
          <Badge className={cn(styles.badge, "font-medium px-3 py-1")}>{statusLabels[status]}</Badge>
        )}
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="space-y-3">
          <div className="text-3xl font-bold tracking-tight">
            {isActive ? (
              <div className="flex items-baseline gap-1">
                <span
                  className={cn(
                    "bg-gradient-to-r bg-clip-text text-transparent",
                    status === "critical"
                      ? "from-red-600 to-rose-600"
                      : status === "borderline"
                        ? "from-yellow-600 to-orange-600"
                        : "from-green-600 to-emerald-600",
                  )}
                >
                  {parameter.value}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{parameter.unit}</span>
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-600">--</span>
            )}
          </div>

          {isActive && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-green-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Range ottimale</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/20 rounded-lg px-3 py-2">
                {parameter.thresholds.optimal.min}-{parameter.thresholds.optimal.max} {parameter.unit}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
