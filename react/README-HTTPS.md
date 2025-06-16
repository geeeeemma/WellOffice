# Configurazione HTTPS per WellOffice Frontend

## ✅ Configurazione Completata

Il frontend è ora configurato per funzionare con HTTPS usando certificati autofirmati generati automaticamente da Vite.

## 🚀 Come Avviare

### 1. Avvia il Frontend con HTTPS
```bash
cd react
npm run dev
```

Il frontend sarà disponibile su: **https://localhost:3000**

### 2. Accetta il Certificato Autofirmato

Al primo accesso, il browser mostrerà un avviso di sicurezza perché il certificato è autofirmato:

**Chrome/Edge:**
- Clicca "Avanzate"
- Clicca "Procedi su localhost (non sicuro)"

**Firefox:**
- Clicca "Avanzate"
- Clicca "Accetta il rischio e continua"

**Safari:**
- Clicca "Visualizza sito web"

## 🔧 Configurazioni Alternative

### Opzione 1: Certificati con mkcert (Consigliato per sviluppo)

Per evitare gli avvisi del browser, puoi usare **mkcert** per generare certificati trusted localmente:

```bash
# Installa mkcert (Windows con Chocolatey)
choco install mkcert

# Oppure (Windows con Scoop)
scoop install mkcert

# Installa il CA locale
mkcert -install

# Genera certificati per localhost
cd react
mkcert localhost 127.0.0.1 ::1

# Questo creerà: localhost+2.pem e localhost+2-key.pem
```

Poi aggiorna `vite.config.ts`:
```typescript
server: {
  port: 3000,
  open: true,
  https: {
    key: './localhost+2-key.pem',
    cert: './localhost+2.pem'
  },
},
```

### Opzione 2: Certificati Personalizzati

Se hai certificati SSL personalizzati:

```typescript
server: {
  port: 3000,
  open: true,
  https: {
    key: fs.readFileSync('path/to/private-key.pem'),
    cert: fs.readFileSync('path/to/certificate.pem')
  },
},
```

## 🌐 Configurazione API

### Se anche il Backend è HTTPS

Se il backend ASP.NET Core è configurato per HTTPS, aggiorna l'URL dell'API:

Crea/modifica il file `.env`:
```bash
VITE_API_URL=https://localhost:5001/api
```

### Mixed Content (HTTPS Frontend + HTTP Backend)

Se il frontend è HTTPS ma il backend è HTTP, potresti avere problemi di "Mixed Content". Soluzioni:

1. **Configura anche il backend per HTTPS** (raccomandato)
2. **Usa proxy in Vite** (per sviluppo):

```typescript
// vite.config.ts
server: {
  port: 3000,
  open: true,
  https: {},
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false
    }
  }
},
```

## 🔐 Vantaggi di HTTPS in Sviluppo

- **Service Workers**: Molte API moderne richiedono HTTPS
- **Geolocation API**: Richiede HTTPS
- **WebRTC**: Richiede HTTPS per funzioni avanzate
- **Clipboard API**: Richiede HTTPS
- **Testing realistico**: Simula l'ambiente di produzione
- **PWA Development**: Richiede HTTPS per molte funzionalità

## 🎯 URL di Accesso

- **Sviluppo HTTP**: http://localhost:3000
- **Sviluppo HTTPS**: https://localhost:3000
- **API Backend**: http://localhost:5000/api (o https://localhost:5001/api)

## 🛠️ Troubleshooting

### Errore "NET::ERR_CERT_AUTHORITY_INVALID"
- Normale con certificati autofirmati
- Accetta l'avviso del browser o usa mkcert

### Errore "Mixed Content"
- Frontend HTTPS che chiama API HTTP
- Configura il backend per HTTPS o usa proxy

### Errore "ERR_SSL_PROTOCOL_ERROR"
- Verifica che il server sia configurato correttamente
- Controlla che non ci siano conflitti di porta

## 🔄 Ripristino HTTP

Per tornare a HTTP, rimuovi la configurazione HTTPS da `vite.config.ts`:

```typescript
server: {
  port: 3000,
  open: true,
  // Rimuovi la riga https: {}
},
``` 