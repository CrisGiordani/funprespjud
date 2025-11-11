import { useEffect } from 'react'

import { Typography } from '@mui/material'

import { BoxDadosCampanha } from './BoxDadosCampanha'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'
import { useCountTotalParticipantes } from '@/hooks/campanhas/useCountTotalParticipantes'

export function VisaoGeral({ campanha }: { campanha: CampanhaType | null }) {
  const { totalParticipantes,  getTotalParticipantes } = useCountTotalParticipantes()

  useEffect(() => {
    if (campanha) {
      getTotalParticipantes(campanha)
    }
  }, [campanha])

  return (
    <>
      <Typography variant='h4' className='font-semibold mb-3'>
        Visão geral
      </Typography>
      <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-4'>
        <BoxDadosCampanha title='Total de participantes' value={totalParticipantes} />
        <BoxDadosCampanha title='Total de usuários do portal' value={84572} />
        <BoxDadosCampanha
          title='Participantes cientes da campanha'
          value={656}
          descricao={
            <>
              <Typography variant='body1'>
                <span className='font-bold text-primary-main'>1,83%</span> do total de participantes
              </Typography>
              <Typography variant='body1'>
                <span className='font-bold text-primary-main'>6,33% </span>do total usuários do portal
              </Typography>
            </>
          }
        />

        <BoxDadosCampanha
          title='Participantes que alteraram o Perfil'
          value={537}
          descricao={
            <>
              <Typography variant='body1'>
                <span className='font-bold text-primary-main'> 1,50% </span> do total de participantes
              </Typography>
              <Typography variant='body1'>
                <span className='font-bold text-primary-main'> 5,18%</span> do total de usuários do portal
              </Typography>
            </>
          }
        />
      </div>
    </>
  )
}
