'use client'

import { useEffect, useRef } from 'react'

import { Card, Typography } from '@mui/material'

import { TooltipCustomized } from '@/components/ui/TooltipCustomized'
import type { RentabilidadeAnualItemProps } from '@/types/patrimonio/RentabilidadeAnual.type'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { useAuth } from '@/contexts/AuthContext'
import { useGetVariacaoPatrimonioRetornoInvestimento } from '@/hooks/patrimonio/useGetVariacaoPatrimonioRetornoInvestimento'

function RentabilidadeAnualItem({ titulo, percentual, descricao, primary }: RentabilidadeAnualItemProps) {
  return (
    <Card
      variant='outlined'
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start',
        padding: ' 2rem',
        borderColor: primary ? 'var(--mui-palette-primary-main)' : '',
        backgroundColor: primary ? 'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)' : ''
      }}
    >
      <div className='flex justify-start items-center gap-2'>
        <Typography variant='body1'>{titulo}</Typography>
      </div>

      <Typography
        variant='h4'
        sx={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--mui-palette-text-primary)'
        }}
      >
        {percentual}{' '}
        {descricao && (
          <TooltipCustomized title={descricao}>
            <i
              className={`fa-duotone fa-regular fa-circle-question text-2xl cursor-pointer`}
              style={
                {
                  // @ts-ignore
                  '--fa-primary-color': 'var(--mui-palette-primary-main)',

                  // @ts-ignore
                  '--fa-secondary-color': 'color-mix(in srgb, var(--mui-palette-primary-main) 25%, transparent)'
                } as React.CSSProperties
              }
            ></i>
          </TooltipCustomized>
        )}
      </Typography>
    </Card>
  )
}

export function CardRentabilidadeAnual() {
  const { user } = useAuth()

  const { variacaoPatrimonioRetornoInvestimento, getVariacaoPatrimonioRetornoInvestimento } =
    useGetVariacaoPatrimonioRetornoInvestimento()

  const hasExecutedRef = useRef<string | null>(null)

  useEffect(() => {
    if (user?.cpf && hasExecutedRef.current !== user.cpf) {
      hasExecutedRef.current = user.cpf
      getVariacaoPatrimonioRetornoInvestimento(user.cpf)
    }
  }, [user?.cpf, getVariacaoPatrimonioRetornoInvestimento])

  return (
    <CardCustomized.Root className='flex flex-col p-6 pb-16'>
      <CardCustomized.Header
        title='Rentabilidade anual'
        subheader='Compare o desempenho da sua contribuição na Fundação e da sua carteira de investimento ao índice do CDI anualizado e ao benchmark do seu perfil de investimento.'
      />
      <CardCustomized.Content>
        <div className='grid grid-cols-12 mt-4 gap-2'>
          <div className='col-span-12 mb-0'>
            <Typography
              variant='h5'
              className='mb-0 font-semibold'
              sx={{
                color: '#595959'
              }}
            >
              Números de referência
            </Typography>
          </div>
          <div className='col-span-6 mr-2'>
            <RentabilidadeAnualItem
              titulo='Benchmark do perfil de investimento'
              percentual={variacaoPatrimonioRetornoInvestimento?.aaRi_PB || '0.00%'}
              descricao={
                <>
                  <p>
                    É a meta de rentabilidade projetada e definido na Política de Investimentos conforme o horizonte do
                    perfil de investimento.
                  </p>
                  <ul>
                    <li>Horizonte Protegido: IMA-B5 (90%) + CDI (10%)</li>
                    <li>Horizonte 2040: inflação (IPCA) + 4,25% ao ano</li>
                    <li>Horizonte 2050: inflação (IPCA) + 5,00% ao ano</li>
                  </ul>
                </>
              }
            />
          </div>
          <div className='col-span-6 ml-2'>
            <RentabilidadeAnualItem
              titulo='CDI anualizado'
              percentual={variacaoPatrimonioRetornoInvestimento?.aaRi_CDI || '0.00%'}
              descricao='Taxa de referência para investimentos de curto prazo e baixo risco (volatidade), principalmente no segmento de Renda Fixa e Estruturados (Multimercados).'
            />
          </div>
        </div>
        <div className='grid grid-cols-12 mt-4 gap-2'>
          <div className='col-span-12 mb-0'>
            <Typography
              variant='h5'
              className='mb-0 font-semibold'
              sx={{
                color: '#595959'
              }}
            >
              Seus números
            </Typography>
          </div>
          <div className='col-span-6 mr-2'>
            <RentabilidadeAnualItem
              titulo='Aumento patrimonial anualizado do Participante'
              percentual={variacaoPatrimonioRetornoInvestimento?.aaVpp || '0.00%'}
              primary
              descricao='Variação média anual do saldo acumulado, considerando a rentabilidade dos investimentos e as contribuições efetuadas (Participante e, eventualmente, do Patrocinador), em comparação com o que você contribuiu.'
            />
          </div>
          <div className='col-span-6 ml-2'>
            <RentabilidadeAnualItem
              titulo='Retorno anualizado de investimento'
              percentual={variacaoPatrimonioRetornoInvestimento?.aaRi || '0.00%'}
              primary
              descricao='É a média de quanto os investimentos renderam por ano, considerando que todo o dinheiro foi aplicado de uma vez, no início do período. Esse cálculo não leva em conta novas contribuições feitas posteriormente.'
            />
          </div>
        </div>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
