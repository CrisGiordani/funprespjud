import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { formatarCompetencia } from '../ListExtrato'
import { formatCurrency } from '@/app/utils/formatters'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'

interface CARProps {
  item: ExtratoTypes
}

export const CAR: React.FC<CARProps> = ({ item }) => {
  const coberturas = item.detalhesMovimentacao?.coberturas

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col gap-1'>
        {/* DETALHES DA MOVIMENTAÇÃO */}
        <LabelValueItemAccortion
          title='DETALHES DA MOVIMENTAÇÃO'
          values={[
            {
              label: 'Valor total pago',
              value: formatCurrency(item.valorContribuicao)
            }
          ]}
        />

        {/* COBERTURAS */}
        <LabelValueItemAccortion
          title='COBERTURAS'
          values={[
            {
              label: 'Cobertura adicional morte',
              value: formatCurrency(coberturas?.morte.mensalidade ?? 0)
            },
            {
              label: 'Cobertura adicional invalidez',
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
