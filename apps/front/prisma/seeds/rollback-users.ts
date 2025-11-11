import { prisma } from '@/lib/prisma'

async function rollbackUsers() {
  try {
    console.log('🔄 Iniciando rollback de usuários...')

    // Busca todos os usuários que começam com "getec" no email
    const usersToDelete = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'getec'
        }
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (usersToDelete.length === 0) {
      console.log('ℹ️  Nenhum usuário encontrado com email começando com "getec"')
      return
    }

    console.log(`📊 Encontrados ${usersToDelete.length} usuários para remover:`)

    // Lista os usuários que serão removidos
    usersToDelete.forEach(user => {
      console.log(`   - ${user.email} (${user.name})`)
    })

    console.log('\n⚠️  ATENÇÃO: Esta operação é irreversível!')
    console.log('   Os seguintes usuários serão PERMANENTEMENTE removidos:')

    // Confirmação manual (pode ser removida se quiser automatizar)
    console.log('\n🔄 Iniciando remoção...')

    let successCount = 0
    let errorCount = 0

    // Remove cada usuário
    for (const user of usersToDelete) {
      try {
        await prisma.user.delete({
          where: {
            id: user.id
          }
        })

        console.log(`✅ Usuário removido: ${user.email}`)
        successCount++
      } catch (error) {
        console.error(`❌ Erro ao remover usuário ${user.email}:`, error)
        errorCount++
      }
    }

    console.log('\n📈 Resumo do rollback:')
    console.log(`✅ Usuários removidos com sucesso: ${successCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    console.log(`📊 Total processado: ${usersToDelete.length}`)
  } catch (error) {
    console.error('❌ Erro durante o rollback:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Função para rollback automático (sem confirmação)
async function rollbackUsersAuto() {
  try {
    console.log('🔄 Iniciando rollback automático de usuários...')

    // Busca todos os usuários que começam com "getec" no email
    const usersToDelete = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'getec'
        }
      }
    })

    if (usersToDelete.length === 0) {
      console.log('ℹ️  Nenhum usuário encontrado com email começando com "getec"')
      return
    }

    console.log(`📊 Encontrados ${usersToDelete.length} usuários para remover`)

    // Remove todos os usuários de uma vez
    const deleteResult = await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'getec'
        }
      }
    })

    console.log(`✅ Rollback concluído! ${deleteResult.count} usuários removidos`)
  } catch (error) {
    console.error('❌ Erro durante o rollback:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executa o rollback se o arquivo for executado diretamente
if (require.main === module) {
  // Para rollback manual (com logs detalhados)
  rollbackUsers()
    .then(() => {
      console.log('🎉 Rollback concluído!')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Erro fatal:', error)
      process.exit(1)
    })
}

export { rollbackUsers, rollbackUsersAuto }
