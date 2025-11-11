import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'

// Tipos de accordion identificados
export type AccordionType =
  | 'CONTRIBUICAO_NORMAL_PARTICIPANTE'
  | 'CONTRIBUICAO_NORMAL_PATROCINADOR'
  | 'ESTORNO_CONTRIBUICAO_NORMAL_PARTICIPANTE'
  | 'ESTORNO_CONTRIBUICAO_NORMAL_PATROCINADOR'
  | 'CONTRIBUICAO_VINCULADA_PARTICIPANTE'
  | 'CONTRIBUICAO_VINCULADA_PATROCINADOR'
  | 'ESTORNO_CONTRIBUICAO_VINCULADA'
  | 'CONTRIBUICAO_FACULTATIVA_PARTICIPANTE'
  | 'CONTRIBUICAO_FACULTATIVA_PATROCINADOR'
  | 'ESTORNO_CONTRIBUICAO_FACULTATIVA'
  | 'CAR'
  | 'ESTORNO_CAR'
  | 'PAGTO'
  | 'DEVOL'
  | 'PORTABILIDADE_ENTRADA'
  | 'PORTABILIDADE_SAIDA'
  | 'BPD'
  | 'TRANSFERENCIA_PERFIL'
  | 'GRATIFICACAO_NATALINA_13'
  | 'MULTA'
  | 'ESTORNO_MULTA'

// Interface para os dados de identificação
export interface AccordionIdentificationData {
  grupoContribuicao: string
  contribuidor: string
  contribuicao: string
  tipoContribuicao?: string
}

// Interface para as props do AccordionFactory
export interface AccordionFactoryProps extends AccordionIdentificationData {
  item: ExtratoTypes
}

// Interface para informações do accordion
export interface AccordionInfo {
  supported: boolean
  message: string
  type: AccordionType
  isImplemented: boolean
  componentName: string
}

// Interface para dados de filtro
export interface ExtratoFilterData {
  pageIndex: number
  pageSize: number
  mesInicial?: string
  mesFinal?: string
  anoInicial?: string
  anoFinal?: string
  tipo?: string
  orgao?: string
  autor?: string
}
