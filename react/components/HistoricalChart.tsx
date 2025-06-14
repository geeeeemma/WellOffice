"use client"

import type { HistoricalData } from "@/types/environment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { it } from "date-fns/locale"

interface HistoricalChartProps {
  data: HistoricalData[]
  title: string
  unit: string
  color?: string
}

export function HistoricalChart({ data, title, unit, color = "#3b82f6" }: HistoricalChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp).getTime(),
    formattedTime: format(new Date(item.timestamp), "HH:mm", { locale: it }),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title} - Ultime 24 ore</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedTime" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: unit, angle: -90, position: "insideLeft" }} />
              <Tooltip
                labelFormatter={(value, payload) => {
                  if (payload && payload[0]) {
                    return format(new Date(payload[0].payload.timestamp), "dd/MM/yyyy HH:mm", { locale: it })
                  }
                  return value
                }}
                formatter={(value: number) => [`${value} ${unit}`, title]}
              />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
