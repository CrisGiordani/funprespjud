import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { decryptCpf } from '@/utils/crypto'

export async function GET() {
  try {
    // Log do banco que está sendo usado (sem mostrar senha)
    const dbUrl = process.env.DATABASE_URL || 'não configurado'
    const dbUrlSafe = dbUrl.replace(/:[^:@]+@/, ':****@') // Esconde a senha
    
    // Primeiro, contar quantos usuários existem
    const totalCount = await prisma.user.count({
      where: {
        funpresp: false
      }
    })
    
    // Verificar se há muitos usuários e limitar
    const limit = totalCount > 100 ? 100 : totalCount
    
    const users = await prisma.user.findMany({
      where: {
        funpresp: false
      },
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
      },
      orderBy: {
        name: 'asc'
      },
      take: limit
    })

    const usersDecrypted = users.map(user => {
      try {
        return {
          ...user,
          cpf: decryptCpf(user.cpf),
          cpfEncrypted: user.cpf // Manter o CPF criptografado original
        }
      } catch (error) {
        // Se falhar ao descriptografar, mantém o CPF criptografado e adiciona flag de erro
        console.error(`Erro ao descriptografar CPF do usuário ${user.id}:`, error)
        
        return {
          ...user,
          cpf: '[ERRO AO DESCRIPTOGRAFAR]',
          cpfEncrypted: user.cpf,
          decryptError: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      }
    })

    // Retornar com informações de debug
    return NextResponse.json({
      users: usersDecrypted,
      debug: {
        totalCount,
        returnedCount: usersDecrypted.length,
        database: dbUrlSafe.split('@')[1] || 'desconhecido',
        limit
      }
    })
  } catch (error) {
    console.error('Erro ao buscar usuários sem trust:', error)

    return NextResponse.json({ 
      error: 'Erro ao buscar usuários',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

