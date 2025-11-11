import { Card, Typography } from '@mui/material'

import type { PatrimonioDTO } from '@/types/patrimonio/PatrimonioDTO.type'
import { formatCurrency } from '@/app/utils/formatters'
import type { ComposicaoPatrimonialItemProps } from '@/types/patrimonio/ComposicaoPatrimonial.type'
import { PercentualChip } from './PercentualChip'
import { calcularPorcentagemDeAcrescimo } from '@/utils/math'

function ComposicaoPatrimonialItem({
  titulo,
  valorAntigo,
  valorAtual,
  percentualCrescimento,
  icon
}: ComposicaoPatrimonialItemProps) {
  return (
    <Card
      variant='outlined'
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start',
        gap: '.5rem',
        padding: '1.6rem'
      }}
    >
      <div className=' flex justify-center items-center  rounded-full'>
        <i className={`${icon} text-primary-main text-2xl`} />
      </div>

      <Typography variant='body1' className='font-medium'>
        {titulo}
      </Typography>

      <div className='w-full flex flex-row justify-start items-center flex-wrap gap-4'>
        <div className='flex flex-row justify-start items-center flex-wrap gap-2'>
          <Typography
            variant='h5'
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--mui-palette-text-disabled)'
            }}
          >
            {valorAntigo}
          </Typography>
          <i className='fa-regular fa-arrow-right text-primary-main text-3xl'></i>
          <Typography
            variant='h5'
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700
            }}
          >
            {valorAtual}
          </Typography>
        </div>

        {percentualCrescimento !== 0 && percentualCrescimento !== null && percentualCrescimento !== undefined && (
          <PercentualChip percentualCrescimento={percentualCrescimento} />
        )}
      </div>
    </Card>
  )
}

type ComposicaoPatrimonialItemFormattedData = Pick<
  ComposicaoPatrimonialItemProps,
  'valorAtual' | 'valorAntigo' | 'percentualCrescimento'
>
export type ComposicaoPatrimonialProps = {
  contribuicaoNormalParticipanteRan: ComposicaoPatrimonialItemFormattedData
  contribuicaoNormalPatrocinadorRan: ComposicaoPatrimonialItemFormattedData
  contribuicaoNormalParticipanteRas: ComposicaoPatrimonialItemFormattedData
}

export function ComposicaoPatrimonial({
  contribuicaoNormalParticipanteRan,
  contribuicaoNormalPatrocinadorRan,
  contribuicaoNormalParticipanteRas
}: ComposicaoPatrimonialProps) {
  return (
    <div className='flex-1 flex flex-col gap-4'>
      <div className='my-2'>
        <Typography variant='h4'>Composição patrimonial</Typography>
        <Typography variant='body1'>
          Veja os valores contribuídos para cada tipo de saldo e seu valor atual rentabilizado.
        </Typography>
      </div>

      <div className='flex-1 flex flex-col justify-start items-start gap-4'>
        <ComposicaoPatrimonialItem
          titulo='Normal do Participante (RAN)'
          icon='fa-kit fa-normal-participante'
          {...contribuicaoNormalParticipanteRan}
        />
        <ComposicaoPatrimonialItem
          titulo='Normal do Patrocinador (RAN)'
          icon='fa-kit fa-normal-patrocinador'
          {...contribuicaoNormalPatrocinadorRan}
        />
        <ComposicaoPatrimonialItem
          titulo='Vinculado, facultativa e/ou portabilidade (RAS)'
          icon='fa-regular fa-money-check-dollar-pen'
          {...contribuicaoNormalParticipanteRas}
        />
      </div>
    </div>
  )
}

export function composicaoPatrimonialFormattedData(patrimonio: PatrimonioDTO): ComposicaoPatrimonialProps {
  return {
    contribuicaoNormalParticipanteRan: {
      valorAtual: formatCurrency(Number(patrimonio?.contribuicaoNormalParticipanteRan.totalRentabilizado)),
      valorAntigo: formatCurrency(Number(patrimonio?.contribuicaoNormalParticipanteRan.totalContribuido)),
      percentualCrescimento: calcularPorcentagemDeAcrescimo(
        Number(patrimonio?.contribuicaoNormalParticipanteRan.totalContribuido),
        Number(patrimonio?.contribuicaoNormalParticipanteRan.totalRentabilizado)
      )
    },
    contribuicaoNormalPatrocinadorRan: {
      valorAtual: formatCurrency(Number(patrimonio?.contribuicaoNormalPatrocinadorRan.totalRentabilizado)),
      valorAntigo: formatCurrency(Number(patrimonio?.contribuicaoNormalPatrocinadorRan.totalContribuido)),
      percentualCrescimento: calcularPorcentagemDeAcrescimo(
        Number(patrimonio?.contribuicaoNormalPatrocinadorRan.totalContribuido),
        Number(patrimonio?.contribuicaoNormalPatrocinadorRan.totalRentabilizado)
      )
    },
    contribuicaoNormalParticipanteRas: {
      valorAtual: formatCurrency(Number(patrimonio?.contribuicaoNormalParticipanteRas.totalRentabilizado)),
      valorAntigo: formatCurrency(Number(patrimonio?.contribuicaoNormalParticipanteRas.totalContribuido)),
      percentualCrescimento: calcularPorcentagemDeAcrescimo(
        Number(patrimonio?.contribuicaoNormalParticipanteRas.totalContribuido),
        Number(patrimonio?.contribuicaoNormalParticipanteRas.totalRentabilizado)
      )
    }
  }
}
