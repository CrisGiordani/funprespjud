import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { decryptCpf, encryptCpf } from '@/utils/crypto'

export async function POST(request: Request) {
  try {
    const { cpfs } = await request.json()

    if (!Array.isArray(cpfs) || cpfs.length === 0) {
      return NextResponse.json({ error: 'Lista de CPFs inválida' }, { status: 400 })
    }

    // Criptografar os CPFs para busca no banco
    const encryptedCpfs = cpfs.map(cpf => encryptCpf(cpf))

    const users = await prisma.user.findMany({
      where: {
        cpf: {
          in: encryptedCpfs
        }
      },
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

    const usersWithDecryptedCpf = users.map(user => ({
      ...user,
      cpf: decryptCpf(user.cpf),
      cpfEncrypted: user.cpf // Manter o CPF criptografado original
    }))

    return NextResponse.json(usersWithDecryptedCpf)
  } catch (error) {
    console.error('Erro ao buscar usuários por CPFs:', error)

    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}
