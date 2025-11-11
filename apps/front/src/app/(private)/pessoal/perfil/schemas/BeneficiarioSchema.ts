import { z } from 'zod'

import { normalizarTelefone } from '@/app/utils/formatters'

// Schema para leitura/carregamento de dados
export const beneficiarioSchema = z.object({
  id: z.string(),
  nome: z.string(),
  dtNascimento: z.string(),
  sexo: z.enum(['M', 'F']),
  grauParentesco: z.string(),
  invalido: z.enum(['S', 'N']),
  finalidade: z.string().nullable(),
  dtRecadastramento: z.string().nullable(),
  email: z.string().nullable(),
  celular: z.string().nullable()
})

// Schema específico para atualização
export const beneficiarioUpdateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  dtNascimento: z
    .string()
    .min(1, 'Data de nascimento é obrigatória')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA'),
  sexo: z.enum(['M', 'F'], { required_error: 'Sexo é obrigatório' }),
  grauParentesco: z.string().min(1, 'Grau de parentesco é obrigatório'),
  invalido: z.enum(['S', 'N'], { required_error: 'Inválido é obrigatório' }),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  celular: z
    .string()
    .nullable()
    .refine(
      val => val === null || normalizarTelefone(val) !== null,
      'Telefone inválido. Digite um número válido com DDD'
    )
})

// Schema específico para criação (inclui CPF)
export const beneficiarioCreateSchema = beneficiarioUpdateSchema.extend({
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
})

// Mapeamento de graus de parentesco
export const grauParentescoMap = {
  '1': 'CONJUGE',
  '2': 'COMPANHEIRO(A)',
  '3': 'EX-CONJUGE',
  '4': 'FILHO(A)',
  '5': 'NETO(A)',
  '6': 'PAI',
  '7': 'MÃE',
  '8': 'ENTEADO(A)',
  '9': 'IRMÃO(Ã)'
} as const

// Função para obter o ID do grau de parentesco baseado no texto
export const getGrauParentescoId = (texto: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entry = Object.entries(grauParentescoMap).find(([_, value]) => value === texto)

  return entry ? entry[0] : '1'
}

// Função para obter o texto do grau de parentesco baseado no ID
export const getGrauParentescoTexto = (id: string): string => {
  return grauParentescoMap[id as keyof typeof grauParentescoMap] || grauParentescoMap['1']
}

// Tipo para os dados que serão enviados para a API
export type BeneficiarioUpdatePayload = Omit<BeneficiarioUpdateData, 'grauParentesco'> & {
  grauParentesco: string
}

export type BeneficiarioCreatePayload = Omit<BeneficiarioCreateData, 'grauParentesco'> & {
  grauParentesco: string
}

export type BeneficiarioFormData = z.infer<typeof beneficiarioSchema>
export type BeneficiarioUpdateData = z.infer<typeof beneficiarioUpdateSchema>
export type BeneficiarioCreateData = z.infer<typeof beneficiarioCreateSchema>
