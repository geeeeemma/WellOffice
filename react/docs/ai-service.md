# WellOffice AI Service Documentation

## Panoramica

Il servizio AI di WellOffice integra OpenAI GPT-4 per generare suggerimenti intelligenti e personalizzati per il miglioramento del comfort ambientale negli spazi di lavoro.

## Caratteristiche Principali

### 🧠 Analisi Intelligente
- **Analisi multi-parametrica**: Considera tutti i parametri ambientali simultaneamente
- **Correlazioni automatiche**: Identifica relazioni tra diversi parametri
- **Analisi temporale**: Valuta trend e pattern nei dati storici
- **Contesto ambientale**: Considera ora, giorno, stagione e condizioni esterne

### 📊 Suggerimenti Avanzati
- **Prioritizzazione automatica**: Critico, Importante, Raccomandato
- **Classificazione temporale**: Immediato, Breve termine, Lungo termine
- **Valutazione impatto**: Alto, Medio, Basso
- **Stima difficoltà**: Facile, Media, Difficile
- **Analisi costi**: Basso, Medio, Alto

### 🔬 Conformità Normativa
- **UNI EN ISO 7730**: Standard per il comfort termico
- **D.Lgs. 81/2008**: Normative sicurezza sul lavoro
- **UNI 10339**: Qualità dell'aria negli ambienti interni
- **Linee guida WHO**: Raccomandazioni per ambienti interni salubri

## Configurazione

### Variabili d'Ambiente

