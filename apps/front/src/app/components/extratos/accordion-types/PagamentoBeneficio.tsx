import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'
import { formatCurrency } from '@/app/utils/formatters'

interface PagamentoBeneficioProps {
  item: ExtratoTypes
}

export const PagamentoBeneficio: React.FC<PagamentoBeneficioProps> = ({ item }) => {
  // Helper function for date formatting (DD/MM/YYYY)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'

    const [datePart] = dateString.split(' ')

    return datePart.split('-').reverse().join('/')
  }

  // Helper function for competence formatting (e.g., Jul/2023)
  const formatCompetencia = (competenciaString?: string) => {
    if (!competenciaString) return '-'

    // Check if it's already in "Mon/YYYY" format (e.g., "Jul/2023")
    if (/^[A-Za-z]{3}\/\d{4}$/.test(competenciaString)) {
      return competenciaString
    }

    // Otherwise, assume YYYY-MM and convert
    const [year, month] = competenciaString.split('-')

    if (year && month) {
      const date = new Date(parseInt(year), parseInt(month) - 1, 1)

      return date.toLocaleString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')
    }

    return competenciaString // Fallback for unexpected formats
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col gap-1'>
        {/* DETALHES DA MOVIMENTAÇÃO */}
        <LabelValueItemAccortion
          title='DETALHES DA MOVIMENTAÇÃO'
          values={[
            {
              label: 'Valor do beneficio',
              value: formatCurrency(item.valorContribuicao)
            }
          ]}
        />
        {/* DESCONTOS */}
        <LabelValueItemAccortion
          title='DESCONTOS'
          values={[
            {
              label: 'Imposto de renda',
              value: '- ' + formatCurrency(item.fcbe)
            },
            {
              label: '{Outras deduções (ex.:Quitação de impréstimo)}',
              value: '- ' + formatCurrency(item.taxaCarregamento)
            }
          ]}
        />

        {/* TAXAS */}
        <LabelValueItemAccortion
          title='TAXAS'
          values={[
            {
              label: 'Taxa de carregamento assistido',
              value: '- ' + formatCurrency(item.taxaCarregamento)
            }
          ]}
        />

        {/* RESERVA INDIVIDUAL */}
        <LabelValueItemAccortion
          title='RESERVA INDIVIDUAL'
          values={[
            {
              label: 'Saldo total do participante',
              value: (
                <span
                  className={`font-bold ${item.ras > 0 ? 'text-success' : item.ras < 0 ? 'text-error' : 'text-primary'}`}
                >
                  - {formatCurrency(item.ras)}
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
              value: formatCompetencia(item.competencia)
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
              value: formatDate(item.dtRecolhimento)
            },
            {
              label: 'Cotas retiradas',
              value: (
                <span
                  className={`font-bold ${item.ranCotas > 0 ? 'text-success' : item.ranCotas < 0 ? 'text-error' : 'text-primary'}`}
                >
                  - {item.ranCotas?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'}
                </span>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
