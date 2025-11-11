import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { emailService } from '@/services/EmailService'

// Função que gera HTML baseado no componente VerificacaoToken
function generateVerificacaoTokenHTML(token: string, nome: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #1976d2;">
        <h1 style="color: #1976d2; margin: 0; font-size: 24px; font-weight: bold;">
          Portal - Verificação de Token
        </h1>
      </div>

      <!-- Content -->
      <div style="padding: 30px 20px;">
        <h2 style="color: #333; font-size: 20px; margin-bottom: 20px;">
          Olá, ${nome}!
        </h2>

        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          Você solicitou a verificação de token. Use o código abaixo para completar sua operação:
        </p>

        <!-- Token Display -->
        <div style="background-color: #f5f5f5; border: 2px dashed #1976d2; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
            SEU TOKEN DE VERIFICAÇÃO:
          </p>
          <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin: 10px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #1976d2; letter-spacing: 3px; font-family: monospace;">
              ${token}
            </span>
          </div>
        </div>

        <!-- Instructions -->
        <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 6px; padding: 15px; margin: 25px 0;">
          <h3 style="color: #1976d2; font-size: 16px; margin: 0 0 10px 0;">
            📋 Instruções:
          </h3>
          <ul style="color: #555; font-size: 14px; line-height: 1.5; margin: 0; padding-left: 20px;">
            <li>Copie o token acima</li>
            <li>Cole no campo de verificação</li>
            <li>Clique em "Verificar" para continuar</li>
          </ul>
        </div>

        <!-- Security Notice -->
        <div style="background-color: #fff3e0; border: 1px solid #ffcc02; border-radius: 6px; padding: 15px; margin: 25px 0;">
          <p style="color: #e65100; font-size: 14px; margin: 0; font-weight: bold;">
            🔒 Segurança:
          </p>
          <p style="color: #e65100; font-size: 13px; margin: 5px 0 0 0;">
           Não compartilhe este código com ninguém.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Se você não solicitou esta verificação, ignore este e-mail.
          </p>
          <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">
            Atenciosamente,<br />
            <strong>Equipe do GETEC</strong>
          </p>
        </div>
      </div>
    </div>
  `
}

export async function POST(request: Request) {
  try {
    const { cpf, token } = await request.json()

    const user = await prisma.user.findUnique({
      where: {
        cpf: cpf
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    const html = generateVerificacaoTokenHTML(token, user.name)

    const emailSent = await emailService.sendEmail({
      to: user.email,
      subject: 'Verificação de Token - Portal',
      text: `Olá ${user.name},\n\nPara verificar seu token, use o código: ${token}\n\nAtenciosamente,\nEquipe do Portal`,
      html: html
    })

    if (!emailSent) {
      return NextResponse.json({ message: 'Erro ao enviar e-mail' }, { status: 500 })
    }

    return NextResponse.json({ message: 'E-mail de recuperação de senha enviado com sucesso' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
