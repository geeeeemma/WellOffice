# Configurazione NSwag per WellOffice Frontend

## Panoramica

NSwag è configurato per generare automaticamente client TypeScript dall'API backend WellOffice. Questo assicura che il frontend sia sempre sincronizzato con le API del backend.

## Struttura dei File

```
react/
├── nswag.json                              # Configurazione NSwag
├── src/
│   ├── services/
│   │   ├── generated/
│   │   │   ├── .gitkeep                    # Mantiene la directory nel git
│   │   │   └── api-client.ts               # Client generato (da NSwag)
│   │   ├── wellOfficeApiService.ts         # Wrapper service
│   │   └── api.ts                          # Service esistente (da sostituire)
│   └── hooks/
│       └── useWellOfficeApi.ts             # Hook React personalizzato
```

## Configurazione

### 1. File `nswag.json`

Il file di configurazione NSwag specifica:
- **URL Swagger**: `https://localhost:7154/swagger/v1/swagger.json`
- **Output**: `src/services/generated/api-client.ts`
- **Classe client**: `WellOfficeApiClient`
- **Template**: Fetch API
- **TypeScript**: Versione 5.0

### 2. Script NPM

```json
{
  "scripts": {
    "generate-api": "nswag run nswag.json",
    "generate-api:watch": "nswag run nswag.json --watch"
  }
}
```

## Utilizzo

### 1. Generazione del Client

Prima di utilizzare l'API, genera il client TypeScript:

```bash
# Generazione singola
npm run generate-api

# Generazione con watch (rigenera automaticamente quando cambia l'API)
npm run generate-api:watch
```

### 2. Utilizzo del Service Wrapper

Il `WellOfficeApiService` fornisce un wrapper semplificato:

```typescript
import { wellOfficeApiService } from '@/services/wellOfficeApiService'

// Esempio di utilizzo
async function fetchRooms() {
  try {
    const rooms = await wellOfficeApiService.getRooms()
    console.log('Stanze:', rooms)
  } catch (error) {
    console.error('Errore:', error.message)
  }
}
```

### 3. Utilizzo dell'Hook React

L'hook `useWellOfficeApi` fornisce gestione automatica dello stato:

```typescript
import { useWellOfficeApi } from '@/hooks/useWellOfficeApi'

function MyComponent() {
  const { 
    getRooms, 
    isLoading, 
    error, 
    isConnected 
  } = useWellOfficeApi()

  useEffect(() => {
    getRooms(
      (rooms) => {
        console.log('Stanze caricate:', rooms)
      },
      (error) => {
        console.error('Errore nel caricamento:', error)
      }
    )
  }, [getRooms])

  if (isLoading) return <div>Caricamento...</div>
  if (error) return <div>Errore: {error}</div>
  if (!isConnected) return <div>Connessione API non disponibile</div>

  return <div>Contenuto componente</div>
}
```

## Metodi API Disponibili

### Room API
- `getRooms()` - Ottiene tutte le stanze
- `getRoom(id)` - Ottiene una stanza specifica
- `createRoom(data)` - Crea una nuova stanza
- `updateRoom(id, data)` - Aggiorna una stanza
- `deleteRoom(id)` - Elimina una stanza

### Sensor API
- `getSensors()` - Ottiene tutti i sensori
- `getSensorsByRoom(roomId)` - Ottiene i sensori di una stanza

### Sensor Data API
- `getSensorData(roomId, parameterId?, hours?)` - Ottiene i dati dei sensori

### Threshold API
- `getThresholds(roomId)` - Ottiene le soglie di una stanza
- `updateThreshold(id, data)` - Aggiorna le soglie

### Parameter API
- `getParameters()` - Ottiene tutti i parametri

### Remediation Action API
- `getRemediationActions(sensorId?)` - Ottiene le azioni di rimedio
- `createRemediationAction(data)` - Crea una nuova azione di rimedio

## Gestione Errori

Il service wrapper gestisce automaticamente gli errori più comuni:

- **401 Unauthorized** - Credenziali non valide
- **404 Not Found** - Risorsa non trovata
- **500 Internal Server Error** - Errore del server
- **0 Network Error** - Problemi di connessione

## Configurazione Backend

Assicurati che il backend sia configurato per esporre Swagger:

1. **URL API**: Verifica che `config.apiUrl` in `src/config/env.ts` punti all'URL corretto
2. **CORS**: Il backend deve permettere le richieste dal frontend
3. **Swagger**: L'endpoint `/swagger/v1/swagger.json` deve essere accessibile

## Workflow di Sviluppo

1. **Modifica il backend** - Aggiungi/modifica endpoint
2. **Avvia il backend** - Assicurati che sia in esecuzione
3. **Genera il client** - Esegui `npm run generate-api`
4. **Aggiorna il wrapper** - Decommentare e adattare i metodi in `wellOfficeApiService.ts`
5. **Usa nel frontend** - Utilizza l'hook o il service direttamente

## Debug e Troubleshooting

### Problemi Comuni

1. **"Client API non ancora generato"**
   - Soluzione: Esegui `npm run generate-api`

2. **"Error: getaddrinfo ENOTFOUND localhost"**
   - Soluzione: Verifica che il backend sia in esecuzione
   - Controlla l'URL in `nswag.json` e `config/env.ts`

3. **"404 Not Found swagger.json"**
   - Soluzione: Verifica che Swagger sia abilitato nel backend
   - Controlla l'URL Swagger nel browser

### Log di Debug

Abilita i log di debug impostando `VITE_DEBUG=true` nel file `.env`:

```bash
VITE_DEBUG=true
VITE_API_URL=https://localhost:7154/api
```

## Migrazione dall'API Esistente

Per sostituire l'API service esistente:

1. **Backup**: Salva il file `src/services/api.ts` esistente
2. **Genera client**: Esegui `npm run generate-api`
3. **Aggiorna riferimenti**: Sostituisci gli import da `api.ts` con `wellOfficeApiService.ts`
4. **Test**: Verifica che tutte le funzionalità funzionino correttamente

## Best Practices

1. **Rigenera regolarmente** - Usa `npm run generate-api:watch` durante lo sviluppo
2. **Gestisci gli errori** - Usa sempre try/catch o i callback di errore
3. **Tipi TypeScript** - Sfrutta i tipi generati per una migliore type safety
4. **Consistenza** - Usa sempre lo stesso service wrapper per tutte le chiamate API 