# WellOffice

Sistema intelligente per il monitoraggio continuo dei parametri ambientali nei luoghi di lavoro. WellOffice è una soluzione completa che include un'applicazione web (React), un'API backend (ASP.NET Core) e un'applicazione mobile Android nativa.

## 🏗️ Architettura del Sistema

Il progetto è strutturato in tre componenti principali:

- **Frontend Web** (`/react`) - Dashboard React con TypeScript e Vite
- **Backend API** (`/aspnet-core`) - API REST con ASP.NET Core 8.0 e PostgreSQL  
- **App Mobile** (`/android`) - Applicazione Android nativa con Kotlin e Jetpack Compose

## 🚀 Avvio Rapido

### Prerequisiti

- **Node.js** 18+ e npm/pnpm
- **.NET 8.0 SDK**
- **Android Studio** (per lo sviluppo mobile)
- **PostgreSQL** (o accesso al database cloud)

### 1. Backend (ASP.NET Core)

```bash
cd aspnet-core
dotnet restore
dotnet run
```

Il backend sarà disponibile su `http://localhost:7254` con Swagger UI su `/swagger`.

### 2. Frontend (React)

```bash
cd react
npm install --legacy-peer-deps

# Crea il file .env con la configurazione necessaria
```

**⚠️ IMPORTANTE**: Crea un file `.env` nella directory `react/` con il seguente contenuto:

```env
VITE_API_URL=http://localhost:7254/api
VITE_OPENAI_API_KEY=ask-gemma
VITE_PORT=3000
VITE_ENV=development
VITE_DEBUG=true
```

