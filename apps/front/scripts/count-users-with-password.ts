#!/usr/bin/env tsx

/**
 * Script para contar usuários com senha cadastrada
 * 
 * Este script conta:
 * - Total de usuários cadastrados
 * - Quantos têm senha cadastrada (hash bcrypt válido)
 * - Percentual de usuários com senha
 */

import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

/**
 * Verifica se uma senha é um hash bcrypt válido
 * Hashes bcrypt começam com $2a$, $2b$ ou $2y$
 */
function isBcryptHash(password: string | null | undefined): boolean {
  if (!password || password.trim() === '') {
    return false
  }
  
  // Verifica se começa com prefixo bcrypt válido
  return /^\$2[ayb]\$/.test(password)
}

async function countUsersWithPassword() {
  try {
    console.log('🔍 Analisando usuários...\n')

    // Busca todos os usuários
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        password: true,
        createdAt: true,
        role: true
      }
    })

    const totalUsers = allUsers.length
    
    // Conta usuários com senha válida
    const usersWithPassword = allUsers.filter(user => isBcryptHash(user.password))
    const usersWithoutPassword = allUsers.filter(user => !isBcryptHash(user.password))

    const countWithPassword = usersWithPassword.length
    const countWithoutPassword = usersWithoutPassword.length

    // Calcula percentuais
    const percentWithPassword = totalUsers > 0 
      ? ((countWithPassword / totalUsers) * 100).toFixed(2)
      : '0.00'
    
    const percentWithoutPassword = totalUsers > 0
      ? ((countWithoutPassword / totalUsers) * 100).toFixed(2)
      : '0.00'

    // Exibe resultados
    console.log('📊 ESTATÍSTICAS DE SENHAS\n')
    console.log('═'.repeat(50))
    console.log(`Total de usuários cadastrados:     ${totalUsers}`)
    console.log(`Usuários COM senha cadastrada:      ${countWithPassword} (${percentWithPassword}%)`)
    console.log(`Usuários SEM senha cadastrada:      ${countWithoutPassword} (${percentWithoutPassword}%)`)
    console.log('═'.repeat(50))
    console.log()

    // Detalhes por role (opcional)
    const roleStats: Record<string, { total: number; withPassword: number; withoutPassword: number }> = {}
    
    allUsers.forEach(user => {
      user.role.forEach(role => {
        if (!roleStats[role]) {
          roleStats[role] = { total: 0, withPassword: 0, withoutPassword: 0 }
        }
        
        roleStats[role].total++

        if (isBcryptHash(user.password)) {
          roleStats[role].withPassword++
        } else {
          roleStats[role].withoutPassword++
        }
      })
    })

    if (Object.keys(roleStats).length > 0) {
      console.log('📋 ESTATÍSTICAS POR PERFIL\n')
      Object.entries(roleStats).forEach(([role, stats]) => {
        const rolePercent = stats.total > 0 
          ? ((stats.withPassword / stats.total) * 100).toFixed(2)
          : '0.00'

        console.log(`${role}:`)
        console.log(`  Total: ${stats.total} | Com senha: ${stats.withPassword} (${rolePercent}%) | Sem senha: ${stats.withoutPassword}`)
      })
      console.log()
    }

    // Lista usuários sem senha (opcional, limitado a 10)
    if (countWithoutPassword > 0) {
      console.log('⚠️  USUÁRIOS SEM SENHA (primeiros 10)\n')
      usersWithoutPassword.slice(0, 10).forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - CPF: ${user.cpf.substring(0, 6)}...`)
      })

      if (countWithoutPassword > 10) {
        console.log(`\n... e mais ${countWithoutPassword - 10} usuários sem senha`)
      }

      console.log()
    }

  } catch (error) {
    console.error('❌ Erro ao processar dados:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executa o script
countUsersWithPassword()
  .then(() => {
    console.log('✅ Análise concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })

