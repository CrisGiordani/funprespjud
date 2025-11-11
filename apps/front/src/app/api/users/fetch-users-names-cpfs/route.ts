import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { decryptCpf } from '@/utils/crypto'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        cpf: true,
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    const usersWithDecryptedCpf = users.map(user => ({
      name: user.name,
      cpf: decryptCpf(user.cpf),
      role: user.role
    }))

    return NextResponse.json(usersWithDecryptedCpf)
  } catch (error) {
    console.error('Erro ao buscar nomes e CPFs dos usuários:', error)

    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}