Quindi avvia il server di sviluppo:

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`.

### 3. Android

Apri il progetto `android/WellOffice` in Android Studio e avvia l'applicazione su un dispositivo o emulatore.

---

## 📱 Frontend (React)

### Tecnologie Utilizzate

- **React 19** - Framework JavaScript per UI
- **Vite** - Build tool e dev server ultra-veloce
- **TypeScript** - Type safety e migliore DX
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Componenti UI headless accessibili
- **Zustand** - State management leggero
- **React Router 6** - Routing client-side
- **React Hook Form** - Gestione form performante
- **Recharts** - Libreria per grafici e visualizzazioni
- **Lucide React** - Icone moderne
- **AI SDK** - Integrazione con OpenAI per suggerimenti intelligenti

### Struttura del Progetto

```
react/
├── src/
│   ├── components/          # Componenti React riutilizzabili
│   │   ├── ui/             # Componenti UI base (Radix UI)
│   │   └── Layout.tsx      # Layout principale
│   ├── pages/              # Pagine dell'applicazione
│   │   ├── Dashboard.tsx   # Dashboard principale
│   │   └── Settings.tsx    # Pagina impostazioni
│   ├── store/              # Store Zustand
│   ├── services/           # Servizi API e HTTP client
│   ├── types/              # Definizioni TypeScript
│   ├── hooks/              # Custom hooks React
│   └── lib/                # Utilities e helper
├── components/             # Componenti legacy (in migrazione)
├── styles/                # Stili globali
├── public/                # Asset statici
├── docs/                  # Documentazione specifica
└── scripts/               # Script di build e utilità
```

### Script Disponibili

```bash
npm run dev              # Server di sviluppo
npm run build            # Build per produzione
npm run build:dev        # Build per sviluppo
npm run preview          # Anteprima del build
npm run lint             # Linting del codice
npm run generate-api     # Generazione client API da Swagger
```

### Funzionalità Principali

- **Dashboard Real-time**: Monitoraggio parametri ambientali in tempo reale
- **Visualizzazioni Interattive**: Grafici e metriche con Recharts
- **Gestione Soglie**: Configurazione limiti e alert per parametri
- **Suggerimenti AI**: Raccomandazioni automatiche basate su OpenAI
- **Theme System**: Supporto modalità light/dark con persistenza
- **Responsive Design**: Ottimizzato per desktop, tablet e mobile
- **PWA Ready**: Supporto per Progressive Web App

---

## 🔧 Backend (ASP.NET Core)

### Tecnologie Utilizzate

- **.NET 8.0** - Framework backend moderno
- **ASP.NET Core Web API** - API REST performante
- **Entity Framework Core 8.0** - ORM per database
- **PostgreSQL** - Database relazionale su Aiven Cloud
- **AutoMapper** - Mapping automatico DTO/Entity
- **Swagger/OpenAPI** - Documentazione API automatica

### Struttura del Progetto

```
aspnet-core/WellOffice/
├── Controllers/            # Controller API REST
├── Models/                # Entità del database
├── DTOs/                  # Data Transfer Objects
├── Data/                  # DbContext e configurazioni DB
├── Services/              # Logica di business
├── Migrations/            # Migrazioni Entity Framework
├── Properties/            # Configurazioni progetto
├── Program.cs             # Entry point e configurazione
└── appsettings.json       # Configurazioni applicazione
```

### Servizi Implementati

- **IRoomService** - Gestione ambienti e stanze
- **IParameterService** - Gestione parametri ambientali
- **ISensorService** - Gestione sensori IoT
- **ISensorDataService** - Gestione dati telemetrici
- **IThresholdService** - Gestione soglie e limiti
- **IRemediationActionService** - Azioni correttive automatiche
- **IEnvironmentService** - Servizi ambiente generale

### Database

Il progetto utilizza PostgreSQL su Aiven Cloud con Entity Framework Core:

- **Provider**: Npgsql.EntityFrameworkCore.PostgreSQL
- **Migrazioni**: Automatiche con Code First
- **Connection String**: Configurata in `appsettings.json`

### API Endpoints

L'API è documentata automaticamente con Swagger UI, disponibile su `/swagger` in modalità development.

Esempi di endpoint principali:
- `GET /api/rooms` - Lista ambienti
- `GET /api/parameters` - Lista parametri
- `GET /api/sensors` - Lista sensori
- `POST /api/sensor-data` - Invio dati telemetrici

---

## 📱 Android

### Tecnologie Utilizzate

- **Kotlin** - Linguaggio di programmazione moderno
- **Jetpack Compose** - UI toolkit dichiarativo moderno
- **Material Design 3** - Sistema di design Google
- **Coil** - Libreria per caricamento immagini ottimizzata
- **Accompanist** - Librerie complementari per Compose
- **Gson** - Serializzazione/deserializzazione JSON

### Configurazione

- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: 35 (Android 15)
- **Compile SDK**: 35  
- **Java Version**: 11
- **Package**: `it.orbyta.welloffice`

### Struttura del Progetto

```
android/WellOffice/
├── app/
│   ├── src/main/
│   │   ├── java/it/orbyta/welloffice/  # Codice Kotlin
│   │   ├── res/                        # Risorse Android
│   │   └── AndroidManifest.xml         # Manifest applicazione
│   ├── build.gradle.kts               # Configurazione build
│   └── proguard-rules.pro             # Regole obfuscation
├── gradle/                            # Wrapper Gradle
├── build.gradle.kts                   # Configurazione progetto
└── settings.gradle.kts                # Impostazioni Gradle
```

### Funzionalità

- **UI Nativa**: Interfaccia ottimizzata per dispositivi mobili
- **Material Design 3**: Design system coerente e moderno
- **Compose UI**: Interfaccia dichiarativa e reattiva
- **Gestione Immagini**: Caricamento ottimizzato con Coil
- **Integrazione API**: Comunicazione con backend ASP.NET Core

---

## 🌐 Integrazione e Comunicazione

### Flusso Dati

1. **Sensori IoT** → Inviano dati al **Backend API**
2. **Backend** → Processa e memorizza dati in **PostgreSQL**
3. **Frontend Web** → Visualizza dashboard e analytics
4. **App Android** → Accesso mobile ai dati in tempo reale
5. **AI Integration** → Genera suggerimenti basati sui dati

### API Communication

- **Protocollo**: HTTP/HTTPS REST
- **Formato**: JSON
- **Autenticazione**: In fase di implementazione
- **CORS**: Configurato per permettere tutti i domini in development
- **Rate Limiting**: Da implementare per produzione

---

## 🛠️ Sviluppo

### Setup Ambiente di Sviluppo

1. **Clone del repository**:
```bash
git clone <repository-url>
cd WellOffice
```

2. **Backend Setup**:
```bash
cd aspnet-core
dotnet restore
dotnet ef database update  # Se necessario
dotnet run
```

3. **Frontend Setup**:
```bash
cd react
npm install --legacy-peer-deps
# Crea il file .env come specificato sopra
npm run dev
```

4. **Android Setup**:
   - Apri `android/WellOffice` in Android Studio
   - Sincronizza il progetto Gradle
   - Avvia su emulatore o dispositivo

### Code Generation

Il frontend utilizza **NSwag** per generare automaticamente il client TypeScript dall'API Swagger:

```bash
cd react
npm run generate-api        # Genera una volta
npm run generate-api:watch  # Rigenera automaticamente
```

### Deployment

- **Frontend**: Build statico deployabile su CDN/hosting statico
- **Backend**: Container Docker pronto per deployment
- **Android**: APK/AAB per distribuzione Google Play Store

---

## 🔧 Configurazione

### Variabili d'Ambiente Frontend

Il file `.env` è **obbligatorio** per il frontend:

```env
VITE_API_URL=http://localhost:7254/api    # URL API backend
VITE_OPENAI_API_KEY=ask-gemma             # Chiave OpenAI
VITE_PORT=3000                            # Porta dev server
VITE_ENV=development                      # Ambiente
VITE_DEBUG=true                           # Debug mode
```

### Configurazione Backend

Modificare `appsettings.json` per configurazioni specifiche dell'ambiente.





**WellOffice** - Sistema intelligente per il monitoraggio ambientale nei luoghi di lavoro 🏢🌱