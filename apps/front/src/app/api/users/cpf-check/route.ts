import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { encryptCpf } from '@/utils/crypto'

function removeCpfMask(cpf: string) {
  return cpf.replace(/\D/g, '')
}

export async function POST(request: Request) {
  const { cpf } = await request.json()

  try {
    const cleanCpf = removeCpfMask(cpf)
    const criptCpf = encryptCpf(cleanCpf)

    const user = await prisma.user.findUnique({
      where: {
        cpf: criptCpf
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.password) {
      return NextResponse.json({ message: 'Usuário já possui senha cadastrada' }, { status: 409 })
    }

    const res = NextResponse.json({ data: user, success: true })

    return res
  } catch (err) {
    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 })
  }
}
