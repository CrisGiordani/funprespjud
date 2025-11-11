import React from 'react'

import type { AccordionFactoryProps, AccordionType } from '../types/AccordionTypes'
import { getAccordionComponent } from '../config/AccordionComponentMap'
import { CONTRIBUICAO_TYPES, CONTRIBUIDOR_TYPES } from '../constants/AccordionConstants'

// Função simplificada de identificação usando mapeamento direto
const identifyAccordionType = (data: any): AccordionType => {
  const { grupoContribuicao, contribuidor, contribuicao, tipoContribuicao } = data

  // Verificar flags do backend primeiro (mais confiável que strings)
  if (data.isPAGTOBENEFICIO) return 'PAGTO'
  if (data.isNAT) return 'GRATIFICACAO_NATALINA_13'
  if (data.isCAR) return 'CAR'
  if (data.isBPD) return 'BPD'
  if (data.isMULTA) return 'MULTA'

  const grupo = grupoContribuicao?.toUpperCase() || ''
  const contrib = contribuidor?.toUpperCase() || ''
  const isEstorno = contribuicao?.toUpperCase().startsWith('ESTORNO') || false

  // Mapeamento direto para tipos principais
  const tipoMap: Record<string, AccordionType> = {
    [CONTRIBUICAO_TYPES.NORMAL]: isEstorno
      ? contrib === CONTRIBUIDOR_TYPES.PARTICIPANTE
        ? 'ESTORNO_CONTRIBUICAO_NORMAL_PARTICIPANTE'
        : 'ESTORNO_CONTRIBUICAO_NORMAL_PATROCINADOR'
      : contrib === CONTRIBUIDOR_TYPES.PARTICIPANTE
        ? 'CONTRIBUICAO_NORMAL_PARTICIPANTE'
        : 'CONTRIBUICAO_NORMAL_PATROCINADOR',

    [CONTRIBUICAO_TYPES.VINCULADA]: isEstorno
      ? 'ESTORNO_CONTRIBUICAO_VINCULADA'
      : 'CONTRIBUICAO_VINCULADA_PARTICIPANTE',
    [CONTRIBUICAO_TYPES.FACULTATIVA]: isEstorno
      ? 'ESTORNO_CONTRIBUICAO_FACULTATIVA'
      : 'CONTRIBUICAO_FACULTATIVA_PARTICIPANTE',
    [CONTRIBUICAO_TYPES.BENEFICIO_CONCEDIDO]: 'PAGTO'
  }

  if (tipoMap[grupo]) return tipoMap[grupo]

  // Casos especiais com verificações simples
  if (grupoContribuicao?.toUpperCase().includes('SEGURO')) return isEstorno ? 'ESTORNO_CAR' : 'CAR'
  if (grupo.startsWith('DEVOL')) return 'DEVOL'
  if (grupo.startsWith('PORTABILIDADE'))
    return grupo.includes('SAÍDA') || grupo.includes('SAIDA') ? 'PORTABILIDADE_SAIDA' : 'PORTABILIDADE_ENTRADA'
  if (tipoContribuicao?.toUpperCase().includes('BPD')) return 'BPD'
  if (grupo.startsWith('MULTA')) return isEstorno ? 'ESTORNO_MULTA' : 'MULTA'
  if (grupo.startsWith('TRANSFERÊNCIA DE PERFIL')) return 'TRANSFERENCIA_PERFIL'
  if (contribuicao?.toUpperCase().includes('13') || contribuicao?.toUpperCase().includes('NATALINA'))
    return 'GRATIFICACAO_NATALINA_13'

  // Fallback
  return 'CONTRIBUICAO_NORMAL_PARTICIPANTE'
}

// Componente principal simplificado
export const AccordionFactory: React.FC<AccordionFactoryProps> = ({
  grupoContribuicao,
  contribuidor,
  contribuicao,
  tipoContribuicao,
  item
}) => {
  const identifiedType = identifyAccordionType({
    ...item,
    grupoContribuicao,
    contribuidor,
    contribuicao,
    tipoContribuicao
  })

  const AccordionComponent = getAccordionComponent(identifiedType)

  return <AccordionComponent item={item} />
}

// Re-exportar funções úteis
export { isAccordionTypeSupported, getAccordionInfo, getSupportedAccordionTypes } from '../config/AccordionComponentMap'
