import { useEffect } from 'react'

import { Typography } from '@mui/material'

import { DoughnutDistribuicaoSolicitacoes } from './DoughnutDistribuicaoSolicitacoes'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'
import { useGetDistribuicaoSolicitacoes } from '@/hooks/campanhas/useGetDistribuicaoSolicitacoes'
import type {
  DistribuicaoSolicitacoesType} from '@/types/campanhas/TotalDistribuicaoSolicitacoesType';


export function DistribuicaoSolicitacoes({ campanha }: { campanha: CampanhaType | null }) {
  const { distribuicaoSolicitacoes, getDistribuicaoSolicitacoes } = useGetDistribuicaoSolicitacoes()

  useEffect(() => {
    if (campanha) {
      getDistribuicaoSolicitacoes(campanha)
    }
  }, [campanha])

  return (
    <>
      <Typography variant='h4' className='font-semibold mt-6 mb-3'>
        Distribuição de solicitações de mudança de perfil
      </Typography>

      <DoughnutDistribuicaoSolicitacoes
        data={distribuicaoSolicitacoes?.horizonteProtegido as DistribuicaoSolicitacoesType}
        title={
          <>
            <Typography variant='h5' className='  text-gray-700'>
              Daqueles que tinham o perfil recomendado <span className='font-bold '>Horizonte Protegido</span>, a
              distribuição de solicitações é:
            </Typography>
          </>
        }
      />

      <DoughnutDistribuicaoSolicitacoes
        data={distribuicaoSolicitacoes?.horizonte2040 as DistribuicaoSolicitacoesType}
        title={
          <>
            <Typography variant='h5' className='mt-6 text-gray-700'>
              Daqueles que tinham o perfil recomendado <span className='font-bold '>Horizonte 2040</span>, a
              distribuição de solicitações é:
            </Typography>
          </>
        }
      />

      <DoughnutDistribuicaoSolicitacoes
        data={distribuicaoSolicitacoes?.horizonte2050 as DistribuicaoSolicitacoesType}
        title={
          <>
            <Typography variant='h5' className='mt-6 text-gray-700'>
              Daqueles que tinham o perfil recomendado <span className='font-bold '>Horizonte 2050</span>, a
              distribuição de solicitações é:
            </Typography>
          </>
        }
      />
    </>
  )
}
