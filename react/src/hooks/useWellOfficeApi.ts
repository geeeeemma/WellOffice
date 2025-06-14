import { useState, useEffect, useCallback } from 'react'
import { wellOfficeApiService } from '../services/wellOfficeApiService'

/**
 * Hook personalizzato per l'utilizzo dell'API WellOffice
 * Fornisce stati e metodi per interagire con l'API
 */
export function useWellOfficeApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  /**
   * Esegue una chiamata API con gestione automatica dello stato
   */
  const executeApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
      setError(errorMessage)
      
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage))
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Test di connessione API
   */
  const testConnection = useCallback(async () => {
    const isConnected = await executeApiCall(
      () => wellOfficeApiService.testConnection(),
      (connected) => setIsConnected(connected),
      () => setIsConnected(false)
    )
    
    return isConnected ?? false
  }, [executeApiCall])

  /**
   * Verifica la connessione all'avvio
   */
  useEffect(() => {
    testConnection()
  }, [testConnection])

  // ============================================
  // METODI ROOM API
  // ============================================

  const getRooms = useCallback((onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.getRooms(),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  const getRoom = useCallback((id: string, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.getRoom(id),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  const createRoom = useCallback((roomData: any, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.createRoom(roomData),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  const updateRoom = useCallback((id: string, roomData: any, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.updateRoom(id, roomData),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  const deleteRoom = useCallback((id: string, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.deleteRoom(id),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  // ============================================
  // METODI SENSOR API
  // ============================================

  const getSensors = useCallback((onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.getSensors(),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  const getSensorsByRoom = useCallback((roomId: string, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.getSensorsByRoom(roomId),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  // ============================================
  // METODI SENSOR DATA API
  // ============================================

  const getSensorData = useCallback((
    roomId: string, 
    parameterId?: string, 
    hours?: number,
    onSuccess?: (data: any) => void, 
    onError?: (error: Error) => void
  ) => {
    return executeApiCall(
      () => wellOfficeApiService.getSensorData(roomId, parameterId, hours),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  // ============================================
  // METODI THRESHOLD API
  // ============================================

  const getThresholds = useCallback((roomId: string, onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.getThresholds(roomId),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  const updateThreshold = useCallback((
    id: string, 
    thresholdData: any, 
    onSuccess?: (data: any) => void, 
    onError?: (error: Error) => void
  ) => {
    return executeApiCall(
      () => wellOfficeApiService.updateThreshold(id, thresholdData),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  // ============================================
  // METODI PARAMETER API
  // ============================================

  const getParameters = useCallback((onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.getParameters(),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  // ============================================
  // METODI REMEDIATION ACTION API
  // ============================================

  const getRemediationActions = useCallback((
    sensorId?: string, 
    onSuccess?: (data: any) => void, 
    onError?: (error: Error) => void
  ) => {
    return executeApiCall(
      () => wellOfficeApiService.getRemediationActions(sensorId),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  const createRemediationAction = useCallback((
    actionData: any, 
    onSuccess?: (data: any) => void, 
    onError?: (error: Error) => void
  ) => {
    return executeApiCall(
      () => wellOfficeApiService.createRemediationAction(actionData),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  // ============================================
  // METODI UTILITY
  // ============================================

  const getApiInfo = useCallback((onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
    return executeApiCall(
      () => wellOfficeApiService.getApiInfo(),
      onSuccess,
      onError
    )
  }, [executeApiCall])

  return {
    // Stati
    isLoading,
    error,
    isConnected,
    
    // Utility
    testConnection,
    executeApiCall,
    
    // Room API
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    
    // Sensor API
    getSensors,
    getSensorsByRoom,
    
    // Sensor Data API
    getSensorData,
    
    // Threshold API
    getThresholds,
    updateThreshold,
    
    // Parameter API
    getParameters,
    
    // Remediation Action API
    getRemediationActions,
    createRemediationAction,
    
    // Utility API
    getApiInfo
  }
}

export default useWellOfficeApi 