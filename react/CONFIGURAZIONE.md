# 🔧 Configurazione WellOffice

Questa guida ti aiuterà a configurare correttamente le variabili d'ambiente per WellOffice.

## 📋 Variabili d'Ambiente Richieste

### 1. Crea il file `.env`

Nella root del progetto, crea un file chiamato `.env` con il seguente contenuto:

```bash
# WellOffice Configuration
# ========================

# Backend API Configuration
# URL del backend per le chiamate API
VITE_API_URL=http://localhost:5000/api

# OpenAI Configuration
# Chiave API per OpenAI (richiesta per i suggerimenti AI)
VITE_OPENAI_API_KEY=your-openai-api-key-here

# Development Configuration (opzionali)
VITE_PORT=3000
VITE_ENV=development
VITE_DEBUG=false
```

### 2. Configura OpenAI API Key

1. Vai su [OpenAI Platform](https://platform.openai.com/api-keys)
2. Accedi al tuo account OpenAI
3. Crea una nuova API Key
4. Sostituisci `your-openai-api-key-here` nel file `.env` con la tua chiave reale

### 3. Configura Backend URL

Se il tuo backend è su una porta diversa o un server remoto, modifica `VITE_API_URL`:

```bash
# Per backend locale su porta diversa
VITE_API_URL=http://localhost:8080/api

# Per backend remoto
VITE_API_URL=https://api.tuodominio.com/api
```

## 🚀 Avvio dell'Applicazione

Dopo aver configurato il file `.env`:

```bash
# Installa le dipendenze
npm install --legacy-peer-deps

# Avvia il server di sviluppo
npm run dev
```

## 🔍 Verifica Configurazione

L'applicazione mostrerà automaticamente avvisi nella console se:
- ❌ La chiave OpenAI non è configurata
- ❌ L'URL API è localhost in produzione
- ❌ Ci sono problemi di configurazione

## 📁 Struttura File di Configurazione

```
src/config/
├── env.ts          # Configurazione centralizzata
└── ...

.env                # Variabili d'ambiente (NON committare!)
.env.example        # Esempio di configurazione
```

## 🔒 Sicurezza

⚠️ **IMPORTANTE**: 
- Non committare mai il file `.env` nel repository
- Il file `.env` è già incluso nel `.gitignore`
- Usa sempre `VITE_` come prefisso per le variabili d'ambiente in Vite

## 🐛 Debug

Per abilitare il debug mode, imposta:

```bash
VITE_DEBUG=true
```

Questo mostrerà informazioni dettagliate sulla configurazione nella console.

## 📞 Supporto

Se hai problemi con la configurazione:
1. Controlla la console del browser per messaggi di errore
2. Verifica che il file `.env` sia nella root del progetto
3. Assicurati che tutte le variabili abbiano il prefisso `VITE_`
4. Riavvia il server di sviluppo dopo aver modificato `.env` 