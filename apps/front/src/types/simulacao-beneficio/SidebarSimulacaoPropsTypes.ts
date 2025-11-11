import type { SimulacaoResponseType } from './ParametrosSimulacaoResponseType'
import type { ParametrosSimulacaoType } from './ParametrosSimulacaoType'

export type SidebarSimulacaoPropsType = {
  open: boolean
  onClose: () => void
  simulacao?: SimulacaoResponseType
  simularBeneficio?: (parametros: ParametrosSimulacaoType) => Promise<SimulacaoResponseType>
  isLoading?: boolean
  simulacaoDefaultValues: ParametrosSimulacaoType
  isVinculado?: boolean
  isBPD?: boolean
  isAutopatrocinado?: boolean
}
