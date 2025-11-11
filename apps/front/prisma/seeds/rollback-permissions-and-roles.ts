import { prisma } from '@/lib/prisma'

async function rollbackPermissionsAndRoles() {
  console.log('🔄 Iniciando rollback de permissões e papéis...')

  try {
    // Remover permissões
    console.log('🗑️ Removendo permissões...')
    await prisma.permission.deleteMany()
    console.log('✅ Permissões removidas')

    // Remover papéis
    console.log('🗑️ Removendo papéis...')
    await prisma.role.deleteMany()
    console.log('✅ Papéis removidos')

    console.log('🎉 Rollback de permissões e papéis concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o rollback:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o rollback se o arquivo for executado diretamente
if (require.main === module) {
  rollbackPermissionsAndRoles().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

export default rollbackPermissionsAndRoles
