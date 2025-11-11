import { z } from 'zod'

// Schema para um patrocinador individual
export const cargoEfetivoSchema = z.object({
  cargos: z.record(z.string().min(1, 'Cargo é obrigatório'))
})

export type CargoEfetivoData = z.infer<typeof cargoEfetivoSchema>
