import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { decryptCpf } from '@/utils/crypto'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const cpf = searchParams.get('cpf')

  if (!id && !cpf) {
    return NextResponse.json({ error: 'ID ou CPF não encontrado' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: id ? { id } : { cpf: cpf! },
      select: {
        id: true,
        name: true,
        email: true,
        funpresp: true,
        orgao: true,
        cpf: true,
        role: true,
        profile: {
          select: {
            telefone: true,
            sexo: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const userWithDecryptedCpf = {
      ...user,
      cpf: decryptCpf(user.cpf),
      cpfEncrypted: user.cpf
    }

    return NextResponse.json(userWithDecryptedCpf)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 })
  }
}
