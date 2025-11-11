import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'
import { formatCurrency } from '@/app/utils/formatters'
import { formatarCompetencia } from '../ListExtrato'

interface MultaProps {
  item: ExtratoTypes
}

export const Multa: React.FC<MultaProps> = ({ item }) => {
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col gap-1'>
        {/* DETALHES DA MOVIMENTAÇÃO */}
        <LabelValueItemAccortion
          title='DETALHES DA MOVIMENTAÇÃO'
          values={[
            {
              label: 'Valor total da multa',
              value: formatCurrency(item.valorContribuicao)
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
