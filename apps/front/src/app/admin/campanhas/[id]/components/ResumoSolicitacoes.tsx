import { useEffect } from 'react'

import { Typography } from '@mui/material'

import { BoxDadosCampanha } from './BoxDadosCampanha'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'
import { useGetResumoSolicitacoesCampanha } from '@/hooks/campanhas/useGetResumoSolicitacoesCampanha'

export function ResumoSolicitacoes({ campanha }: { campanha: CampanhaType | null }) {
  const { resumo, getResumoSolicitacoesCampanha } = useGetResumoSolicitacoesCampanha()

  useEffect(() => {
    if (campanha) {
      getResumoSolicitacoesCampanha(campanha.idCampanha as number)
    }
  }, [campanha])

  return (
    <>
      <Typography variant='h4' className='font-semibold mt-6 mb-3'>
        Resumo de solicitações
      </Typography>
      <div className='grid md:grid-cols-4 sm:grid-cols-1 gap-4'>
        <BoxDadosCampanha title='Total de solicitações' value={resumo?.contagemSolicitacoes ?? 0} />
        <BoxDadosCampanha title='Confirmadas' value={resumo?.processadas ?? 0} />
        <BoxDadosCampanha title='Canceladas' value={resumo?.canceladas ?? 0} />
        {/* <BoxDadosCampanha title='Substituídas' value={100} /> verificar se é necessário */}
        <BoxDadosCampanha title='Não confirmadas' value={resumo?.nconfirmadas ?? 0} />
      </div>
    </>
  )
}
