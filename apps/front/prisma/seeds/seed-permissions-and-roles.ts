import { prisma } from '@/lib/prisma'

async function seedPermissionsAndRoles() {
  console.log('🌱 Iniciando seed de permissões e papéis...')

  try {
    // Verificar conexão com o banco
    await prisma.$connect()
    console.log('✅ Conexão com banco estabelecida')
    // Limpar dados existentes (opcional - comentar se não quiser limpar)
    // IMPORTANTE: Deletar relacionamentos primeiro devido às constraints de FK
    await prisma.rolePermission.deleteMany()
    await prisma.permission.deleteMany()
    await prisma.role.deleteMany()

    // 1. Criar permissões
    console.log('📝 Criando permissões...')
    const permissions = await Promise.all([
      prisma.permission.create({
        data: {
          name: 'VER_EMPRESTIMO',
          description: 'Visualizar empréstimo'
        }
      }),
      prisma.permission.create({
        data: {
          name: 'FAZER_SIMULACAO',
          description: 'Fazer simulação'
        }
      }),
      prisma.permission.create({
        data: {
          name: 'ALL_ROLES_AND_PERMISSIONS',
          description: 'Gerenciamento de permissões e papéis'
        }
      }),
      prisma.permission.create({
        data: {
          name: 'ASSIGN_PERMISSIONS_TO_ROLES',
          description: 'Pode atribuir permissões aos papéis'
        }
      }),
      prisma.permission.create({
        data: {
          name: 'VIEW_ROLES_AND_PERMISSIONS',
          description: 'Visualizar papéis e permissões'
        }
      })
    ])

    console.log(`✅ ${permissions.length} permissões criadas`)

    // 2. Criar papéis
    console.log('👥 Criando papéis...')
    const roles = await Promise.all([
      prisma.role.create({
        data: {
          name: 'USER_ADMIN',
          description: 'Administrador'
        }
      }),
      prisma.role.create({
        data: {
          name: 'USER_OPERATOR',
          description: 'Operador'
        }
      }),
      prisma.role.create({
        data: {
          name: 'USER_PARTICIPANT',
          description: 'Participante'
        }
      }),
      prisma.role.create({
        data: {
          name: 'USER_SPONSOR',
          description: 'Patrocinador'
        }
      }),
      prisma.role.create({
        data: {
          name: 'PATROCINADO',
          description: 'Patrocinado'
        }
      }),
      prisma.role.create({
        data: {
          name: 'MUDANÇA DE PATROCINADOR',
          description: 'Mudança de patrocinador'
        }
      }),
      prisma.role.create({
        data: {
          name: 'AUTOPATROCINADO',
          description: 'Autopatrocinado'
        }
      }),
      prisma.role.create({
        data: {
          name: 'ASSISTIDO',
          description: 'Assistido'
        }
      }),
      prisma.role.create({
        data: {
          name: 'CANCELADO',
          description: 'Cancelado'
        }
      }),
      prisma.role.create({
        data: {
          name: 'VINCULADO',
          description: 'Vinculado'
        }
      }),
      prisma.role.create({
        data: {
          name: 'BPD - SALDO',
          description: 'BPD - Saldo'
        }
      }),
      prisma.role.create({
        data: {
          name: 'BPD - DEPOSITO',
          description: 'BPD - Depósito'
        }
      }),
      prisma.role.create({
        data: {
          name: 'PATROCINADO - CJ/CC/FC',
          description: 'Patrocinado - CJ/CC/FC'
        }
      }),
      prisma.role.create({
        data: {
          name: 'ENCERRADO',
          description: 'Encerrado'
        }
      }),
      prisma.role.create({
        data: {
          name: '8203522025fdfd610c1cca160f06bf99',
          description: 'RODRIGO'
        }
      }),
      prisma.role.create({
        data: {
          name: 'c4ecc5681d99dce1b8f178dd12469026',
          description: 'MARCAO'
        }
      }),
      prisma.role.create({
        data: {
          name: 'TJDFT',
          description: 'TJDFT'
        }
      })
    ])

    console.log(`✅ ${roles.length} papéis criados`)

    console.log('🎉 Seed de permissões e papéis concluída com sucesso!')
  } catch (error: any) {
    console.error('❌ Erro durante a seed:', error)

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
  seedPermissionsAndRoles().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

export default seedPermissionsAndRoles
