'use client'

import { useCallback, useEffect, useState } from 'react'

import { Box, Skeleton, Typography } from '@mui/material'

import { Carousel } from '@/app/components/ui/Carousel'
import { VisaoGeral, visaoGeralFormattedData } from './VisaoGeral'
import { ComposicaoPatrimonial, composicaoPatrimonialFormattedData } from './ComposicaoPatrimonial'
import { TotalContribuidoOuPatrimonio } from './TotalContribuidoOuPatrimonio'
import RetornoDeInvestimentos from './RetornoDeInvestimentos'
import useGetPatrimonio from '@/hooks/patrimonio/useGetPatrimonio'
import { type PatrimonioDTO } from '@/types/patrimonio/PatrimonioDTO.type'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/app/utils/formatters'
import { CardCustomized } from '@/components/ui/CardCustomized'

function carouselData(patrimonio: PatrimonioDTO) {
  return [
    <div key={1} className='min-h-[665px]'>
      <VisaoGeral {...visaoGeralFormattedData(patrimonio)} />
    </div>,

    <div key={2} className='min-h-[665px]'>
      <TotalContribuidoOuPatrimonio
        {...{
          titulo: 'Total contribuído pelo Participante',
          descricao:
            'Sua contribuição de participante é composta pelas contribuições normais e reservas suplementares (vinculadas, facultativas e portabilidade).',
          iconTotal: 'fa-regular fa-user',
          labelTotal: 'Total contribuído pelo Participante',
          total: formatCurrency(Number(patrimonio.totalContribuidoParticipante)),
          valores: [
            {
              icon: 'fa-kit fa-pay-ran',
              label: 'Normal do Participante',
              valor: formatCurrency(Number(patrimonio.contribuicaoNormalParticipanteRan.totalContribuido))
            },
            <div key={5}>
              <i className='fa-regular fa-plus text-3xl text-primary-main'></i>
            </div>,
            {
              icon: 'fa-kit fa-pay-ras',
              label: 'Reserva suplementar',
              valor: formatCurrency(Number(patrimonio.contribuicaoNormalParticipanteRas.totalContribuido))
            }
          ]
        }}
      />
    </div>,
    <div key={3} className='min-h-[665px]'>
      <ComposicaoPatrimonial {...composicaoPatrimonialFormattedData(patrimonio)} />
    </div>,
    <div key={4} className='min-h-[665px]'>
      <TotalContribuidoOuPatrimonio
        {...{
          titulo: 'Aumento patrimonial do Participante',
          descricao:
            'Ao contribuir para a Funpresp-Jud, seu patrimônio cresce tanto pelo retorno de investimentos quanto pela contrapartida do Patrocinador, compondo o aumento patrimonial do Participante.',
          iconTotal: 'fa-kit fa-regular-coins-circle-arrow-up',
          labelTotal: 'Aumento patrimonial do Participante',
          total: formatCurrency(Number(patrimonio.aumentoPatrimonialParticipante)),

          percentualCrescimento: Number(patrimonio.aumentoPatrimonialParticipantePercentual),
          valores: [
            {
              icon: 'fa-regular fa-landmark',
              label: 'Contribuição do Patrocinador',
              valor: formatCurrency(Number(patrimonio.contribuicaoNormalPatrocinadorRan.totalContribuido))
            },
            <div key={5}>
              <i className='fa-regular fa-plus text-3xl text-primary-main'></i>
            </div>,
            {
              icon: 'fa-regular fa-chart-mixed-up-circle-dollar',
              label: 'Retorno de investimentos',
              valor: formatCurrency(
                Number(patrimonio.aumentoPatrimonialParticipante) -
                  Number(patrimonio.contribuicaoNormalPatrocinadorRan.totalContribuido)
              )
            }
          ]
        }}
      />
    </div>,

    <div key={5} className='min-h-[665px]'>
      <RetornoDeInvestimentos
        totalContribuido={formatCurrency(Number(patrimonio.totalContribuido))}
        retornoDeInvestimentos={formatCurrency(
          Number(patrimonio.patrimonioTotal) - Number(patrimonio.totalContribuido)
        )}
        retornoDeInvestimentosPercentual={Number(patrimonio.rentabilidadePercentual)}
      />
    </div>
  ]
}

export function CardSaldoEmNumeros() {
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useAuth()
  const { patrimonio, getPatrimonio } = useGetPatrimonio()

  const fetchPatrimonio = useCallback(async () => {
    if (user?.cpf) {
      await getPatrimonio(user.cpf).finally(() => setIsLoading(false))
    }
  }, [getPatrimonio, user])

  useEffect(() => {
    fetchPatrimonio()
  }, [fetchPatrimonio])

  return (
    <CardCustomized.Root className='flex flex-col p-1 sm:p-6 pb-0'>
      <CardCustomized.Content>
        {patrimonio && patrimonio?.rentabilidadePercentual && Number(patrimonio?.rentabilidadePercentual) < 0 && (
          <Box className='flex items-start bg-warning-light p-4 rounded-xl mt-4 mb-4 gap-4'>
            <i className='fa-solid fa-circle-info text-w  arning-dark text-2xl'></i>
            <div>
              <Typography variant='body1'>
                Oscilações negativas podem ocorrer em investimentos ao longo do tempo. A previdência é um investimento
                de longo prazo, e é essencial manter isso em perspectiva ao fazer sua análise!
              </Typography>
            </div>
          </Box>
        )}
        <Carousel
          widthFull
          carouselData={
            isLoading
              ? [
                  <div key={1} className='min-h-[480px] flex flex-col justify-center items-center gap-2'>
                    <Skeleton variant='rectangular' width='100%' height='480px' sx={{ borderRadius: '5px' }} />
                  </div>
                ]
              : patrimonio
                ? carouselData(patrimonio)
                : [
                    <div key={1} className='min-h-[480px]'>
                      <Typography variant='body1'>Não foi possível carregar os dados do patrimônio.</Typography>
                    </div>
                  ]
          }
        />
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
