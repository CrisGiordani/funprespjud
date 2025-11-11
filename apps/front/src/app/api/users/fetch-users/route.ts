import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { decryptCpf } from '@/utils/crypto'

// import type { RoleEnum } from '@/generated/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        funpresp: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    const usersDecrypted = users.map(user => {
      return {
        ...user,
        cpf: decryptCpf(user.cpf),
        cpfEncrypted: user.cpf // Manter o CPF criptografado original
      }
    })

    return NextResponse.json(usersDecrypted)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}
