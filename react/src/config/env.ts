/**
 * Configurazione delle variabili d'ambiente per WellOffice
 * 
 * Questo file centralizza tutte le configurazioni dell'applicazione
 * e fornisce valori di default per lo sviluppo.
 */

// Interfaccia per la configurazione dell'app
export interface AppConfig {
  // API Configuration
  apiUrl: string
  
  // OpenAI Configuration
  openaiApiKey: string
  
  // Development Configuration
  port: number
  environment: 'development' | 'production' | 'staging'
  debug: boolean
}

/**
 * Configurazione dell'applicazione
 * Le variabili d'ambiente hanno precedenza sui valori di default
 */
export const config: AppConfig = {
  // Backend API URL
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // OpenAI API Key
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  
  // Development port
  port: parseInt(import.meta.env.VITE_PORT || '3000'),
  
  // Environment
  environment: (import.meta.env.VITE_ENV as AppConfig['environment']) || 'development',
  
  // Debug mode
  debug: import.meta.env.VITE_DEBUG === 'true' || false,
}

/**
 * Valida la configurazione e mostra avvisi se necessario
 */
export function validateConfig(): void {
  const warnings: string[] = []
  
  // Debug: mostra il valore della chiave API
  console.log('🔑 Debug OpenAI API Key:', {
    fromEnv: import.meta.env.VITE_OPENAI_API_KEY,
    configValue: config.openaiApiKey,
    isDemoKey: config.openaiApiKey === 'demo-key',
    keyLength: config.openaiApiKey?.length || 0,
    keyPrefix: config.openaiApiKey?.substring(0, 8) || 'N/A',
    hasValidFormat: config.openaiApiKey?.startsWith('sk-') || false
  })
  
  // Validazione più rigorosa della chiave API
  if (config.openaiApiKey === 'demo-key') {
    warnings.push('⚠️  OpenAI API Key non configurata. Usa una chiave reale per i suggerimenti AI.')
    warnings.push('💡 Crea un file .env nella root del progetto con: VITE_OPENAI_API_KEY=your-api-key')
  } else if (!config.openaiApiKey.startsWith('sk-')) {
    warnings.push('⚠️  OpenAI API Key non ha il formato corretto. Deve iniziare con "sk-"')
  } else if (config.openaiApiKey.length < 40) {
    warnings.push('⚠️  OpenAI API Key sembra troppo corta. Verifica che sia completa.')
  } else if (config.openaiApiKey.includes('your-openai-api-key-here')) {
    warnings.push('⚠️  OpenAI API Key è ancora il placeholder. Sostituiscila con una chiave reale.')
  }
  
  if (config.apiUrl.includes('localhost') && config.environment === 'production') {
    warnings.push('⚠️  URL API localhost in produzione. Verifica la configurazione.')
  }
  
  if (warnings.length > 0) {
    console.warn('🔧 Configurazione WellOffice:')
    warnings.forEach(warning => console.warn(warning))
    console.warn('💡 Crea un file .env nella root del progetto per configurare le variabili.')
    console.warn('📝 Esempio file .env:')
    console.warn('VITE_OPENAI_API_KEY=sk-proj-your-actual-key-here')
    console.warn('VITE_API_URL=http://localhost:5000/api')
    console.warn('VITE_DEBUG=true')
  }
  
  if (config.debug) {
    console.log('🐛 Debug mode attivo')
    console.log('📊 Configurazione attuale:', {
      apiUrl: config.apiUrl,
      openaiApiKey: config.openaiApiKey.substring(0, 8) + '...',
      environment: config.environment,
      port: config.port,
    })
  }
}

/**
 * Test della connessione API OpenAI
 */
export async function testOpenAIConnection(): Promise<boolean> {
  if (config.openaiApiKey === 'demo-key' || !config.openaiApiKey.startsWith('sk-')) {
    console.error('❌ OpenAI API Key non valida per il test')
    return false
  }

  try {
    console.log('🧪 Testing OpenAI API connection...')
    
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      console.log('✅ OpenAI API connection successful')
      return true
    } else {
      const errorData = await response.text()
      console.error('❌ OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      
      if (response.status === 401) {
        console.warn('🔑 Errore 401: Chiave API non autorizzata')
        console.warn('💡 Possibili cause:')
        console.warn('   - Chiave API non valida o scaduta')
        console.warn('   - Quota API esaurita')
        console.warn('   - Billing account non configurato')
        console.warn('   - Progetto OpenAI non configurato correttamente')
      }
      
      return false
    }
  } catch (error) {
    console.error('❌ Errore durante il test OpenAI:', error)
    return false
  }
}

/**
 * Utility per verificare se siamo in sviluppo
 */
export const isDevelopment = config.environment === 'development'

/**
 * Utility per verificare se siamo in produzione
 */
export const isProduction = config.environment === 'production'

/**
 * Esporta la configurazione come default
 */
export default config 