import { Card, Typography } from '@mui/material'

import type { RetornoDeInvestimentosItemProps } from '@/types/patrimonio/RetornoDeInvestimentos.type'
import { PercentualChip } from './PercentualChip'

function RetornoDeInvestimentosItem({
  icon,
  titulo,
  subtitulo,
  valor,
  percentualCrescimento
}: RetornoDeInvestimentosItemProps) {
  return (
    <Card
      variant='outlined'
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.6rem',
        borderColor: percentualCrescimento ? 'var(--mui-palette-primary-main)' : '',
        backgroundColor: percentualCrescimento
          ? 'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)'
          : ''
      }}
    >
      <div className={` flex justify-center items-center rounded-full `}>
        <i className={`${icon} text-2xl text-primary-main  `}></i>
      </div>

      <div className='flex-1'>
        <Typography variant='body1' className='font-medium'>
          {titulo}
        </Typography>
        {subtitulo && (
          <Typography
            variant='subtitle2'
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--mui-palette-primary-main)'
            }}
          >
            {subtitulo}
          </Typography>
        )}

        <div className='w-full flex flex-row items-center flex-wrap gap-3'>
          <div className='flex flex-row justify-start items-center flex-wrap gap-2'>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 700,
                color: 'var(--mui-palette-text-primary)'
              }}
            >
              {valor}
            </Typography>
          </div>

          {percentualCrescimento && <PercentualChip percentualCrescimento={percentualCrescimento} />}
        </div>
      </div>
    </Card>
  )
}

export default function RetornoDeInvestimentos({
  totalContribuido,
  retornoDeInvestimentos,
  retornoDeInvestimentosPercentual
}: {
  totalContribuido: string
  retornoDeInvestimentos: string
  retornoDeInvestimentosPercentual: number
}) {
  return (
    <div className='flex-1 flex flex-col gap-4'>
      <div className='my-2'>
        <Typography variant='h4'>Retorno de investimentos</Typography>
        <Typography variant='body1'>
          É o quanto seu patrimônio cresceu exclusivamente com a rentabilidade da sua carteira de investimentos,
          desconsiderando as contribuições feitas pelo Patrocinador e pelo Participante (normais, facultativas,
          vinculadas e portabilidades).
        </Typography>
      </div>

      <div className='flex flex-col gap-4'>
        <RetornoDeInvestimentosItem
          icon='fa-regular fa-hand-holding-circle-dollar'
          titulo='Total contribuído'
          subtitulo='Participante + Patrocinador'
          valor={totalContribuido}
        />
        <RetornoDeInvestimentosItem
          icon='fa-regular fa-chart-mixed-up-circle-dollar'
          titulo='Retorno de investimentos'
          subtitulo='Rentabilidade da carteira de investimentos'
          valor={retornoDeInvestimentos}
          percentualCrescimento={retornoDeInvestimentosPercentual}
        />
      </div>
    </div>
  )
}
