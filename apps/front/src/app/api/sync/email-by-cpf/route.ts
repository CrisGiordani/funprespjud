import { NextResponse } from 'next/server'

import * as jwt from 'jsonwebtoken'

import { api } from '@/lib/api'
import { prisma } from '@/lib/prisma'

import type { JWTPayload } from '@/types/jwtPayloadTypes'

/**
 * Endpoint para sincronizar email de um usuário específico
 * Busca o email do participante no ERP e atualiza na base Auth
 */
export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('Authorization')

    if (!authorization) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 })
    }

    const token = authorization.split(' ')[1]
    const SECRET_KEY = process.env.JWT_SECRET

    if (!SECRET_KEY) {
      return NextResponse.json({ message: 'Erro de configuração do servidor' }, { status: 500 })
    }

    // Verifica se o usuário tem permissão (ADMIN ou OPERATOR)
    const decoded = jwt.verify(token, SECRET_KEY) as JWTPayload
    const roles = decoded.roles || []

    if (!roles.includes('USER_ADMIN') && !roles.includes('USER_OPERATOR')) {
      return NextResponse.json(
        { message: 'Acesso negado. Apenas administradores podem executar esta ação.' },
        { status: 403 }
      )
    }

    const { cpf } = await request.json()

    if (!cpf) {
      return NextResponse.json({ message: 'CPF é obrigatório' }, { status: 400 })
    }

    // Busca usuário na base Auth
    const user = await prisma.user.findUnique({
      where: { cpf }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado na base de autenticação' }, { status: 404 })
    }

    // Busca dados do participante no ERP via API interna Symfony
    try {
      // A API Symfony espera receber o CPF criptografado (como está no banco)
      // Usa o mesmo token JWT do admin para autenticar na API Symfony
      const participanteResponse = await api.get(`/participantes/${cpf}/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // A API Symfony pode retornar em dois formatos:
      // 1. Formato com wrapper: { success: true, data: { email: "..." } }
      // 2. Formato direto: { email: "...", nome: "..." }
      const responseData = participanteResponse.data

      // Extrai o email da resposta (suporta ambos os formatos)
      const emailErp = responseData?.data?.email || responseData?.email

      if (!emailErp) {
        return NextResponse.json({ message: 'Email não encontrado no ERP para este participante' }, { status: 404 })
      }

      // Verifica se o email mudou
      if (user.email === emailErp.toLowerCase()) {
        return NextResponse.json(
          {
            message: 'Email já está sincronizado',
            emailAtual: user.email.toLowerCase()
          },
          { status: 200 }
        )
      }

      // Atualiza email na base Auth
      await prisma.user.update({
        where: { cpf },
        data: {
          email: emailErp.toLowerCase(),
          updatedAt: new Date()
        }
      })

      return NextResponse.json(
        {
          message: 'Email sincronizado com sucesso',
          emailAnterior: user.email.toLowerCase(),
          emailNovo: emailErp.toLowerCase()
        },
        { status: 200 }
      )
    } catch (erpError: any) {
      console.error('Erro ao sincronizar email do participante:', erpError.message)

      return NextResponse.json({ message: 'Erro ao buscar dados do participante no ERP' }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Erro ao sincronizar email:', error.message)

    return NextResponse.json({ message: 'Erro interno ao sincronizar email' }, { status: 500 })
  }
}
