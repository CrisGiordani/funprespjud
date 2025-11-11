import * as nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  attachments?: Array<{
    filename: string
    content: string | Buffer
    contentType?: string
  }>
}

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    const config: any = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '25'),
      secure: process.env.SMTP_SECURE === 'true',
      tls: {
        rejectUnauthorized: false
      }
    }

    // Adiciona autenticação apenas se as credenciais estiverem configuradas
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      config.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    }

    this.transporter = nodemailer.createTransport(config)
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments
      }

      const info = await this.transporter.sendMail(mailOptions)

      return info ? true : false
    } catch (error) {
      console.error('Erro ao enviar email:', error)

      return false
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()

      return true
    } catch (error) {
      console.error('Erro na verificação da conexão SMTP:', error)

      return false
    }
  }
}

export const emailService = new EmailService()
