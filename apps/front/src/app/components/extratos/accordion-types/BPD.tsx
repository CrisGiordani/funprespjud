import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { formatarDataBR, formatCurrency } from '@/app/utils/formatters'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'
import { formatarCompetencia } from '../ListExtrato'

interface BPDProps {
  item: ExtratoTypes
}

export const BPD: React.FC<BPDProps> = ({ item }) => {
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col gap-1'>
        {/* DETALHES DA MOVIMENTAÇÃO */}
        <LabelValueItemAccortion
          title='DETALHES DA MOVIMENTAÇÃO'
          values={[
            {
              label: 'Taxa de carregamento',
              value: formatCurrency(item.valorContribuicao)
            }
          ]}
        />

        {/* RESERVA INDIVIDUAL */}
        {item.isDeposito === false && (
          <LabelValueItemAccortion
            title='RESERVA INDIVIDUAL'
            values={[
              {
                label: 'Valor retirado do saldo',
                value: (
                  <span
                    className={`font-bold ${item.taxaCarregamento > 0 ? '' : item.taxaCarregamento < 0 ? 'text-error' : 'text-primary'}`}
                  >
                    {formatCurrency(item.taxaCarregamento) ?? '-'}
                  </span>
                )
              }
            ]}
          />
        )}
      </div>

      <Divider />

      <div className='w-full flex flex-col gap-1'>
        {/* DATAS */}
        <LabelValueItemAccortion
          title='DATAS'
          values={[
            {
              label: 'Data de pagamento',
              value: formatarDataBR(item.dtRecolhimento)
            },
            {
              label: 'Competência',
              value: item.competencia ? formatarCompetencia(item.competencia) : '-'
            }
          ]}
        />
      </div>
      {item.isDeposito === false && (
        <>
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
                      className={`font-bold ${item.ranCotas > 0 ? '' : item.ranCotas < 0 ? 'text-error' : 'text-primary'}`}
                    >
                      {item.ranCotas?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'}
                    </span>
                  )
                }
              ]}
            />
          </div>
        </>
      )}
    </div>
  )
}
