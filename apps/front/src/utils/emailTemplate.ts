import { readFileSync } from 'fs'
import { join } from 'path'

export interface EmailTemplateData {
  userName: string
  actionLink: string
}

export function loadEmailTemplate(templateName: string, data: EmailTemplateData): string {
  try {
    const templatePath = join(process.cwd(), 'src', 'assets', 'email-templates', `${templateName}.html`)
    let template = readFileSync(templatePath, 'utf-8')

    // Substituir as variáveis no template
    template = template.replace(/\{\{userName\}\}/g, data.userName)
    template = template.replace(/\{\{actionLink\}\}/g, data.actionLink)

    return template
  } catch (error) {
    console.error(`Erro ao carregar template de email ${templateName}:`, error)
    throw new Error(`Template de email não encontrado: ${templateName}`)
  }
}
