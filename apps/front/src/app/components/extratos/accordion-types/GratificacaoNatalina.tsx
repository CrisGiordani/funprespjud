import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { formatarCompetencia } from '../ListExtrato'
import { formatCurrency } from '@/app/utils/formatters'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'

interface GratificacaoNatalinaProps {
  item: ExtratoTypes
}

export const GratificacaoNatalina: React.FC<GratificacaoNatalinaProps> = ({ item }) => {
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col gap-1'>
        {/* DETALHES DA MOVIMENTAÇÃO */}
        <LabelValueItemAccortion
          title='DETALHES DA MOVIMENTAÇÃO'
          values={[
            {
              label: 'Valor da contribuição',
              value: formatCurrency(item.valorContribuicao)
            },
            { label: 'FCBE', value: '- ' + formatCurrency(item.fcbe) }
          ]}
        />

        {/* TAXAS */}
        <LabelValueItemAccortion
          title='TAXAS'
          values={[
            {
              label: 'Taxa de carregamento',
              value: '- ' + formatCurrency(item.taxaCarregamento)
            }
          ]}
        />

        {/* RESERVA INDIVIDUAL */}
        <LabelValueItemAccortion
          title='RESERVA INDIVIDUAL'
          values={[
            {
              label: 'RAN do ' + item.mantenedorContribuicao.toLocaleLowerCase(),
              value: (
                <span
                  className={`font-bold ${item.ran > 0 ? 'text-success' : item.ran < 0 ? 'text-error' : 'text-primary'}`}
                >
                  + {formatCurrency(item.ran)}
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
              label: 'Cotas adicionadas',
              value: (
                <span
                  className={`font-bold ${item.ranCotas > 0 ? 'text-success' : item.ranCotas < 0 ? 'text-error' : 'text-primary'}`}
                >
                  + {item.ranCotas?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'}
                </span>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
