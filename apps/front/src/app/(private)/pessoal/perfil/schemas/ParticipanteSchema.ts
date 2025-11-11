import { z } from 'zod'

// Constantes para estados civis
export const ESTADO_CIVIL = {
  SOLTEIRO: '01',
  CASADO: '02',
  VIUVO: '03',
  SEPARADO: '04',
  DIVORCIADO: '05',
  COMPANHEIRO: '06',
  OUTROS: '07'
} as const

// Enum de nacionalidades
export const NACIONALIDADE = {
  NAO_INFORMADA: '0',
  BRASILEIRO: '1',
  NATURALIZADO: '2',
  PORTUGUES: '3',
  OUTROS: '4'
} as const

// Tipo para estado civil
export type EstadoCivil = (typeof ESTADO_CIVIL)[keyof typeof ESTADO_CIVIL]
export type Nacionalidade = (typeof NACIONALIDADE)[keyof typeof NACIONALIDADE]

// Mapeamento de códigos para nomes
export const ESTADO_CIVIL_NOME: Record<string, string> = {
  [ESTADO_CIVIL.SOLTEIRO]: 'SOLTEIRO(A)',
  [ESTADO_CIVIL.CASADO]: 'CASADO(A)',
  [ESTADO_CIVIL.VIUVO]: 'VIÚVO(A)',
  [ESTADO_CIVIL.SEPARADO]: 'SEPARADO(A) JUDICIALMENTE',
  [ESTADO_CIVIL.DIVORCIADO]: 'DIVORCIADO(A)',
  [ESTADO_CIVIL.COMPANHEIRO]: 'COMPANHEIRO(A)',
  [ESTADO_CIVIL.OUTROS]: 'OUTROS'
}

export const NACIONALIDADE_NOME: Record<string, string> = {
  [NACIONALIDADE.NAO_INFORMADA]: 'NÃO INFORMADA',
  [NACIONALIDADE.BRASILEIRO]: 'BRASILEIRO(A)',
  [NACIONALIDADE.NATURALIZADO]: 'NATURALIZADO/BRASILEIRO(A)',
  [NACIONALIDADE.PORTUGUES]: 'PORTUGUÊS(A)',
  [NACIONALIDADE.OUTROS]: 'OUTROS'
}

// Lista de UFs do Brasil
export const UFS_BRASIL = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO'
] as const

// Tipo para as UFs do Brasil
export type UF = (typeof UFS_BRASIL)[number]

// Regex para validação de CEP
const cepRegex = /^\d{5}-\d{3}$/

// Regex para validação de email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Regex para validação de data (DD/MM/YYYY)
const dataRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

// Função para validar telefone brasileiro
const validarTelefone = (telefone: string) => {
  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '')

  // Se começar com 55, remove para validar o número real
  const numeroSemDDI = numeros.startsWith('55') ? numeros.slice(2) : numeros

  // Verifica se tem 10 dígitos (fixo) ou 11 dígitos (celular)
  return numeroSemDDI.length === 10 || numeroSemDDI.length === 11
}

