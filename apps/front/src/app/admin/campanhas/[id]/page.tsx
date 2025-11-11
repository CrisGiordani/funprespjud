'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { ChipProps } from '@mui/material'
import { Chip, Typography } from '@mui/material'

import { CardCustomized } from '@/components/ui/CardCustomized'
import { MigracaoSolicitacoes } from './components/MigracaoSolicitacoes'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { VisaoGeral } from './components/VisaoGeral'
import { ResumoSolicitacoes } from './components/ResumoSolicitacoes'
import { DistribuicaoSolicitacoes } from './components/DistribuicaoSolicitacoes'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'
import { statusCampanha } from '@/types/perfilInvestimento/CampanhaType'
import { formatarDataBR } from '@/app/utils/formatters'

export default function InformacoesCampanha() {
  const router = useRouter()
  const [campanha, setCampanha] = useState<CampanhaType | null>(null)

  useEffect(() => {
    const campanhaFromStorage = sessionStorage.getItem('selectedCampanha')

    if (campanhaFromStorage) {
      try {
        const campanhaData = JSON.parse(campanhaFromStorage)

        setCampanha(campanhaData)
      } catch (error) {
        console.error('Erro ao parsear campanha do storage:', error)
      }
    }
  }, [])

  const handleVoltar = () => {
    router.back()
  }

  return (
    <CardCustomized.Root className='h-full p-0'>
      <CardCustomized.Header
        title={
          <div className='flex flex-row gap-4 items-center justify-between'>
            <div className='flex flex-row gap-4 items-center'>
              <Typography variant='h4' className='font-semibold'>
                {campanha?.descricao}
              </Typography>
              <Chip
                variant='tonal'
                label={statusCampanha[campanha?.status ?? 'null'].label}
                color={statusCampanha[campanha?.status ?? 'null'].color as ChipProps['color']}
                className={`rounded-full w-[235px]`}
              />
            </div>
            <ButtonCustomized
              className='w-28'
              variant='outlined'
              startIcon={<i className='fa-regular fa-arrow-left'></i>}
              onClick={handleVoltar}
            >
              Voltar
            </ButtonCustomized>
          </div>
        }
        subheader={
          <div className='flex flex-col gap-2'>
            {/* <Typography variant='body1' className='text-gray-700 text-md'>
              Criada por {campanha?.criadoPor || '000.000.000-01'}
            </Typography> */}
            <Typography variant='body1' className='text-gray-700 text-md'>
              Data de início: {formatarDataBR(campanha?.dt_inicio)}
            </Typography>
            <Typography variant='body1' className='text-gray-700 text-md'>
              Data de fim: {formatarDataBR(campanha?.dt_fim)}
            </Typography>
          </div>
        }
      />
      <CardCustomized.Content className='h-full mt-6'>
        <VisaoGeral campanha={campanha} />
        <ResumoSolicitacoes campanha={campanha} />
        <DistribuicaoSolicitacoes campanha={campanha} />
        <MigracaoSolicitacoes campanha={campanha} />
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
