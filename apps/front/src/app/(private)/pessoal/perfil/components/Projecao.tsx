import { useCallback, useEffect, useState } from 'react'

import { Typography } from '@mui/material'

import TextWithLegend from '@/components/ui/TextWithLegend'
import { formatarDataBR } from '@/app/utils/formatters'
import type { SimularBeneficiosResponseType } from '@/types/simulacao-beneficio/SimularBeneficiosResponseType'
import { SimularBeneficiosService } from '@/services/SimularBeneficiosService'

export function Projecao({ participanteId }: { participanteId: string }) {
  const [projecao, setProjecao] = useState<SimularBeneficiosResponseType | null>(null)
  const [regimeCase, setRegimeCase] = useState<number>()

  const fetchProjecao = useCallback(async () => {
    const response = await SimularBeneficiosService.getProjecaoBeneficio(participanteId)

    setProjecao(response)

    if (response.regimeTributacao === null || response.regimeTributacao === '') {
      setRegimeCase(3)

      return
    }

    if (response.regimeTributacaoDataOpcao === null || response.regimeTributacaoDataOpcao === '') {
      setRegimeCase(2)

      return
    }

    setRegimeCase(1)
  }, [participanteId])

  useEffect(() => {
    fetchProjecao()
  }, [fetchProjecao])

  if (!projecao) {
    return null
  }

  return (
    <>
      <TextWithLegend
        legend='Idade prevista para aposentadoria'
        text={projecao?.idadeAposentadoria || '-'}
        legendPosition='left'
      />
      <Typography variant='body1'>
        {regimeCase === 1 && (
          <>
            Regime de tributação <span className='font-bold'>{projecao.regimeTributacao.toLowerCase()} </span>
            selecionado em <span className='font-bold'>{formatarDataBR(projecao.regimeTributacaoDataOpcao)}</span>
          </>
        )}
        {regimeCase === 2 && (
          <>
            Regime de tributação <span className='font-bold'>{projecao.regimeTributacao.toLowerCase()} </span>
          </>
        )}
        {regimeCase === 3 && <>Opção de regime de tributação ainda não exercida.</>}
      </Typography>
    </>
  )
}
