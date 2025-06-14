import config from '../config/env'

// Importa il client generato da NSwag (sarà disponibile dopo aver eseguito npm run generate-api)
// import { WellOfficeApiClient } from './generated/api-client'

/**
 * Configurazione del client API
 */
const API_CONFIG = {
  baseUrl: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

/**
 * Classe wrapper per il client API generato da NSwag
 * Fornisce metodi di convenience e gestione centralizzata degli errori
 */
export class WellOfficeApiService {
  // private client: WellOfficeApiClient
  
  constructor() {
    // Inizializza il client generato da NSwag
    // this.client = new WellOfficeApiClient(API_CONFIG.baseUrl)
    
    // Configurazioni aggiuntive del client
    this.setupClientConfiguration()
  }

  /**
   * Configura il client API con impostazioni comuni
   */
  private setupClientConfiguration(): void {
    // Configurazioni che verranno applicate al client generato
    console.log('🔧 Configurando WellOffice API Client...', {
      baseUrl: API_CONFIG.baseUrl,
      timeout: API_CONFIG.timeout
    })
  }

  /**
   * Gestisce gli errori API in modo centralizzato
   */
  private handleApiError(error: any): never {
    console.error('❌ API Error:', error)
    
    if (error.status === 401) {
      throw new Error('Non autorizzato: controlla le credenziali')
    } else if (error.status === 404) {
      throw new Error('Risorsa non trovata')
    } else if (error.status === 500) {
      throw new Error('Errore interno del server')
    } else if (error.status === 0) {
      throw new Error('Errore di connessione: controlla che il server sia attivo')
    } else {
      throw new Error(`Errore API: ${error.message || 'Errore sconosciuto'}`)
    }
  }

  // ============================================
  // METODI ROOM API
  // ============================================
  
  /**
   * Ottiene tutte le stanze
   */
  async getRooms() {
    try {
      // return await this.client.roomsGET()
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Ottiene una stanza per ID
   */
  async getRoom(id: string) {
    try {
      // return await this.client.roomsGET2(id)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Crea una nuova stanza
   */
  async createRoom(roomData: any) {
    try {
      // return await this.client.roomsPOST(roomData)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Aggiorna una stanza
   */
  async updateRoom(id: string, roomData: any) {
    try {
      // return await this.client.roomsPUT(id, roomData)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Elimina una stanza
   */
  async deleteRoom(id: string) {
    try {
      // return await this.client.roomsDELETE(id)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  // ============================================
  // METODI SENSOR API
  // ============================================

  /**
   * Ottiene tutti i sensori
   */
  async getSensors() {
    try {
      // return await this.client.sensorsGET()
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Ottiene i sensori di una stanza
   */
  async getSensorsByRoom(roomId: string) {
    try {
      // return await this.client.sensorsGET2(roomId)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  // ============================================
  // METODI SENSOR DATA API
  // ============================================

  /**
   * Ottiene i dati dei sensori per una stanza
   */
  async getSensorData(roomId: string, parameterId?: string, hours?: number) {
    try {
      // return await this.client.sensorDataGET(roomId, parameterId, hours)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  // ============================================
  // METODI THRESHOLD API
  // ============================================

  /**
   * Ottiene le soglie per una stanza
   */
  async getThresholds(roomId: string) {
    try {
      // return await this.client.thresholdsGET(roomId)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Aggiorna le soglie
   */
  async updateThreshold(id: string, thresholdData: any) {
    try {
      // return await this.client.thresholdsPUT(id, thresholdData)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  // ============================================
  // METODI PARAMETER API
  // ============================================

  /**
   * Ottiene tutti i parametri
   */
  async getParameters() {
    try {
      // return await this.client.parametersGET()
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  // ============================================
  // METODI REMEDIATION ACTION API
  // ============================================

  /**
   * Ottiene le azioni di rimedio
   */
  async getRemediationActions(sensorId?: string) {
    try {
      // return await this.client.remediationActionsGET(sensorId)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Crea una nuova azione di rimedio
   */
  async createRemediationAction(actionData: any) {
    try {
      // return await this.client.remediationActionsPOST(actionData)
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }

  // ============================================
  // METODI UTILITY
  // ============================================

  /**
   * Test di connessione API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Prova a chiamare un endpoint semplice
      await this.getRooms()
      return true
    } catch (error) {
      console.error('🔌 Test connessione API fallito:', error)
      return false
    }
  }

  /**
   * Ottiene le informazioni sulla versione API
   */
  async getApiInfo() {
    try {
      // return await this.client.apiInfoGET()
      throw new Error('Client API non ancora generato. Esegui: npm run generate-api')
    } catch (error) {
      this.handleApiError(error)
    }
  }
}

// Istanza singleton del servizio API
export const wellOfficeApiService = new WellOfficeApiService()

// Export default per compatibility
export default wellOfficeApiService
