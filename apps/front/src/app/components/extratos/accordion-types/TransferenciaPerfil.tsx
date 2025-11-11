import React from 'react'

import { Divider } from '@mui/material'

import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import { LabelValueItemAccortion } from '../LabelValueAccordionItem'
import { formatarDataBR } from '@/app/utils/formatters'

interface TransferenciaPerfilProps {
  item: ExtratoTypes
}

export const TransferenciaPerfil: React.FC<TransferenciaPerfilProps> = ({ item }) => {
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full flex flex-col gap-1'>
        {/* PERFIL ANTERIOR */}
        <LabelValueItemAccortion
          title={`COTAS DO PERFIL ANTERIOR - ${item.perfilAnterior?.nmPerfil}`}
          values={[
            {
              label: 'Valor da cota do perfil na data da conversão',
              value: item.perfilAnterior?.valorCota?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'
            },
            {
              label: 'RAN do Participante',
              value: item.perfilAnterior?.RAN_participante?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'
            },
            {
              label: 'RAN do Patrocinador',
              value: item.perfilAnterior?.RAN_patrocinador?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'
            },
            {
              label: 'RAS do Participante',
              value: item.perfilAnterior?.RAS_participante?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'
            }
          ]}
        />
      </div>

      <Divider />

      <div className='w-full flex flex-col gap-1'>
        {/* PERFIL NOVO */}
        <LabelValueItemAccortion
          title={`COTAS DO PERFIL NOVO - ${item.perfilNovo?.nmPerfil}`}
          values={[
            {
              label: 'Valor da cota do perfil na data da conversão',
              value: item.perfilNovo?.valorCota?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'
            },
            {
              label: 'RAN do Participante',
              value: item.perfilNovo?.RAN_participante?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'
            },
            {
              label: 'RAN do Patrocinador',
              value: item.perfilNovo?.RAN_patrocinador?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'
            },
            {
              label: 'RAS do Participante',
              value: item.perfilNovo?.RAS_participante?.toLocaleString('pt-BR', { minimumFractionDigits: 8 }) ?? '-'
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
              label: 'Data da transferência',
              value: item.dataTransferencia ? formatarDataBR(item.dataTransferencia) : '-'
            }
          ]}
        />
      </div>
    </div>
  )
}
