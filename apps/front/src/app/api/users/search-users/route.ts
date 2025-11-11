import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { decryptCpf } from '@/utils/crypto'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Termo de busca deve ter pelo menos 2 caracteres' }, { status: 400 })
  }

  try {
    const searchTerm = query.trim().toLowerCase()

    // Buscar todos os usuários e filtrar no código para permitir busca parcial por CPF
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        funpresp: true
      },
      take: 1000
    })

    // Filtrar usuários que correspondem ao termo de busca
    const filteredUsers = allUsers.filter(user => {
      const decryptedCpf = decryptCpf(user.cpf)
      const nameMatch = user.name.toLowerCase().includes(searchTerm)
      const cpfMatch = decryptedCpf.includes(searchTerm)

      return nameMatch || cpfMatch
    })

    const usersWithDecryptedCpf = filteredUsers.map(user => ({
      ...user,
      cpf: decryptCpf(user.cpf),
      cpfEncrypted: user.cpf // Manter o CPF criptografado original
    }))

    return NextResponse.json(usersWithDecryptedCpf)
  } catch (error) {
    console.error('Erro na busca de usuários:', error)

    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}
