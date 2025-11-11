// eslint-disable-next-line import/named
import { useState, useEffect, useCallback, useMemo, cache } from 'react'

class LocalCache {
  private cache = new Map<string, { value: any; timestamp: number; ttl: number }>()
  private storageKey = 'app-cache'

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.storageKey)

      if (stored) {
        const parsed = JSON.parse(stored)

        this.cache = new Map(parsed)
        this.cleanExpired()
      }
    } catch (error) {
      console.error('Erro ao carregar cache do localStorage:', error)
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return

    try {
      const serialized = JSON.stringify(Array.from(this.cache.entries()))

      localStorage.setItem(this.storageKey, serialized)
    } catch (error) {
      console.error('Erro ao salvar cache no localStorage:', error)

      // Se excedeu a quota, limpar cache antigo e tentar novamente
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.log('🧹 Quota excedida, limpando cache antigo...')
        this.clearOldestEntries()

        try {
          const serialized = JSON.stringify(Array.from(this.cache.entries()))

          localStorage.setItem(this.storageKey, serialized)
          console.log('✅ Cache salvo após limpeza')
        } catch (retryError) {
          console.error('❌ Erro ao salvar cache após limpeza:', retryError)
          this.clear()
        }
      }
    }
  }

  private cleanExpired() {
    const now = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  private clearOldestEntries() {
    // Converter para array e ordenar por timestamp (mais antigo primeiro)
    const entries = Array.from(this.cache.entries()).sort(([, a], [, b]) => a.timestamp - b.timestamp)

    // Remover 50% das entradas mais antigas
    const entriesToRemove = Math.floor(entries.length / 2)

    for (let i = 0; i < entriesToRemove; i++) {
      this.cache.delete(entries[i][0])
    }

    console.log(`🗑️ Removidas ${entriesToRemove} entradas antigas do cache`)
  }

  set(key: string, value: any, ttl: number = 60 * 60 * 1000) {
    // default: 1 hora
    // Limpar entradas expiradas antes de adicionar nova
    this.cleanExpired()

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
    this.saveToStorage()
  }

  get(key: string): any | null {
    const item = this.cache.get(key)

    if (!item) return null

    const isExpired = Date.now() - item.timestamp > item.ttl

    if (isExpired) {
      this.cache.delete(key)
      this.saveToStorage()

      return null
    }

    return item.value
  }

  clear() {
    this.cache.clear()
    this.saveToStorage()
  }

  clearKey(key: string) {
    this.cache.delete(key)
    this.saveToStorage()
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key)
  }

  private isExpired(key: string): boolean {
    const item = this.cache.get(key)

    if (!item) return true

    return Date.now() - item.timestamp > item.ttl
  }
}

const globalCache = new LocalCache()

// Limpeza automática de dados expirados a cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      globalCache['cleanExpired']()
    },
    5 * 60 * 1000
  ) // 5 minutos
}

interface CacheOptions {
  ttl?: number // Time to live em milissegundos
  key?: string // Chave customizada para o cache
  enabled?: boolean // Se o cache está habilitado
}

interface CacheResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  invalidateCache: () => void
  refetch: () => void
  isCached: boolean
}

export function useCache<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = [],
  options: CacheOptions = {}
): CacheResult<T> {
  const {
    ttl = 60 * 60 * 1000, // default: 1 hora
    key,
    enabled = true
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isCached, setIsCached] = useState(false)

  const cacheKey = useMemo(() => {
    if (key) return key

    return `cache-${dependencies.join('-')}`
  }, [key, dependencies])

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      if (!enabled) return

      try {
        setLoading(true)
        setError(null)

        const cachedData = globalCache.get(cacheKey)

        if (cachedData && globalCache['cache'].has(cacheKey)) {
          const currentItem = globalCache['cache'].get(cacheKey)

          if (currentItem && currentItem.ttl !== ttl) {
            globalCache.clearKey(cacheKey)
            forceRefresh = true
          }
        }

        if (!forceRefresh && cachedData) {
          setData(cachedData)
          setIsCached(true)
          setLoading(false)

          return
        }

        const result = await fetcher()

        globalCache.set(cacheKey, result, ttl)

        setData(result)
        setIsCached(false)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao buscar dados:', err)

        const cachedData = globalCache.get(cacheKey)

        if (cachedData) {
          setData(cachedData)
          setIsCached(true)
          setError(null)
        } else {
          setError(err as Error)
          setData(null)
        }

        setLoading(false)
      }
    },
    [fetcher, cacheKey, ttl, enabled]
  )

  const invalidateCache = useCallback(() => {
    globalCache.clearKey(cacheKey)
    setIsCached(false)
  }, [cacheKey])

  const refetch = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    invalidateCache,
    refetch,
    isCached
  }
}

export function useReactCache<T>(
  fetcher: (...args: any[]) => Promise<T>,
  dependencies: any[] = [],
  options: CacheOptions = {}
): CacheResult<T> {
  const { enabled = true } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Criar função cacheada do React
  const cachedFetcher = useMemo(() => {
    return cache(fetcher)
  }, [fetcher])

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      const result = await cachedFetcher(...dependencies)

      setData(result)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar dados:', err)
    } finally {
      setLoading(false)
    }
  }, [cachedFetcher, dependencies, enabled])

  const invalidateCache = useCallback(() => {
    setData(null)
    setLoading(true)
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    invalidateCache,
    refetch,
    isCached: false
  }
}

export const cacheUtils = {
  clearAll: () => globalCache.clear(),

  clearByPattern: (pattern: string) => {
    const keys = Array.from(globalCache['cache'].keys())

    keys.forEach(key => {
      if (key.includes(pattern)) {
        globalCache.clearKey(key)
      }
    })
  },

  // Limpar cache específico do saldo total
  clearSaldoTotal: () => {
    globalCache.clearKey('saldo-total-7e670aa0d8906ba2e828cdd75d713cce')
  },

  // Limpar todo o localStorage
  clearLocalStorage: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app-cache')
      globalCache.clear()
    }
  },

  has: (key: string) => globalCache.has(key),
  get: (key: string) => globalCache.get(key),
  set: (key: string, value: any, ttl?: number) => globalCache.set(key, value, ttl),

  // Funções de debug
  debug: {
    getAllKeys: () => Array.from(globalCache['cache'].keys()),
    getCacheSize: () => globalCache['cache'].size,
    getCacheInfo: () => {
      const keys = Array.from(globalCache['cache'].keys())

      return keys.map(key => {
        const item = globalCache['cache'].get(key)

        return {
          key,
          timestamp: item?.timestamp,
          ttl: item?.ttl,
          isExpired: item ? Date.now() - item.timestamp > item.ttl : true,
          age: item ? Date.now() - item.timestamp : 0
        }
      })
    }
  }
}
