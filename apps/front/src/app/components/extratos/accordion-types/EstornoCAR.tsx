import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'
import { formatCurrency } from '@/app/utils/formatters'
import { formatarCompetencia } from '../ListExtrato'

interface EstornoCARProps {
  item: ExtratoTypes
}

export const EstornoCAR: React.FC<EstornoCARProps> = ({ item }) => {
  const coberturas = item.detalhesMovimentacao?.coberturas

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col gap-1'>
        {/* DETALHES DA MOVIMENTAÇÃO */}
        <LabelValueItemAccortion
          title='DETALHES DA MOVIMENTAÇÃO'
          values={[
            {
              label: 'Valor estornado',
              value: formatCurrency(item.valorContribuicao)
            }
          ]}
        />

        {/* TAXAS */}
        <LabelValueItemAccortion
          title='TAXAS'
          values={[
            {
              label: 'Estorno cobertura adicional morte',
              value: formatCurrency(coberturas?.morte.mensalidade ?? 0)
            },
            {
              label: 'Estorno cobertura adicional invalidez',
              value: formatCurrency(coberturas?.invalidez.mensalidade ?? 0)
            }
          ]}
        />
      </div>

      <Divider />

      <div className='w-full flex flex-col gap-1'>
        {/* DATAS */}
        <LabelValueItemAccortion
          title='DATAS'
          values={[
            {
              label: 'Competência',
              value: item.competencia ? formatarCompetencia(item.competencia) : '-'
            }
          ]}
        />
      </div>
    </div>
  )
}
