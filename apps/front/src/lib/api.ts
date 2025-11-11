import { createElement } from 'react'

import type { InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

//* Cache para o token
let tokenCache: string | null = null
let tokenCacheExpiry: number = 0

let isRefreshing = false
let refreshTokenPromise: Promise<string | null> | null = null

export const clearTokenCache = () => {
  tokenCache = null
  tokenCacheExpiry = 0
  isRefreshing = false
  refreshTokenPromise = null
}

//* Função utilitária para redirecionar para login (para uso manual pelos componentes)
export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    // Atualiza cookies
    deleteCookie('jwtToken')
    deleteCookie('refreshToken')
    deleteCookie('roles')
    deleteCookie('viewerMode')

    clearTokenCache()
    sessionStorage.clear()
    window.location.href = '/login'
  }
}

//* Função para determinar se deve tentar refresh do token
const tryTokenRefresh = (error: any): boolean => {
  // Se não há window (SSR), não tenta refresh
  if (typeof window === 'undefined') {
    return false
  }

  // Se estamos na página de login, não tenta refresh
  if (window.location.pathname === '/login') {
    return false
  }

  // Se a requisição é para logout, não tenta refresh
  if (error.config?.url?.includes('/auth/logout')) {
    return false
  }

  // Se a requisição é para refresh-token, não tenta refresh (evita loop)
  if (error.config?.url?.includes('/auth/refresh-token')) {
    return false
  }

  // Se não há token no cache, não tenta refresh
  if (!tokenCache) {
    return false
  }

  // Verifica se o erro é realmente por token expirado
  const isTokenExpired = isTokenExpiredError(error)

  if (!isTokenExpired) {
    return false
  }

  // Se o token expirou há muito tempo (mais de 1 hora), não tenta refresh
  const now = Date.now()
  const tokenAge = now - (tokenCacheExpiry - 5 * 60 * 1000)

  if (tokenAge > 60 * 60 * 1000) {
    return false
  }

  // Se chegou até aqui, pode tentar refresh (token expirado recentemente)
  return true
}

//* Função para verificar se o erro é por token expirado
const isTokenExpiredError = (error: any): boolean => {
  if (error.response?.status !== 401) {
    return false
  }

  const errorMessage = error.response?.data?.message || error.message || ''

  const isExpiredMessage =
    errorMessage.toLowerCase().includes('token') &&
    (errorMessage.toLowerCase().includes('expired') ||
      errorMessage.toLowerCase().includes('expirado') ||
      errorMessage.toLowerCase().includes('invalid') ||
      errorMessage.toLowerCase().includes('inválido'))

  if (isExpiredMessage) {
    return true
  }

  // Se não tem mensagem específica, verifica se há token no header da requisição
  const hasToken = error.config?.headers?.Authorization?.includes('Bearer')

  return hasToken
}

//* Função auxiliar para obter cookie de forma mais robusta
const getToken = async (): Promise<string | null> => {
  const now = Date.now()

  if (tokenCache && now < tokenCacheExpiry) {
    return tokenCache
  }

  try {
    const token = getCookie('jwtToken')

    if (token) {
      tokenCache = token as string
      tokenCacheExpiry = now + 5 * 60 * 1000

      return token as string
    }

    return null
  } catch (error) {
    console.error('Erro ao obter token:', error)

    return null
  }
}

//* Função para fazer refresh do token
const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshTokenPromise) {
    return refreshTokenPromise
  }

  isRefreshing = true
  refreshTokenPromise = performTokenRefresh()

  try {
    const result = await refreshTokenPromise

    return result
  } finally {
    isRefreshing = false
    refreshTokenPromise = null
  }
}

