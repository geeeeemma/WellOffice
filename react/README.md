# WellOffice Dashboard

Sistema intelligente per il monitoraggio continuo dei parametri ambientali nei luoghi di lavoro.

## 🚀 Tecnologie Utilizzate

- **React 19** - Framework JavaScript per UI
- **Vite** - Build tool e dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **Radix UI** - Componenti UI headless
- **Lucide React** - Icone
- **Recharts** - Grafici

## 📦 Installazione

1. Clona il repository
```bash
git clone <repository-url>
cd welloffice-dashboard
```

2. Installa le dipendenze
```bash
npm install --legacy-peer-deps
```

3. Configura le variabili d'ambiente (opzionale)
```bash
cp .env.example .env
```

4. Avvia il server di sviluppo
```bash
npm run dev
```

## 🛠️ Scripts Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Build per la produzione
- `npm run preview` - Anteprima del build
- `npm run lint` - Controllo linting

## 🏗️ Struttura del Progetto

```
src/
├── components/          # Componenti React riutilizzabili
│   ├── ui/             # Componenti UI base (Radix UI)
│   ├── Layout.tsx      # Layout principale
│   └── ...
├── pages/              # Pagine dell'applicazione
│   ├── Dashboard.tsx   # Dashboard principale
│   ├── Settings.tsx    # Pagina impostazioni
│   └── ...
├── store/              # Store Zustand
├── services/           # Servizi API
├── types/              # Definizioni TypeScript
├── hooks/              # Custom hooks
└── lib/                # Utilities

components/             # Componenti legacy (da migrare)
styles/                # Stili globali
public/                # Asset statici
```

## 🔧 Configurazione API

L'applicazione comunica con un backend tramite l'API configurabile:

```typescript
// Variabile d'ambiente
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Theming

Il progetto supporta modalità light/dark con:
- Theme provider custom
- Persistenza locale
- Supporto per system preference

## 📱 Routing

Le rotte disponibili:
- `/` - Dashboard principale
- `/settings` - Gestione parametri
- `/environment/:id` - Dettaglio ambiente
- `/environment/:id/parameter/:parameterId` - Dettaglio parametro

## 🔄 Migrazione da Next.js

Questo progetto è stato migrato da Next.js a Vite per:
- Migliori performance di sviluppo
- Build più leggeri
- Maggiore flessibilità di configurazione
- Architettura SPA più semplice

## 🌟 Funzionalità

- **Monitoraggio Real-time**: Parametri ambientali in tempo reale
- **Dashboard Interattiva**: Visualizzazione dati con grafici
- **Gestione Soglie**: Configurazione limiti parametri
- **Suggerimenti AI**: Raccomandazioni automatiche
- **Responsive Design**: Ottimizzato per desktop e mobile
- **Dark Mode**: Supporto tema scuro

## 🔧 Troubleshooting

### Errori di dipendenze
Se riscontri conflitti con le peer dependencies:
```bash
npm install --legacy-peer-deps
```

### Problemi di build
Assicurati che tutti i file TypeScript siano corretti:
```bash
npm run lint
```

## 📄 Licenza

Questo progetto è privato e proprietario. 