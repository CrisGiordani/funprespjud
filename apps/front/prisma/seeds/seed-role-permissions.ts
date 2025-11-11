import { prisma } from '@/lib/prisma'

async function seedRolePermissions() {
  console.log('🌱 Iniciando seed de relacionamentos entre roles e permissões...')

  try {
    // Verificar conexão com o banco
    await prisma.$connect()
    console.log('✅ Conexão com banco estabelecida')
    // Limpar relacionamentos existentes
    await prisma.rolePermission.deleteMany()
    console.log('🧹 Relacionamentos existentes removidos')

    // Buscar todas as permissões e roles existentes
    const permissions = await prisma.permission.findMany()
    const roles = await prisma.role.findMany()

    console.log(`📋 Encontradas ${permissions.length} permissões e ${roles.length} roles`)

    // Mapear permissões por nome para facilitar a busca
    const permissionMap = new Map(permissions.map(p => [p.name, p.id]))

    // Mapear roles por nome para facilitar a busca
    const roleMap = new Map(roles.map(r => [r.name, r.id]))

    // Definir os relacionamentos baseados em ALL_PAPEIS_E_PERMISSOES
    const rolePermissionsMap = {
      // Papeis de usuário
      USER_ADMIN: ['FAZER_SIMULACAO', 'ALL_ROLES_AND_PERMISSIONS'],
      USER_OPERATOR: ['FAZER_SIMULACAO'],
      USER_PARTICIPANT: [],
      USER_SPONSOR: ['FAZER_SIMULACAO'],

      // Situações de participante
      PATROCINADO: ['FAZER_SIMULACAO'],
      'MUDANÇA DE PATROCINADOR': ['FAZER_SIMULACAO'],
      AUTOPATROCINADO: ['FAZER_SIMULACAO'],
      ASSISTIDO: [],
      CANCELADO: [],
      VINCULADO: ['FAZER_SIMULACAO'],
      'BPD - SALDO': ['FAZER_SIMULACAO'],
      'BPD - DEPOSITO': ['FAZER_SIMULACAO'],
      'PATROCINADO - CJ/CC/FC': ['FAZER_SIMULACAO'],
      ENCERRADO: [],

      // Casos individuais especiais
      ['8203522025fdfd610c1cca160f06bf99']: ['VER_EMPRESTIMO'],
      ['c4ecc5681d99dce1b8f178dd12469026']: ['VER_EMPRESTIMO'],
      TJDFT: ['VER_EMPRESTIMO']
    }

    let totalRelationships = 0

    // Criar relacionamentos
    for (const [roleName, permissionNames] of Object.entries(rolePermissionsMap)) {
      const roleId = roleMap.get(roleName)

      if (!roleId) {
        console.warn(`⚠️ Role "${roleName}" não encontrado no banco`)
        continue
      }

      for (const permissionName of permissionNames) {
        const permissionId = permissionMap.get(permissionName)

        if (!permissionId) {
          console.warn(`⚠️ Permissão "${permissionName}" não encontrada no banco`)
          continue
        }

        try {
          await prisma.rolePermission.create({
            data: {
              roleId: roleId,
              permissionId: permissionId
            }
          })

          totalRelationships++
          console.log(`✅ Relacionamento criado: ${roleName} -> ${permissionName}`)
        } catch (error) {
          console.error(`❌ Erro ao criar relacionamento ${roleName} -> ${permissionName}:`, error)
        }
      }
    }

    console.log(`🎉 Seed de relacionamentos concluída! ${totalRelationships} relacionamentos criados`)

    // Mostrar resumo final
    const finalCount = await prisma.rolePermission.count()
    console.log(`📊 Total de relacionamentos no banco: ${finalCount}`)
  } catch (error: any) {
    console.error('❌ Erro durante a seed de relacionamentos:', error)

    if (error.code === 'P1001') {
      console.error('\n💡 Dica: Verifique se:')
      console.error('   1. O banco de dados está rodando')
      console.error('   2. A variável DATABASE_URL está configurada no arquivo .env')
      console.error('   3. As credenciais estão corretas')
      console.error('\n📖 Consulte DATABASE_SETUP.md para mais informações')
    }

    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar a seed se o arquivo for executado diretamente
if (require.main === module) {
  seedRolePermissions().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

export default seedRolePermissions