//* Função auxiliar para executar o refresh do token
const performTokenRefresh = async (): Promise<string | null> => {
  try {
    const response = await apiNode.post('/auth/refresh-token')

    if (response.data) {
      const { jwtToken, refreshToken: newRefreshToken } = response.data.data

      // Atualiza cookies
      setCookie('jwtToken', jwtToken, { path: '/' })
      setCookie('refreshToken', newRefreshToken, { path: '/' })

      // Atualiza cache
      tokenCache = jwtToken
      tokenCacheExpiry = Date.now() + 5 * 60 * 1000 // 5 minutos

      return jwtToken
    } else {
      // Se o refresh falhou, limpa o cache
      clearTokenCache()

      return null
    }
  } catch (error) {
    // Se houve erro, limpa o cache
    clearTokenCache()

    return null
  }
}

//* Configuração global do Axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SYMFONY_APP_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 15000
})

export const apiNode = axios.create({
  baseURL: '/api', // Pointing to the Next.js API
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 15000
})

//* Variável para controlar o contador de requisições
let requestCount = 0

//* Interceptor de request para adicionar token e controlar loading
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Incrementa o contador de requisições
    requestCount++

    // Dispara evento de loading se for a primeira requisição
    if (requestCount === 1 && typeof window !== 'undefined') {
      const event = new CustomEvent('loading', { detail: true })

      window.dispatchEvent(event)
    }

    try {
      const token = await getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Erro ao adicionar token na requisição:', error)
    }

    return config
  },
  error => {
    // Decrementa o contador em caso de erro na requisição
    requestCount--

    if (requestCount === 0 && typeof window !== 'undefined') {
      const event = new CustomEvent('loading', { detail: false })

      window.dispatchEvent(event)
    }

    return Promise.reject(error)
  }
)

//* Interceptor de request para apiNode - verifica viewerMode e controla loading
apiNode.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Incrementa o contador de requisições
    requestCount++

    // Dispara evento de loading se for a primeira requisição
    if (requestCount === 1 && typeof window !== 'undefined') {
      const event = new CustomEvent('loading', { detail: true })

      window.dispatchEvent(event)
    }

    // Verifica se está em viewerMode e se a requisição não é GET
    if (typeof window !== 'undefined') {
      const viewerMode = sessionStorage.getItem('modoViewer')
      const cpfConsulta = sessionStorage.getItem('cpfConsulta')
      const isViewerMode = viewerMode === 'true' && cpfConsulta
      const isNotGetRequest = config.method?.toLowerCase() !== 'get'

      // Só bloqueia se estiver em viewerMode E não for GET
      if (isViewerMode && isNotGetRequest) {
        // Decrementa o contador já que a requisição será rejeitada
        requestCount--

        if (requestCount === 0 && typeof window !== 'undefined') {
          const event = new CustomEvent('loading', { detail: false })

          window.dispatchEvent(event)
        }

        // Dispara evento customizado para mostrar toast de erro de permissão
        const event = new CustomEvent('showToast', {
          detail: {
            message: 'Esta ação é apenas para consulta e não altera informações do participante.',
            severity: 'warning',
            icon: createElement('i', { className: 'fa-kit fa-regular-hand-slash' }),
            styles: {
              backgroundColor: '#F7B731',
              color: '#000000',
              '& .MuiAlert-icon': {
                color: '#000000'
              },
              '& .MuiAlert-message': {
                color: '#000000'
              }
            }
          }
        })

        window.dispatchEvent(event)

        // Rejeita a promise para impedir a requisição
        return Promise.reject({
          success: false,
          unauthorized: true,
          message: 'Esta ação é apenas para consulta e não altera informações do participante.'
        })
      }
    }

    return config
  },
  error => {
    // Decrementa o contador em caso de erro na requisição
    requestCount--

    if (requestCount === 0 && typeof window !== 'undefined') {
      const event = new CustomEvent('loading', { detail: false })

      window.dispatchEvent(event)
    }

    return Promise.reject(error)
  }
)

