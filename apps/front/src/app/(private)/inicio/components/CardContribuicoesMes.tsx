import React, { useEffect } from 'react'

import { Box, Divider, Skeleton, Typography } from '@mui/material'

import { useAuth } from '@/contexts/AuthContext'
import Link from '@/components/Link'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { formatCurrency } from '@/app/utils/formatters'
import { useGetUltimaContribuicao } from '@/hooks/dashboard/useGetUltimaContribuicao'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { PlanoSituacaoEnum } from '@/enum/simulador/PlanoSituacao'
import { PAGINATION } from '@/app/components/extratos/constants/AccordionConstants'
import { formatarCompetencia, limparFiltrosVazios } from '@/app/components/extratos/ListExtrato'
import useGetAllExtrato from '@/hooks/useGetAllExtrato'

export function CardContribuicoesMes() {
  const { ultimaContribuicao, getUltimaContribuicao, error } = useGetUltimaContribuicao()

  const { user } = useAuth()

  const { extrato, isLoading, getAllExtrato } = useGetAllExtrato()

  const isBpd =
    user?.roles.includes(PlanoSituacaoEnum.BPD_SALDO) || user?.roles.includes(PlanoSituacaoEnum.BPD_DEPOSITO)

  const isAssistido = user?.roles.includes(PlanoSituacaoEnum.ASSISTIDO)

  const contentContribuicoesNormais = {
    NORMAL: [
      {
        icon: 'fa-regular fa-user',
        title: 'Minhas contribuições',
        value: formatCurrency(ultimaContribuicao?.contribuicaoParticipante ?? 0)
      },
      {
        icon: 'fa-regular fa-landmark',
        title: 'Contribuições do Órgão',
        value: formatCurrency(ultimaContribuicao?.contribuicaoPatrocinador ?? 0)
      },
      {
        icon: 'fa-kit fa-pay-total',
        title: 'Total contribuído',
        value: formatCurrency(ultimaContribuicao?.contribuicaoTotal ?? 0)
      }
    ],
    BPD: [
      {
        icon: 'fa-kit fa-regular-money-bill-circle-arrow-down',
        title: 'Taxa BPD',
        value: formatCurrency(Math.abs(extrato?.dados[0]?.valorContribuicao ?? 0))
      }
    ],
    ASSISTIDO: [
      {
        icon: 'fa-regular fa-money-bill-wave',
        title: 'Recebimento de beneficio',
        value: formatCurrency(Math.abs(extrato?.dados[0]?.valorContribuicao ?? 0))
      }
    ]
  }

  const currentContentType = isBpd ? 'BPD' : isAssistido ? 'ASSISTIDO' : 'NORMAL'
  const currentContent = contentContribuicoesNormais[currentContentType]

  const extratoData = extrato?.dados[0]

  const currentMes = extratoData?.competencia
    ? formatarCompetencia(extratoData?.competencia)
    : ultimaContribuicao?.nomeMes

  useEffect(() => {
    if (user?.cpf && !isBpd && !isAssistido) {
      getUltimaContribuicao(user?.cpf)
    }
  }, [user?.cpf])

  useEffect(() => {
    if (isBpd || isAssistido) {
      const filtrosLimpos = limparFiltrosVazios({
        pageIndex: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      })

      getAllExtrato(Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {})
    }
  }, [getAllExtrato])

  if (!ultimaContribuicao?.nomeMes && !error && isLoading) {
    return (
      <CardCustomized.Root>
        <CardCustomized.Header title={`Resumo de movimentações do mês`} />
        <CardCustomized.Content>
          <Skeleton variant='rectangular' width='100%' height={177} sx={{ borderRadius: '5px' }} />
        </CardCustomized.Content>
        <CardCustomized.Footer>
          <Skeleton variant='rectangular' width='100%' height={45} sx={{ borderRadius: '5px' }} />
        </CardCustomized.Footer>
      </CardCustomized.Root>
    )
  }

  if (error) {
    return (
      <CardCustomized.Root>
        <CardCustomized.Header title={`Resumo de movimentações do mês`} />
        <CardCustomized.Content>
          <Typography variant='body1'>Nenhuma movimentação encontrada</Typography>
        </CardCustomized.Content>
        <CardCustomized.Footer>
          <div className='w-full'>
            <div className='max-w-[300px] flex flex-col text-center gap-4 m-auto'>
              <Link href='/patrimonio/extrato'>
                <ButtonCustomized variant='outlined' type='button' fullWidth>
                  Ver extrato completo
                </ButtonCustomized>
              </Link>
            </div>
          </div>
        </CardCustomized.Footer>
      </CardCustomized.Root>
    )
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title={`Resumo de movimentações de ${currentMes}`}
        subheader={
          ultimaContribuicao?.dataUltimoAporte ? (
            <i>
              Última atualização:{' '}
              {new Date(ultimaContribuicao.dataUltimoAporte).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </i>
          ) : null
        }
      />

      <CardCustomized.Content>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgb(var(--mui-mainColorChannels-gray))',
            borderRadius: '10px',
            padding: '1rem',
            marginTop: '.3rem',
            gap: '0.5rem'
          }}
        >
          {currentContent.map((item, index) =>
            item.title.includes('Total') ? (
              <React.Fragment key={index}>
                <Divider sx={{ borderColor: '#CCCCCC', borderWidth: '1px', margin: '.7rem 0' }} />

                <div className='flex flex-row flex-wrap gap-2 justify-between items-center'>
                  <div className='flex flex-row gap-2 items-center'>
                    <i className={`${item.icon} text-primary-main text-2xl`}></i>
                    <Typography variant='body1'>{item.title}</Typography>
                  </div>
                  <Typography variant='body1' className='font-bold' sx={{ color: 'var(--mui-palette-text-primary)' }}>
                    {item.value}
                  </Typography>
                </div>
              </React.Fragment>
            ) : (
              <div key={index} className='flex flex-row flex-wrap gap-2 pt-2 justify-between items-center'>
                <div className='flex flex-row gap-2 items-center'>
                  <i className={`${item.icon} text-primary-main text-2xl`}></i>
                  <Typography variant='body1'>{item.title}</Typography>
                </div>
                <Typography variant='body1' className='font-bold' sx={{ color: 'var(--mui-palette-text-primary)' }}>
                  {item.value}
                </Typography>
              </div>
            )
          )}
        </Box>
      </CardCustomized.Content>

      <CardCustomized.Footer>
        <div className='w-full'>
          <div className='max-w-[300px] flex flex-col text-center gap-4 m-auto'>
            <Link href='/patrimonio/extrato'>
              <ButtonCustomized variant='outlined' type='button' fullWidth>
                Ver extrato completo
              </ButtonCustomized>
            </Link>
          </div>
        </div>
      </CardCustomized.Footer>
    </CardCustomized.Root>
  )
}
