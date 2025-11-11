import type { AccordionPropsType } from './AccordionPropsTypes'

export type AccordionComparacaoBeneficioPropsType = AccordionPropsType & {
  simulacao: any
  beneficioEspecial: number
  setBeneficioEspecial: (v: number) => void
  beneficioRPPS: number
  setBeneficioRPPS: (v: number) => void
}
