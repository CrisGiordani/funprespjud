import { z } from 'zod'

export enum FORMAS_PAGAMENTO_ENUM {
  pix = 'Pix',
  boleto = 'Boleto'
}

export const contribuicaoFacultativaSchema = (valorMinimo: string) =>
  z.object({
    valorContribuicao: z
      .string()
      .min(1, { message: 'Contribuição abaixo do mínimo possível.' })
      .refine(
        value => {
          const numericValue = Number(value.replace(/[^0-9]/g, ''))
          const valorMinimoNumeric = Number(valorMinimo.replace(/[^0-9]/g, ''))

          return numericValue >= valorMinimoNumeric
        },
        { message: 'Contribuição abaixo do mínimo possível.' }
      ),
    formaPagamento: z.enum(Object.values(FORMAS_PAGAMENTO_ENUM) as [string, ...string[]], {
      message: 'Forma de pagamento inválida',
      required_error: 'Forma de pagamento é obrigatória'
    })
  })

export type ContribuicaoFacultativaFormData = z.infer<ReturnType<typeof contribuicaoFacultativaSchema>>
