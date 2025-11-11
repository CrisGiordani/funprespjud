import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { formatCurrency } from '@/app/utils/formatters'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'
import { formatarCompetencia } from '../ListExtrato'

interface ContribuicaoVinculadaProps {
  item: ExtratoTypes
}

export const ContribuicaoVinculada: React.FC<ContribuicaoVinculadaProps> = ({ item }) => {
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
            }
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
              label: 'RAS do ' + item.mantenedorContribuicao.toLocaleLowerCase(),
              value: (
                <span
                  className={`font-bold ${item.ras > 0 ? 'text-success' : item.ras < 0 ? 'text-error' : 'text-primary'}`}
                >
                  + {formatCurrency(item.ras)}
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
                  className={`font-bold ${item.rasCotas > 0 ? 'text-success' : item.rasCotas < 0 ? 'text-error' : 'text-primary'}`}
                >
                  + {item.rasCotas?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'}
                </span>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
