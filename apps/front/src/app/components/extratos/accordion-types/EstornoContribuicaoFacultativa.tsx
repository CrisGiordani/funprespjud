import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'
import { formatCurrency } from '@/app/utils/formatters'
import { formatarCompetencia } from '../ListExtrato'

interface EstornoContribuicaoFacultativaProps {
  item: ExtratoTypes
}

export const EstornoContribuicaoFacultativa: React.FC<EstornoContribuicaoFacultativaProps> = ({ item }) => {
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

        {/* RESERVA INDIVIDUAL */}
        <LabelValueItemAccortion
          title='RESERVA INDIVIDUAL'
          values={[
            {
              label: 'RAS do ' + item.mantenedorContribuicao.toLocaleLowerCase(),
              value: (
                <span
                  className={`font-semibold ${item.ras > 0 ? 'text-success' : item.ras < 0 ? 'text-error' : 'text-primary'}`}
                >
                  -{formatCurrency(item.ras)}
                </span>
              )
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

      <Divider />

      <div className='w-full flex flex-col gap-1'>
        {/* COTIZAÇÃO */}
        <LabelValueItemAccortion
          title='COTIZAÇÃO'
          values={[
            {
              label: 'Data da conversão',
              value: item.dtRecolhimento ? item.dtRecolhimento.split(' ')[0].split('-').reverse().join('/') : '-'
            },
            {
              label: 'Cotas retiradas',
              value: (
                <span
                  className={`font-bold ${item.rasCotas > 0 ? 'text-success' : item.ran < 0 ? 'text-error' : 'text-primary'}`}
                >
                  - {item.rasCotas?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'}
                </span>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
