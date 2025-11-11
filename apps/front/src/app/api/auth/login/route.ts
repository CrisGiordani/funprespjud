import { NextResponse } from 'next/server'

import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import type { JWTPayload, JWTRefreshPayload } from '@/types/jwtPayloadTypes'
import { prisma } from '@/lib/prisma'
import { encryptCpf } from '@/utils/crypto'
import { jwtTokenConfig, refreshTokenConfig } from '@/lib/cookieConfig'

export async function POST(request: Request) {
  const { cpf, senha } = await request.json()

  try {
    const SECRET_KEY = process.env.JWT_SECRET

    if (!SECRET_KEY) throw new Error('JWT_SECRET inexistente')

    const SECRET_REFRESH_KEY = process.env.JWT_REFRESH_SECRET

    if (!SECRET_REFRESH_KEY) throw new Error('JWT_REFRESH_SECRET inexistente')

    const criptCpf = encryptCpf(cpf)

    const result = await prisma.user.findUnique({
      where: {
        cpf: criptCpf
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

    if (!result) {
      return NextResponse.json({ message: 'Verifique as credenciais e tente novamente' }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(senha, result.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Verifique as credenciais e tente novamente' }, { status: 401 })
    }

    const userWithProfile: JWTPayload = {
      id: result.id,
      nome: result.name,
      cpf: result.cpf,
      email: result.email,
      roles: result.role,
      sexo: result.profile?.sexo
    }

    const RefreshPayload: JWTRefreshPayload = {
      jti: crypto.randomUUID()
    }

    const jwtToken = jwt.sign(userWithProfile, SECRET_KEY, { expiresIn: '8h' })
    const refreshToken = jwt.sign(RefreshPayload, SECRET_REFRESH_KEY, { expiresIn: '30d' })

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

    try {
      await prisma.refreshToken.upsert({
        where: {
          idUser: result.id
        },
        update: {
          tokenHash: refreshTokenHash,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        },
        create: {
          id: RefreshPayload.jti,
          idUser: result.id,
          tokenHash: refreshTokenHash,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        }
      })
    } catch (err) {
      console.error('Erro ao criar refresh token:')
    }

    const response = NextResponse.json({
      success: true,
      roles: userWithProfile.roles // Retornar as roles para o frontend
    })

    const roles = jwt.sign({ roles: userWithProfile.roles }, SECRET_KEY, { expiresIn: '8h' })

    // Define os cookies na resposta usando configurações centralizadas
    response.cookies.set('roles', roles)
    response.cookies.set('jwtToken', jwtToken, jwtTokenConfig)
    response.cookies.set('refreshToken', refreshToken, refreshTokenConfig)

    return response
  } catch (err) {
    console.error('Erro no login:', err)

    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 })
  }
}
