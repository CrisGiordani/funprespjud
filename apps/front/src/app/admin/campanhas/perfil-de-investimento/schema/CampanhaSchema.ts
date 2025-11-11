import { z } from 'zod'

export const campanhaSchema = z
  .object({
    descricao: z.string().min(1, 'Descrição é obrigatória').min(2, 'Descrição deve ter no mínimo 2 caracteres'),

    dt_inicio: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Data de início é obrigatória' : defaultError
      })
    }),

    dt_fim: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Data de fim é obrigatória' : defaultError
      })
    })
  })
  .refine(
    data => {
      if (data.dt_inicio && data.dt_fim) {
        return data.dt_fim > data.dt_inicio
      }

      
return true
    },
    {
      message: 'Data de fim deve ser posterior à data de início',
      path: ['dt_fim']
    }
  )
