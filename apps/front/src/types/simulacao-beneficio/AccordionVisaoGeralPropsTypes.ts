import type { AccordionPropsType } from './AccordionPropsTypes'
import type { SimulacaoResponseType } from './ParametrosSimulacaoResponseType'

export type AccordionVisaoGeralPropsType = AccordionPropsType & {
  simulacao: SimulacaoResponseType
  beneficioEspecial: number
  setBeneficioEspecial: (v: number) => void
  beneficioRPPS: number
  setBeneficioRPPS: (v: number) => void
  isVinculado?: boolean
  isBPD?: boolean
  isAutopatrocinado?: boolean
}
