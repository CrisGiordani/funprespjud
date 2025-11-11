import { randomUUID } from 'crypto'

import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

import { prisma } from '@/lib/prisma'

import type { JWTPayload, JWTRefreshPayload } from '@/types/jwtPayloadTypes'
import { jwtTokenConfig, refreshTokenConfig } from '@/lib/cookieConfig'

// Função utilitária para gerar novos tokens e limpar tokens antigos
async function generateNewTokensAndCleanup(userId: string, userData: any) {
  const userWithProfile: JWTPayload = {
    id: userData.id,
    nome: userData.name,
    cpf: userData.cpf,
    email: userData.email,
    roles: userData.role,
    sexo: userData.profile?.sexo || undefined
  }

  const RefreshPayload: JWTRefreshPayload = {
    jti: randomUUID()
  }

  const jwtToken = jwt.sign(userWithProfile, process.env.JWT_SECRET!, { expiresIn: '8h' })
  const refreshToken = jwt.sign(RefreshPayload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' })

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

  // Usar upsert para evitar erro de constraint de unicidade
  await prisma.refreshToken.upsert({
    where: {
      idUser: userId
    },
    update: {
      id: RefreshPayload.jti,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      isValid: true,
      createdAt: new Date()
    },
    create: {
      id: RefreshPayload.jti,
      idUser: userId,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      isValid: true
    }
  })

  return { jwtToken, refreshToken }
}

export async function POST(request: NextRequest) {
  const SECRET_REFRESH_KEY = process.env.JWT_REFRESH_SECRET

  if (!SECRET_REFRESH_KEY) {
    console.error('JWT_REFRESH_SECRET não configurado')
    throw new Error('JWT_REFRESH_SECRET inexistente')
  }

  const SECRET_KEY = process.env.JWT_SECRET

  if (!SECRET_KEY) {
    console.error('JWT_SECRET não configurado')
    throw new Error('JWT_SECRET inexistente')
  }

  const refreshTokenFromCookie = request.cookies.get('refreshToken')?.value

  if (!refreshTokenFromCookie) return NextResponse.json({ message: 'Refresh token não encontrado' }, { status: 401 })

  try {
    const refreshTokenPayload = jwt.verify(refreshTokenFromCookie, SECRET_REFRESH_KEY) as JWTRefreshPayload

    const refreshTokenRecorded = await prisma.refreshToken.findUnique({
      where: {
        id: refreshTokenPayload.jti,
        expiresAt: {
          gt: new Date()
        },
        isValid: true
      }
    })

    if (!refreshTokenRecorded)
      return NextResponse.json({ message: 'Refresh token inválido ou expirado' }, { status: 401 })

    // Verifica hash do token existente
    const isRefreshTokenValid = await bcrypt.compare(refreshTokenFromCookie, refreshTokenRecorded.tokenHash)

    if (!isRefreshTokenValid) return NextResponse.json({ message: 'Token adulterado' }, { status: 401 })

    // Busca usuário
    const result = await prisma.user.findUnique({
      where: {
        id: refreshTokenRecorded.idUser
      },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        role: true,
        password: true,
        profile: {
          select: {
            sexo: true
          }
        }
      }
    })

    if (!result) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })

    const { jwtToken, refreshToken } = await generateNewTokensAndCleanup(result.id, result)

    const response = NextResponse.json(
      {
        message: 'Token atualizado com sucesso',
        data: { jwtToken, refreshToken }
      },
      { status: 200 }
    )

    response.cookies.set('jwtToken', jwtToken, jwtTokenConfig)
    response.cookies.set('refreshToken', refreshToken, refreshTokenConfig)

    return response
  } catch (error) {
    console.error('Erro no refresh token:', error)

    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 })
  }
}
