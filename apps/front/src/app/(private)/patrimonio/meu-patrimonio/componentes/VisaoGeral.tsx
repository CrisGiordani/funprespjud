import { Typography } from '@mui/material'

import type { PatrimonioDTO } from '@/types/patrimonio/PatrimonioDTO.type'
import { formatCurrency } from '@/app/utils/formatters'
import { CardIconTextLabel } from '@/app/components/common/CardIconTextLabel'

export type VisaoGeralProps = {
  totalContribuidoParticipante: string
  totalContribuidoPatrocinador: string
  retornoInvestimentos: string
  retornoInvestimentosPercentual: number
  aumentoPatrimonialDoParticipante: string
  aumentoPatrimonialDoParticipantePercentual: number
}

export function VisaoGeral({
  totalContribuidoParticipante,
  totalContribuidoPatrocinador,
  retornoInvestimentos,
  retornoInvestimentosPercentual,
  aumentoPatrimonialDoParticipante,
  aumentoPatrimonialDoParticipantePercentual
}: VisaoGeralProps) {
  return (
    <div className='flex-1 flex flex-col gap-2'>
      <div className='my-2'>
        <Typography variant='h4'>Visão geral do patrimônio</Typography>
        <Typography variant='body1'>
          Acompanhe a composição do seu saldo e a rentabilidade das suas contribuições e da sua carteira.
        </Typography>
      </div>

      <div className='flex-1 flex flex-col justify-start items-start gap-6'>
        <CardIconTextLabel
          titulo='Total contribuído pelo Participante'
          valor={totalContribuidoParticipante}
          icon='fa-regular fa-user'
          descricao='Total aportado pelo participante, somando contribuições normais, facultativas, vinculadas e portabilidades.'
        />
        <CardIconTextLabel
          titulo='Total contribuído pelo Patrocinador'
          valor={totalContribuidoPatrocinador}
          icon='fa-regular fa-landmark'
          descricao='Contribuições normais realizadas pelo patrocinador.'
        />
        <CardIconTextLabel
          titulo='Retorno de investimentos'
          subtitulo='Rentabilidade de carteira de investimentos'
          valor={retornoInvestimentos}
          percentualCrescimento={retornoInvestimentosPercentual}
          icon='fa-regular fa-chart-mixed-up-circle-dollar'
          descricao='É o quanto seu patrimônio cresceu exclusivamente com a rentabilidade da sua carteira de investimento.'
        />
        <CardIconTextLabel
          titulo='Aumento patrimonial do Participante'
          subtitulo='Patrocinador + Retorno de investimentos'
          valor={aumentoPatrimonialDoParticipante}
          percentualCrescimento={aumentoPatrimonialDoParticipantePercentual}
          icon='fa-kit fa-regular-coins-circle-arrow-up'
          descricao='É o quanto o seu patrimônio cresceu considerando apenas retorno de investimentos e aportes do Patrocinador.'
        />
      </div>
    </div>
  )
}

export function visaoGeralFormattedData(patrimonio: PatrimonioDTO): VisaoGeralProps {
  return {
    totalContribuidoParticipante: formatCurrency(Number(patrimonio?.totalContribuidoParticipante)),
    totalContribuidoPatrocinador: formatCurrency(Number(patrimonio?.totalContribuidoPatrocinador)),
    retornoInvestimentos: formatCurrency(Number(patrimonio?.rentabilidade)),
    retornoInvestimentosPercentual: Number(patrimonio?.rentabilidadePercentual),
    aumentoPatrimonialDoParticipante: formatCurrency(Number(patrimonio?.aumentoPatrimonialParticipante)),
    aumentoPatrimonialDoParticipantePercentual: Number(patrimonio?.aumentoPatrimonialParticipantePercentual)
  }
}
