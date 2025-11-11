import { NextResponse } from 'next/server'

import * as bcrypt from 'bcrypt'

import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { cpf, senha } = await request.json()

    const user = await prisma.user.findUnique({
      where: { cpf: cpf }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Usuário não possui senha cadastrada' }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(senha, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
    }

    return NextResponse.json({ message: 'Senha correta' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