//* Interceptor de response para tratar erros globais
api.interceptors.response.use(
  response => {
    // Decrementa o contador
    requestCount--

    if (requestCount === 0 && typeof window !== 'undefined') {
      const event = new CustomEvent('loading', { detail: false })

      window.dispatchEvent(event)
    }

    return response.data
  },
  async error => {
    // Decrementa o contador mesmo em caso de erro
    requestCount--

    if (requestCount === 0 && typeof window !== 'undefined') {
      const event = new CustomEvent('loading', { detail: false })

      window.dispatchEvent(event)
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.status, error.config?.url)
    }

    // Se for erro 401, verifica se deve tentar refresh do token
    // Só tenta refresh se for realmente por token expirado
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true

      // Verifica se devemos tentar refresh baseado no contexto e tipo de erro
      const shouldAttemptRefresh = tryTokenRefresh(error)

      if (!shouldAttemptRefresh) {
        // Não é token expirado ou não deve tentar refresh
        // Apenas rejeita o erro sem redirecionar
        return Promise.reject(error)
      }

      try {
        const newToken = await refreshToken()

        if (newToken) {
          // Atualiza o header da requisição original
          error.config.headers.Authorization = `Bearer ${newToken}`

          // Tenta a requisição novamente
          return api.request(error.config)
        }
      } catch (refreshError) {
        console.error('Erro ao fazer refresh:', refreshError)

        // Limpa o cache de tokens quando o refresh falha
        clearTokenCache()

        // Não redireciona automaticamente, apenas rejeita o erro
        return Promise.reject(new Error('Sessão expirada. Faça login novamente.'))
      }

      // Se o refresh falhou, limpa o cache mas não redireciona
      clearTokenCache()

      // Apenas rejeita o erro sem redirecionar
      return Promise.reject(new Error('Falha ao renovar token. Faça login novamente.'))
    }

    if (error.response?.status === 403 || error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Dispara evento customizado para mostrar toast de erro de permissão
        const event = new CustomEvent('showToast', {
          detail: {
            message: 'Esta ação é apenas para consulta e não altera informações do participante.',
            severity: 'warning',
            icon: createElement('i', { className: 'fa-kit fa-regular-hand-slash' }),
            styles: {
              backgroundColor: '#F7B731',
              color: '#000000',
              '& .MuiAlert-icon': {
                color: '#000000'
              },
              '& .MuiAlert-message': {
                color: '#000000'
              }
            }
          }
        })

        window.dispatchEvent(event)

        // Também rejeita a promise com a mensagem de erro
        return Promise.reject({
          success: false,
          unauthorized: true,
          message: 'Esta ação é apenas para consulta e não altera informações do participante.'
        })
      }
    }

    // Para erros 422 (validação), preserva o erro original do axios
    // para que os serviços possam acessar error.response.data.errors
    if (error.response?.status === 422) {
      return Promise.reject(error)
    }

    const message = error.response?.data?.message || error.message || 'Erro na requisição'

    return Promise.reject(new Error(message))
  }
)

//* Interceptor de response para apiNode
apiNode.interceptors.response.use(
  response => {
    // Decrementa o contador
    requestCount--

    if (requestCount === 0 && typeof window !== 'undefined') {
      const event = new CustomEvent('loading', { detail: false })

      window.dispatchEvent(event)
    }

    // Retorna a resposta completa para manter compatibilidade
    return response
  },
  error => {
    // Decrementa o contador mesmo em caso de erro
    requestCount--

    if (requestCount === 0 && typeof window !== 'undefined') {
      const event = new CustomEvent('loading', { detail: false })

      window.dispatchEvent(event)
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('API Node Error:', error)
    }

    // Se o erro já foi tratado pelo interceptor de request (viewerMode), apenas repassa
    if (error.unauthorized) {
      return Promise.reject(error)
    }

    // Rotas que não devem ser interceptadas (preservar erro original)
    const url = error.config?.url || ''
    const routesToSkip = ['/users/check-senha']

    if (routesToSkip.some(route => url.includes(route))) {
      // Para essas rotas, retorna o erro original sem transformar
      return Promise.reject(error)
    }

    const message =
      error.response?.data?.message || error.response?.data?.error || error.message || 'Erro na requisição'

    return Promise.reject(new Error(message))
  }
)
