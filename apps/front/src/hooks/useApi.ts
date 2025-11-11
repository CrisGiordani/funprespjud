import { useCallback } from 'react'

import { fetchWithAuth } from '@/app/lib/api'

export const useApi = () => {
  const apiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetchWithAuth(url, options)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return response
    } catch (error) {
      console.error('API call error:', error)
      throw error
    }
  }, [])

  const get = useCallback((url: string) => apiCall(url, { method: 'GET' }), [apiCall])

  const post = useCallback(
    (url: string, data?: any) =>
      apiCall(url, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      }),
    [apiCall]
  )

  const put = useCallback(
    (url: string, data?: any) =>
      apiCall(url, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
      }),
    [apiCall]
  )

  const del = useCallback((url: string) => apiCall(url, { method: 'DELETE' }), [apiCall])

  return {
    apiCall,
    get,
    post,
    put,
    delete: del
  }
}
