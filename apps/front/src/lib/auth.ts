'use server'

import { cookies } from 'next/headers'

import { getCookie } from 'cookies-next'
import { jwtVerify } from 'jose'

function getCookieByKey(key: string) {
  // Tenta obter o token usando diferentes métodos
  let token = getCookie(key)

  // Se não conseguiu com getCookie, tenta com cookies() do Next.js
  if (!token) {
    try {
      const cookieStore = cookies()

      token = cookieStore.get(key)?.value
    } catch (cookieError) {
      console.error('Erro ao obter cookie com cookies()')
    }
  }

  return token
}

export async function getUserFromToken() {
  try {
    const token = getCookieByKey('jwtToken')

    if (!token) {
      // Se não há JWT, tenta fazer refresh
      return await attemptRefreshToken()
    }

    // Verifica o token JWT com a API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.ok) {
      const userData = await response.json()

      const rolesHash = getCookieByKey('roles') as string

      let roles = userData.roles

      if (rolesHash) {
        const { payload } = await jwtVerify(rolesHash, new TextEncoder().encode(process.env.JWT_SECRET))

        roles = payload.roles
      }

      return { ...userData, roles: roles }
    } else {
      // Token inválido ou expirado, tenta fazer refresh
      return await attemptRefreshToken()
    }
  } catch (error) {
    console.error('Erro ao verificar token:', error)

    // Em caso de erro, tenta fazer refresh
    return await attemptRefreshToken()
  }
}

// Função para tentar fazer refresh do token
const attemptRefreshToken = async (): Promise<any> => {
  try {
    // Tenta obter o refresh token usando diferentes métodos
    let refreshToken = getCookie('refreshToken')

    // Se não conseguiu com getCookie, tenta com cookies() do Next.js
    if (!refreshToken) {
      try {
        const cookieStore = cookies()

        refreshToken = cookieStore.get('refreshToken')?.value
      } catch (cookieError) {
        console.error('Erro ao obter refresh token com cookies():', cookieError)
      }
    }

    if (!refreshToken) {
      return null
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.ok) {
      const result = await response.json()

      if (result.data?.jwtToken) {
        // Novo JWT foi gerado, agora pode verificar novamente
        const verifyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${result.data.jwtToken}`
            }
          }
        )

        if (verifyResponse.ok) {
          const userData = await verifyResponse.json()

          return userData
        }
      }
    }

    return null
  } catch (error) {
    console.error('Erro ao fazer refresh do token:', error)

    return null
  }
}
