import { useState, useCallback, useEffect } from 'react'

import { useCache } from '@/hooks/useCache'

interface CachedUser {
  cpf: string
  name: string
  role: string[]
}

interface UsersCacheResult {
  users: CachedUser[]
  loading: boolean
  error: Error | null
  refetch: () => void
  isCached: boolean
  cacheTimestamp: number | null
}

export function useUsersCache(): UsersCacheResult {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null)

  const fetchAllUsers = useCallback(async (): Promise<CachedUser[]> => {
    const response = await fetch('/api/users/fetch-users-names-cpfs')

    if (!response.ok) {
      throw new Error('Erro ao buscar usuários')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Dados inválidos recebidos')
    }

    return data
  }, [])

  const result = useCache<CachedUser[]>(fetchAllUsers, [], {
    key: 'users-names-cpfs-roles-cache',
    ttl: 30 * 60 * 1000, // 30 minutos
    enabled: true
  })

  // Função para obter timestamp atualizado
  const getCurrentCacheTimestamp = useCallback(() => {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem('app-cache')

      if (stored) {
        const parsed = JSON.parse(stored)
        const cacheEntry = parsed.find(([key]: [string, any]) => key === 'users-names-cpfs-roles-cache')

        return cacheEntry ? cacheEntry[1].timestamp : null
      }
    } catch (error) {
      console.error('Erro ao obter timestamp do cache:', error)
    }

    return null
  }, [refreshTrigger])

  // Atualizar timestamp quando o cache for atualizado
  useEffect(() => {
    const updateTimestamp = () => {
      const timestamp = getCurrentCacheTimestamp()

      setCurrentTimestamp(timestamp)
    }

    updateTimestamp()
  }, [getCurrentCacheTimestamp, result.data])

  // Função para limpar cache de usuários
  const clearUsersCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('app-cache')

        if (stored) {
          const parsed = JSON.parse(stored)
          const filtered = parsed.filter(([key]: [string, any]) => key !== 'users-names-cpfs-roles-cache')

          localStorage.setItem('app-cache', JSON.stringify(filtered))
          console.log('🧹 Cache de usuários limpo')
        }
      } catch (error) {
        console.error('Erro ao limpar cache de usuários:', error)
      }
    }
  }, [])

  // Função de refresh customizada que força atualização do timestamp
  const customRefetch = useCallback(async () => {
    console.log('🔄 Iniciando refresh do cache...')

    // Limpar cache de usuários antes de fazer refresh
    clearUsersCache()

    await result.refetch()
    setRefreshTrigger(prev => prev + 1)

    // Aguardar um pouco para o cache ser atualizado
    setTimeout(() => {
      const timestamp = getCurrentCacheTimestamp()

      console.log('⏰ Novo timestamp do cache:', timestamp)
      setCurrentTimestamp(timestamp)
    }, 100)
  }, [result.refetch, getCurrentCacheTimestamp, clearUsersCache])

  return {
    users: result.data || [],
    loading: result.loading,
    error: result.error,
    refetch: customRefetch,
    isCached: result.isCached,
    cacheTimestamp: currentTimestamp
  }
}

// Função utilitária para busca local
export function searchUsersLocal(users: CachedUser[], searchTerm: string): CachedUser[] {
  if (!searchTerm || searchTerm.trim().length < 3) {
    return []
  }

  const term = searchTerm.toLowerCase().trim()

  return users.filter(
    user =>
      user.name.toLowerCase().includes(term) ||
      user.cpf.includes(term) ||
      user.role.some(role => role.toLowerCase().includes(term))
  )
}
