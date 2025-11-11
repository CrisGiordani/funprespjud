import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { AccordionFactory } from './factory/AccordionFactory'

interface ExtratoDetalheProps {
  item: ExtratoTypes
  modeloDetalhe: string
  grupoContribuicao: string
}

export default function ExtratoDetalhe({ item, modeloDetalhe, grupoContribuicao }: ExtratoDetalheProps) {
  const contribuidor = item.contribuidor || 'PARTICIPANTE'
  const contribuicao = modeloDetalhe || ''
  const tipoContribuicao = item.tipoContribuicao || 'NORMAL'

  // Usar o AccordionFactory com a nova lógica de identificação
  return (
    <AccordionFactory
      grupoContribuicao={grupoContribuicao}
      contribuidor={contribuidor}
      contribuicao={contribuicao}
      tipoContribuicao={tipoContribuicao}
      item={item}
    />
  )
}
