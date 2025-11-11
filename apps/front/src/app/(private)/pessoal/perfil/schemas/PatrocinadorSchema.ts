import { z } from 'zod'

// Schema para um patrocinador individual
export const patrocinadorSchema = z.object({
  id: z.string().optional(),
  sigla: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  dtExercicio: z.string().optional(),
  dtInscricaoPlano: z.string().optional(),
  nmCargo: z.string().optional()
})

// Schema para a resposta da API de patrocinadores
export const patrocinadoresResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: z
    .object({
      patrocinadores: z.array(patrocinadorSchema).optional()
    })
    .optional(),
  metadata: z
    .object({
      timestamp: z.string().optional(),
      version: z.string().optional(),
      endpoint: z.string().optional(),
      method: z.string().optional(),
      groups: z.array(z.string()).optional()
    })
    .optional()
})

// Schema para os dados formatados do patrocinador
export const patrocinadorFormDataSchema = z.object({
  id: z.string(),
  sigla: z.string(),
  nome: z.string(),
  cargo: z.string(),
  dataExercicio: z.string(),
  dataInscricao: z.string()
})

export type Patrocinador = z.infer<typeof patrocinadorSchema>
export type PatrocinadoresResponse = z.infer<typeof patrocinadoresResponseSchema>
export type PatrocinadorFormData = z.infer<typeof patrocinadorFormDataSchema>
