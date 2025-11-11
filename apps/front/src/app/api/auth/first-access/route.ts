import { NextResponse } from 'next/server'

import * as bcrypt from 'bcrypt'

import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { cpf, email, token, senha } = await request.json()

    if (!cpf || !email || !token || !senha) {
      return NextResponse.json({ message: 'CPF, email, token e senha são obrigatórios' }, { status: 400 })
    }

    const verifyCode = await prisma.verifyCodes.findFirst({
      where: {
        id: token,
        cpf: cpf, // CPF já vem criptografado
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!verifyCode) {
      return NextResponse.json({ message: 'Token de primeiro acesso inválido ou expirado' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: {
        cpf: cpf // CPF já vem criptografado
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ message: 'Email não confere com o cadastro' }, { status: 400 })
    }

    if (user.password) {
      return NextResponse.json({ message: 'Usuário já possui senha cadastrada' }, { status: 409 })
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10)

    // Atualizar o usuário com a nova senha
    await prisma.user.update({
      where: {
        cpf: cpf // CPF já está criptografado
      },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    })

    // Deletar o token usado
    await prisma.verifyCodes.delete({
      where: {
        id: token
      }
    })

    return NextResponse.json({ message: 'Primeiro acesso concluído com sucesso' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
