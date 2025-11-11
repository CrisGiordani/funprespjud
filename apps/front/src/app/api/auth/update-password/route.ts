import { NextResponse } from 'next/server'

import * as bcrypt from 'bcrypt'

import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { cpf, senha } = await request.json()

    if (!cpf || !senha) {
      return NextResponse.json({ message: 'CPF e senha são obrigatórios' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: {
        cpf: cpf // CPF já vem criptografado
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(senha, 10)

    await prisma.user.update({
      where: {
        cpf: cpf // CPF já vem criptografado
      },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    })

    // Deletar o token de verificação após a senha ser atualizada
    await prisma.verifyCodes.deleteMany({
      where: {
        cpf: cpf
      }
    })

    return NextResponse.json({ message: 'Senha atualizada com sucesso' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
