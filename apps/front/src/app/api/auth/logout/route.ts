import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import * as jwt from 'jsonwebtoken'

import { prisma } from '@/lib/prisma'
import type { JWTRefreshPayload } from '@/types/jwtPayloadTypes'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const refreshTokenFromCookie = request.cookies.get('refreshToken')?.value

    // Se há refresh token, invalida no banco de dados
    if (refreshTokenFromCookie) {
      try {
        const refreshTokenPayload = jwt.verify(
          refreshTokenFromCookie,
          process.env.JWT_REFRESH_SECRET!
        ) as JWTRefreshPayload

        // Invalida o refresh token no banco
        await prisma.refreshToken.updateMany({
          where: {
            id: refreshTokenPayload.jti
          },
          data: {
            isValid: false
          }
        })
      } catch (error) {
        // Se não conseguir decodificar o token, continua com o logout
        console.log('Token de refresh inválido ou expirado, continuando logout')
      }
    }
  } catch (error) {
    console.error('Erro ao invalidar refresh token:', error)
  }

  const response = NextResponse.json({
    message: 'Logout realizado com sucesso',
    clearSessionStorage: true
  })

  response.cookies.delete('jwtToken')
  response.cookies.delete('refreshToken')
  response.cookies.delete('viewerMode')

  return response
}
