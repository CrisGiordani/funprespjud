import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { cpf, verificationCode } = await request.json()

    if (!cpf || !verificationCode) {
      return NextResponse.json({ message: 'CPF e código de verificação são obrigatórios' }, { status: 400 })
    }

    const verifyCode = await prisma.verifyCodes.findFirst({
      where: {
        id: verificationCode,
        cpf: cpf, // CPF já vem criptografado
        expiresAt: {
          gt: new Date() // Verificar se não expirou
        }
      }
    })

    if (!verifyCode) {
      return NextResponse.json({ message: 'Código de verificação inválido ou expirado' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: {
        cpf: cpf // CPF já vem criptografado
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: 'Código de verificação válido',
        email: user.email
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao validar código de verificação:', error)

    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
