import { prisma } from '@/lib/prisma'

async function seedAllPermissionsAndRoles() {
  console.log('🚀 Iniciando seed completa de permissões, roles e relacionamentos...')

  try {
    // 1. Executar seed de permissões e roles
    console.log('\n📝 Executando seed de permissões e roles...')
    const { default: seedPermissionsAndRoles } = await import('./seed-permissions-and-roles')
    await seedPermissionsAndRoles()

    // 2. Executar seed de relacionamentos
    console.log('\n🔗 Executando seed de relacionamentos...')
    const { default: seedRolePermissions } = await import('./seed-role-permissions')
    await seedRolePermissions()

    console.log('\n🎉 Seed completa concluída com sucesso!')

    // Mostrar resumo final
    const permissionsCount = await prisma.permission.count()
    const rolesCount = await prisma.role.count()
    const relationshipsCount = await prisma.rolePermission.count()

    console.log('\n📊 Resumo final:')
    console.log(`   • ${permissionsCount} permissões`)
    console.log(`   • ${rolesCount} roles`)
    console.log(`   • ${relationshipsCount} relacionamentos`)
  } catch (error) {
    console.error('❌ Erro durante a seed completa:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar a seed se o arquivo for executado diretamente
if (require.main === module) {
  seedAllPermissionsAndRoles().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

export default seedAllPermissionsAndRoles
