import crypto from 'crypto'

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { emailService } from '@/services/EmailService'
import { encryptCpf } from '@/utils/crypto'
import { loadEmailTemplate } from '@/utils/emailTemplate'

export async function POST(request: Request) {
  try {
    const { cpf, email } = await request.json()

    if (!cpf || !email) {
      return NextResponse.json({ message: 'CPF e email são obrigatórios' }, { status: 400 })
    }

    const criptCpf = encryptCpf(cpf)

    const user = await prisma.user.findUnique({
      where: {
        cpf: criptCpf
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ message: 'Email não confere com o cadastro' }, { status: 400 })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()

    expiresAt.setHours(expiresAt.getHours() + 1)

    const result = await prisma.verifyCodes.create({
      data: {
        id: token,
        cpf: criptCpf,
        expiresAt: expiresAt
      }
    })

    if (!result) {
      return NextResponse.json({ message: 'Erro ao criar token de primeiro acesso' }, { status: 500 })
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const cpfEncoded = encodeURIComponent(criptCpf)
    const actionLink = `${baseUrl}/cadastro/criacao-de-senha?token=${token}&cpf=${cpfEncoded}`

    // Carregar e processar o template de email
    const emailHtml = loadEmailTemplate('criacao-de-senha', {
      userName: user.name,
      actionLink: actionLink
    })

    const emailSent = await emailService.sendEmail({
      to: email,
      subject: 'Criação de Senha - Funpresp-Jud',
      html: emailHtml
    })

    if (!emailSent) {
      return NextResponse.json({ message: 'Erro ao enviar e-mail' }, { status: 500 })
    }

    return NextResponse.json({ message: 'E-mail de criação de senha enviado com sucesso' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
