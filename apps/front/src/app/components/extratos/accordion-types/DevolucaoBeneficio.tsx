import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { formatCurrency } from '@/app/utils/formatters'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'

interface DevolucaoBeneficioProps {
  item: ExtratoTypes
}

export const DevolucaoBeneficio: React.FC<DevolucaoBeneficioProps> = ({ item }) => {
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
              label: 'Valor da devolução',
              value: formatCurrency(item.valorContribuicao)
            }
          ]}
        />

        {/* TAXAS */}
        <LabelValueItemAccortion
          title='TAXAS'
          values={[
            {
              label: 'Devolução da taxa de carregamento assistido',
              value: formatCurrency(item.ran)
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
                  className={`font-semibold ${item.ras > 0 ? 'text-success' : item.ras < 0 ? 'text-error' : 'text-primary'}`}
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
              label: 'Cotas adicionadas',
              value: '+ ' + (item.ranCotas?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-')
            }
          ]}
        />
      </div>
    </div>
  )
}
