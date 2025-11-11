import { getCookie, setCookie } from 'cookies-next'

import { clearTokenCache, apiNode } from '@/lib/api'

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getCookie('jwtToken')

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (response.status === 401) {
    try {
      const refreshRes = await apiNode.post('/auth/refresh-token')

      if (refreshRes.data) {
        const { jwtToken, refreshToken } = refreshRes.data.data

        // Atualiza os cookies no cliente
        setCookie('jwtToken', jwtToken, {
          httpOnly: false, // Deve ser false para o cliente poder acessar
          path: '/',
          maxAge: 8 * 60 * 60 * 1000 // 8 horas
        })

        setCookie('refreshToken', refreshToken, {
          httpOnly: false, // Deve ser false para o cliente poder acessar
          path: '/',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
        })

        // Tenta a requisição original novamente com o novo token
        const newResponse = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${jwtToken}`
          }
        })

        return newResponse
      } else {
        console.error('Detalhes do erro:', refreshRes.data)
        clearTokenCache()
        
        throw new Error('Sessão expirada. Por favor, faça login novamente.')
      }
    } catch (error) {
      clearTokenCache()

      throw new Error('Erro ao renovar sessão. Por favor, faça login novamente.')
    }
  }

  if (response.status === 403) {
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }

    throw new Error('Acesso negado. Você não tem permissão para acessar este recurso.')
  }

  return response
}
