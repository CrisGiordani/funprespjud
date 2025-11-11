import type React from 'react'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import type { AccordionType } from '../types/AccordionTypes'

import { BPD } from '../accordion-types/BPD'
import { CAR } from '../accordion-types/CAR'
import { ContribuicaoFacultativa } from '../accordion-types/ContribuicaoFacultativa'
import { ContribuicaoNormalPatrocinadorParticipante } from '../accordion-types/ContribuicaoNormalPatrocinadorParticipante'
import { ContribuicaoVinculada } from '../accordion-types/ContribuicaoVinculada'
import { DevolucaoBeneficio } from '../accordion-types/DevolucaoBeneficio'
import { EstornoCAR } from '../accordion-types/EstornoCAR'
import { EstornoContribuicaoFacultativa } from '../accordion-types/EstornoContribuicaoFacultativa'
import { EstornoContribuicaoNormal } from '../accordion-types/EstornoContribuicaoNormal'
import { EstornoContribuicaoVinculada } from '../accordion-types/EstornoContribuicaoVinculada'
import { EstornoMulta } from '../accordion-types/EstornoMulta'
import { GratificacaoNatalina } from '../accordion-types/GratificacaoNatalina'
import { Multa } from '../accordion-types/Multa'
import { PagamentoBeneficio } from '../accordion-types/PagamentoBeneficio'
import { TransferenciaPerfil } from '../accordion-types/TransferenciaPerfil'
import { PortabilidadeEntrada } from '../accordion-types/PortabilidadeEntrada'
import { PortabilidadeSaida } from '../accordion-types/PortabilidadeSaida'

// Componente placeholder inline para tipos em desenvolvimento
// Mapeamento de tipos identificados para componentes
export const ACCORDION_COMPONENTS: Record<AccordionType, React.ComponentType<{ item: ExtratoTypes }>> = {
  // Contribuições Normais
  CONTRIBUICAO_NORMAL_PARTICIPANTE: ContribuicaoNormalPatrocinadorParticipante,
  CONTRIBUICAO_NORMAL_PATROCINADOR: ContribuicaoNormalPatrocinadorParticipante,

  // Estornos de Contribuições Normais
  ESTORNO_CONTRIBUICAO_NORMAL_PARTICIPANTE: EstornoContribuicaoNormal,
  ESTORNO_CONTRIBUICAO_NORMAL_PATROCINADOR: EstornoContribuicaoNormal,

  // Contribuições Vinculadas
  CONTRIBUICAO_VINCULADA_PARTICIPANTE: ContribuicaoVinculada,
  CONTRIBUICAO_VINCULADA_PATROCINADOR: ContribuicaoVinculada,
  ESTORNO_CONTRIBUICAO_VINCULADA: EstornoContribuicaoVinculada,

  // Contribuições Facultativas
  CONTRIBUICAO_FACULTATIVA_PARTICIPANTE: ContribuicaoFacultativa,
  CONTRIBUICAO_FACULTATIVA_PATROCINADOR: ContribuicaoFacultativa,
  ESTORNO_CONTRIBUICAO_FACULTATIVA: EstornoContribuicaoFacultativa,

  // CAR
  CAR: CAR,
  ESTORNO_CAR: EstornoCAR,

  // Benefícios
  PAGTO: PagamentoBeneficio,
  DEVOL: DevolucaoBeneficio,

  // Portabilidade
  PORTABILIDADE_ENTRADA: PortabilidadeEntrada,
  PORTABILIDADE_SAIDA: PortabilidadeSaida,

  // BPD
  BPD: BPD,

  // Operações Especiais
  TRANSFERENCIA_PERFIL: TransferenciaPerfil,
  GRATIFICACAO_NATALINA_13: GratificacaoNatalina,
  MULTA: Multa,
  ESTORNO_MULTA: EstornoMulta
}

// Função para obter o componente correspondente ao tipo identificado
export const getAccordionComponent = (identifiedType: AccordionType): React.ComponentType<{ item: ExtratoTypes }> => {
  return ACCORDION_COMPONENTS[identifiedType]
}

// Função para verificar se um tipo é suportado
export const isAccordionTypeSupported = (identifiedType: AccordionType): boolean => {
  return identifiedType in ACCORDION_COMPONENTS
}

// Função para obter informações sobre um tipo de accordion
export const getAccordionInfo = (identifiedType: AccordionType) => {
  const isImplemented = identifiedType in ACCORDION_COMPONENTS
  const component = getAccordionComponent(identifiedType)

  return {
    supported: true,
    message: isImplemented ? 'Componente implementado' : 'Componente em desenvolvimento',
    type: identifiedType,
    isImplemented,
    componentName: component.name
  }
}

// Função para listar todos os tipos suportados
export const getSupportedAccordionTypes = (): AccordionType[] => {
  return Object.keys(ACCORDION_COMPONENTS) as AccordionType[]
}