\`\`\`bash
# .env.local
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### Inizializzazione

\`\`\`typescript
import { getAIService } from '@/services/aiService'

const aiService = getAIService({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  model: "gpt-4", // o "gpt-3.5-turbo" per costi ridotti
  maxTokens: 2000,
  temperature: 0.3 // Bassa per risposte più deterministiche
})
\`\`\`

## Utilizzo

### Hook React (Raccomandato)

\`\`\`typescript
import { useAIService } from '@/services/aiService'

function ParameterAnalysis({ environment, parameter, historicalData }) {
  const { generateSuggestions, loading, error } = useAIService()
  
  const analyzeParmeter = async () => {
    const request = {
      environment,
      targetParameter: parameter,
      historicalData,
      context: {
        timeOfDay: "14:30",
        dayOfWeek: "Tuesday", 
        season: "summer",
        occupancyPattern: "high"
      }
    }
    
    const response = await generateSuggestions(request)
    if (response) {
      console.log('Suggerimenti:', response.suggestions)
      console.log('Assessment:', response.overallAssessment)
    }
  }
  
  return (
    <div>
      <button onClick={analyzeParmeter} disabled={loading}>
        {loading ? 'Analizzando...' : 'Genera Suggerimenti AI'}
      </button>
      {error && <p>Errore: {error}</p>}
    </div>
  )
}
\`\`\`

### Servizio Diretto

\`\`\`typescript
import { getAIService } from '@/services/aiService'

async function analyzeEnvironment() {
  const aiService = getAIService()
  
  const analysisRequest = {
    environment: environmentData,
    targetParameter: temperatureParameter,
    historicalData: weeklyData,
    context: {
      timeOfDay: new Date().toLocaleTimeString(),
      dayOfWeek: new Date().toLocaleDateString('it-IT', { weekday: 'long' }),
      season: getCurrentSeason(),
      weatherConditions: "sunny",
      occupancyPattern: "peak-hours"
    }
  }
  
  try {
    const response = await aiService.generateSuggestions(analysisRequest)
    return response
  } catch (error) {
    console.error('Errore analisi AI:', error)
    return null
  }
}
\`\`\`

## Struttura Dati

### Request (AIAnalysisRequest)

\`\`\`typescript
interface AIAnalysisRequest {
  environment: Environment        // Dati completi ambiente
  targetParameter: EnvironmentParameter  // Parametro da analizzare
  historicalData: HistoricalData[]       // Dati storici (7-30 giorni)
  context: {
    timeOfDay: string            // "14:30"
    dayOfWeek: string           // "Tuesday"
    season: string              // "summer"
    weatherConditions?: string   // "sunny", "rainy", etc.
    occupancyPattern?: string    // "peak", "low", "medium"
  }
}
\`\`\`

### Response (AIAnalysisResponse)

\`\`\`typescript
interface AIAnalysisResponse {
  suggestions: AIGeneratedSuggestion[]
  overallAssessment: {
    status: "excellent" | "good" | "concerning" | "critical"
    summary: string
    keyInsights: string[]
  }
  predictiveAnalysis?: {
    trend: "improving" | "stable" | "declining"
    forecast: string
    recommendedMonitoring: string[]
  }
}
\`\`\`

### Suggerimento AI (AIGeneratedSuggestion)

\`\`\`typescript
interface AIGeneratedSuggestion {
  id: string
  title: string                    // "Regolare temperatura HVAC"
  description: string              // Descrizione dettagliata
  action: string                   // Azione specifica da intraprendere
  priority: 1 | 2 | 3             // 1=Critico, 2=Importante, 3=Raccomandato
  type: "immediate" | "short-term" | "long-term"
  estimatedImpact: "high" | "medium" | "low"
  implementationDifficulty: "easy" | "medium" | "hard"
  estimatedCost?: "low" | "medium" | "high"
  reasoning: string                // Spiegazione del ragionamento AI
  relatedParameters?: string[]     // Altri parametri correlati
}
\`\`\`

## Esempi di Utilizzo

### Analisi Temperatura Critica

\`\`\`typescript
const criticalTemperatureAnalysis = {
  environment: {
    id: "meeting-room-1",
    name: "Sala Riunioni A",
    type: "meeting-room",
    area: 25,
    parameters: {
      temperature: {
        value: 28.5,
        status: "critical",
        thresholds: { optimal: { min: 20, max: 24 } }
      },
      humidity: { value: 65, status: "borderline" },
      // ... altri parametri
    }
  },
  targetParameter: temperatureParameter,
  historicalData: last7DaysTemperatureData,
  context: {
    timeOfDay: "15:30",
    dayOfWeek: "Wednesday",
    season: "summer",
    weatherConditions: "very-hot",
    occupancyPattern: "meeting-in-progress"
  }
}
\`\`\`

**Esempio di risposta AI:**

\`\`\`json
{
  "suggestions": [
    {
      "id": "temp-001",
      "title": "Intervento Immediato Sistema HVAC",
      "description": "La temperatura di 28.5°C supera significativamente la soglia ottimale durante una riunione attiva",
      "action": "Abbassare il setpoint del condizionatore a 22°C e aumentare la velocità ventilazione",
      "priority": 1,
      "type": "immediate",
      "estimatedImpact": "high",
      "implementationDifficulty": "easy",
      "estimatedCost": "low",
      "reasoning": "L'alta temperatura combinata con l'occupazione attiva può causare disagio significativo e ridurre la produttività. L'intervento è semplice e immediato.",
      "relatedParameters": ["humidity", "occupancy"]
    }
  ],
  "overallAssessment": {
    "status": "critical",
    "summary": "Situazione critica che richiede intervento immediato per garantire il comfort dei partecipanti alla riunione",
    "keyInsights": [
      "Temperatura 4.5°C sopra la soglia ottimale",
      "Correlazione con alta umidità (65%)",
      "Impatto diretto su produttività riunione"
    ]
  }
}
\`\`\`

## Best Practices

### 1. Gestione Errori

\`\`\`typescript
const { generateSuggestions, loading, error } = useAIService()

// Sempre gestire gli stati di errore
if (error) {
  return <ErrorComponent message={error} onRetry={retryAnalysis} />
}
\`\`\`

### 2. Caching e Performance

\`\`\`typescript
// Cache dei risultati per evitare chiamate ripetute
const cacheKey = `ai-analysis-${environmentId}-${parameterId}-${date}`
const cachedResult = localStorage.getItem(cacheKey)

if (cachedResult && !forceRefresh) {
  return JSON.parse(cachedResult)
}
\`\`\`

### 3. Fallback per Servizio Non Disponibile

\`\`\`typescript
// Fallback ai suggerimenti statici se AI non disponibile
const suggestions = aiSuggestions || getStaticSuggestions(parameter)
\`\`\`

### 4. Monitoraggio Costi

\`\`\`typescript
// Traccia utilizzo API per controllo costi
const trackAPIUsage = (request: AIAnalysisRequest) => {
  analytics.track('ai_analysis_request', {
    environment_type: request.environment.type,
    parameter: request.targetParameter.id,
    data_points: request.historicalData.length
  })
}
\`\`\`

## Limitazioni e Considerazioni

### Costi API
- **GPT-4**: ~$0.03 per 1K token (più costoso ma più accurato)
- **GPT-3.5-turbo**: ~$0.002 per 1K token (più economico)
- Stima: 1500-2000 token per analisi completa

### Rate Limits
- OpenAI: 3 RPM per GPT-4, 3500 RPM per GPT-3.5-turbo
- Implementare retry logic e queue per richieste multiple

### Qualità Dati
- Minimo 24 ore di dati storici per analisi significativa
- Dati mancanti o inconsistenti possono influenzare la qualità

### Privacy e Sicurezza
- I dati vengono inviati a OpenAI (considerare implicazioni privacy)
- Non includere informazioni sensibili nei prompt
- Implementare audit log per tracciabilità

## Troubleshooting

### Errori Comuni

1. **"API Key richiesta"**
   - Verificare che `NEXT_PUBLIC_OPENAI_API_KEY` sia configurata

2. **"Rate limit exceeded"**
   - Implementare retry con backoff exponential
   - Considerare upgrade piano OpenAI

3. **"Insufficient data"**
   - Assicurarsi di avere almeno 24 ore di dati storici
   - Verificare che i dati non siano null/undefined

4. **"Model not available"**
   - Verificare che il modello specificato sia accessibile
   - Fallback a gpt-3.5-turbo se gpt-4 non disponibile

### Debug

\`\`\`typescript
// Abilita logging dettagliato
const aiService = getAIService({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  debug: true // Abilita logging prompt e risposte
})
\`\`\`

## Roadmap

### Prossime Funzionalità
- [ ] **Analisi predittiva avanzata**: Previsioni a 7-30 giorni
- [ ] **Suggerimenti automatici**: Applicazione automatica per situazioni critiche
- [ ] **Learning personalizzato**: Adattamento basato su feedback utente
- [ ] **Integrazione IoT**: Controllo diretto dispositivi smart
- [ ] **Report periodici**: Analisi settimanali/mensili automatiche
- [ ] **Multi-lingua**: Supporto per inglese, francese, tedesco
- [ ] **API custom**: Integrazione con modelli AI proprietari

### Miglioramenti Tecnici
- [ ] **Streaming responses**: Suggerimenti in tempo reale
- [ ] **Batch processing**: Analisi multiple ambienti
- [ ] **Edge computing**: Elaborazione locale per privacy
- [ ] **GraphQL integration**: Query ottimizzate
- [ ] **Webhook support**: Notifiche automatiche
