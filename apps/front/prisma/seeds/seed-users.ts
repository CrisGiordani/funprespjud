import { prisma } from '@/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'
import { encryptCpf } from '@/utils/crypto'

interface UserData {
  email: string
  nome: string
  cpf: string
  password: string
  role: string[]
  funpresp: string
}

// Função para processar o CSV
function parseCSV(csvContent: string): UserData[] {
  const lines = csvContent.trim().split('\n')
  const users: UserData[] = []

  // Pula o cabeçalho
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Divide a linha por ; e pega apenas os primeiros 6 campos
    const fields = line.split(';').slice(0, 3)

    if (fields.length >= 3) {
      users.push({
        email: fields[0].trim(),
        nome: fields[1].trim(),
        cpf: fields[2].trim(),
        password: '',
        role: ['USER_PARTICIPANT'],
        funpresp: 'false'
      })
    }
  }

  return users
}

async function seedUsers() {
  try {
    console.log('🌱 Iniciando seed de usuários...')

    // Caminho para o arquivo CSV
    const csvPath = path.join(__dirname, 'carga_participantes.csv')

    // Verifica se o arquivo existe
    if (!fs.existsSync(csvPath)) {
      console.error('❌ Arquivo users.csv não encontrado em prisma/seeds/')
      console.log('📁 Crie o arquivo users.csv com o formato:')
      console.log('email;nome;cpf;password;role;funpresp')
      return
    }

    // Lê o arquivo CSV
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const users = parseCSV(csvContent)

    console.log(`📊 Encontrados ${users.length} usuários para importar`)

    let successCount = 0
    let errorCount = 0

    // Processa cada usuário
    for (const userData of users) {
      try {
        // // Verifica se o usuário já existe
        // const existingUser = await prisma.user.findFirst({
        //   where: {
        //     OR: [{ email: userData.email }, { cpf: encryptCpf(userData.cpf) }]
        //   }
        // })

        // if (existingUser) {
        //   console.log(`⚠️  Usuário já existe: ${userData.email}`)
        //   continue
        // }

        // Cria o usuário
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.nome,
            cpf: encryptCpf(userData.cpf),
            password: '',
            role: ['USER_PARTICIPANT'],
            funpresp: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })

        console.log(`✅ Usuário criado: ${user.email} (ID: ${user.id})`)
        successCount++
      } catch (error) {
        console.error(`❌ Erro ao criar usuário ${userData.email}:`, error)
        errorCount++
      }
    }

    console.log('\n📈 Resumo do seed:')
    console.log(`✅ Usuários criados com sucesso: ${successCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    console.log(`📊 Total processado: ${users.length}`)
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executa o seed se o arquivo for executado diretamente
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('🎉 Seed concluído!')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Erro fatal:', error)
      process.exit(1)
    })
}

export { seedUsers }