export const participanteSchema = z.object({
  id: z.string(),
  fotoPerfil: z
    .union([z.instanceof(globalThis.File), z.string()])
    .optional()
    .superRefine((value, ctx) => {
      if (value instanceof globalThis.File) {
        // Validações somente quando o valor for um arquivo
        if (value.size > 3 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Foto de perfil deve ter no máximo 3MB'
          })
        }

        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tipo de arquivo inválido'
          })
        }
      }
    }),
  estadoCivil: z.enum(
    [
      ESTADO_CIVIL.SOLTEIRO,
      ESTADO_CIVIL.CASADO,
      ESTADO_CIVIL.VIUVO,
      ESTADO_CIVIL.SEPARADO,
      ESTADO_CIVIL.DIVORCIADO,
      ESTADO_CIVIL.COMPANHEIRO,
      ESTADO_CIVIL.OUTROS
    ],
    {
      errorMap: () => ({ message: 'Estado civil inválido' })
    }
  ),

  nacionalidade: z.enum(
    [
      NACIONALIDADE.NAO_INFORMADA,
      NACIONALIDADE.BRASILEIRO,
      NACIONALIDADE.NATURALIZADO,
      NACIONALIDADE.PORTUGUES,
      NACIONALIDADE.OUTROS
    ],
    {
      errorMap: () => ({ message: 'Nacionalidade inválida' })
    }
  ),

  rg: z.string().min(1, 'RG é obrigatório').max(20, 'RG deve ter no máximo 20 caracteres'),

  nomeMae: z.string().min(1, 'Nome da mãe é obrigatório').max(100, 'Nome da mãe deve ter no máximo 100 caracteres'),

  nomePai: z.string().max(100, 'Nome do pai deve ter no máximo 100 caracteres'),

  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),

  dataNascimento: z
    .string()
    .regex(dataRegex, 'Data de nascimento deve estar no formato DD/MM/AAAA')
    .refine(data => {
      const [dia, mes, ano] = data.split('/').map(Number)
      const dataNasc = new Date(ano, mes - 1, dia)
      const hoje = new Date()

      return dataNasc < hoje
    }, 'Data de nascimento deve ser anterior à data atual'),

  dataExpedicao: z.string().regex(dataRegex, 'Data de expedição deve estar no formato DD/MM/AAAA'),

  cep: z.string().regex(cepRegex, 'CEP deve estar no formato 00000-000'),

  bairro: z.string().min(1, 'Bairro é obrigatório').max(100, 'Bairro deve ter no máximo 100 caracteres'),

  numero: z.string().min(1, 'Número é obrigatório').max(20, 'Número deve ter no máximo 20 caracteres'),

  uf: z
    .string()
    .length(2, 'UF deve ter 2 caracteres')
    .refine((uf): uf is UF => UFS_BRASIL.includes(uf as UF), 'UF inválida'),

  logradouro: z.string().min(1, 'Logradouro é obrigatório').max(200, 'Logradouro deve ter no máximo 200 caracteres'),

  complemento: z.string().max(100, 'Complemento deve ter no máximo 100 caracteres').optional(),

  cidade: z.string().min(1, 'Cidade é obrigatória').max(100, 'Cidade deve ter no máximo 100 caracteres'),

  emailPrincipal: z.string().regex(emailRegex, 'Email principal inválido'),

  telefoneResidencial: z
    .string()
    .refine(validarTelefone, 'Telefone inválido. Digite um número válido com DDD')
    .optional(),

  emailAlternativo1: z.string().regex(emailRegex, 'Email alternativo 1 inválido').optional(),

  telefoneCelular: z.string().refine(validarTelefone, 'Telefone inválido. Digite um número válido com DDD').optional(),

  emailAlternativo2: z.string().regex(emailRegex, 'Email alternativo 2 inválido').optional(),

  sexo: z.string().refine(val => ['Masculino', 'Feminino', 'Não informado'].includes(val), 'Sexo inválido'),

  emissorRg: z
    .string()
    .min(1, 'Órgão expedidor é obrigatório')
    .max(20, 'Órgão expedidor deve ter no máximo 20 caracteres'),

  ufRg: z
    .string()
    .length(2, 'UF do RG deve ter 2 caracteres')
    .refine((uf): uf is UF => UFS_BRASIL.includes(uf as UF), 'UF do RG inválida'),

  naturalidade: z
    .string()
    .min(1, 'Naturalidade é obrigatória')
    .max(100, 'Naturalidade deve ter no máximo 100 caracteres'),

  ufNaturalidade: z
    .string()
    .length(2, 'UF da naturalidade deve ter 2 caracteres')
    .refine((uf): uf is UF => UFS_BRASIL.includes(uf as UF), 'UF da naturalidade inválida'),

  planoSituacao: z.string().optional(),
  planoCategoria: z.string().optional()
})

export type ParticipanteFormData = z.infer<typeof participanteSchema>
