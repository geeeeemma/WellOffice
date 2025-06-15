import type { Suggestion } from "@/types/environment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuggestionsPanelProps {
  suggestions: Suggestion[]
}

const suggestionIcons = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
}

const suggestionColors = {
  critical: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
}

const suggestionBadgeColors = {
  critical: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
}

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  const sortedSuggestions = [...suggestions].sort((a, b) => a.priority - b.priority)

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Suggerimenti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>All parameters are optimal!</p>
        <p className="text-sm">No suggestions at the moment.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
                      Suggestions ({suggestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedSuggestions.map((suggestion) => {
          const Icon = suggestionIcons[suggestion.type]

          return (
            <div
              key={suggestion.id}
              className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Icon className={cn("h-5 w-5 mt-0.5", suggestionColors[suggestion.type])} />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <Badge variant="outline" className={cn(suggestionBadgeColors[suggestion.type])}>
                    {suggestion.type === "critical" ? "Critical" : suggestion.type === "warning" ? "Warning" : "Info"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">💡 {suggestion.action}</p>
                  <Button variant="ghost" size="sm">
                    Dettagli
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
