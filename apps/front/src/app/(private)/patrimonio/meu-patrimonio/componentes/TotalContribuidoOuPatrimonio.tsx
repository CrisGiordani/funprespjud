'use client'

import type { ReactNode } from 'react'

import { Card, Typography } from '@mui/material'

import type { TotalContribuidoOuPatrimonioItemProps } from '@/types/patrimonio/TotalContribuidoOuPatrimonio.type'
import { PercentualChip } from './PercentualChip'

function TotalContribuidoOuPatrimonioItem({
  titulo,
  valor,
  icon,
  primary,
  percentualCrescimento
}: TotalContribuidoOuPatrimonioItemProps) {
  return (
    <Card
      variant='outlined'
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 'fit-content',
        padding: '1.2rem ',

        borderColor: primary ? 'var(--mui-palette-primary-main)' : '',
        backgroundColor: primary ? 'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)' : '',
        '@media (max-width: 768px)': {
          minWidth: '100%'
        }
      }}
    >
      <div className={` flex justify-center items-center ${primary ? '' : 'bg-none border-none'} mb-2`}>
        <i className={`${icon} text-2xl    text-primary-main`}></i>
      </div>

      <Typography variant='h5' sx={{ textAlign: 'center' }}>
        {titulo}
      </Typography>

      <div className={`flex flex-col items-center ${!percentualCrescimento && 'justify-center'} `}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 700,
            color: 'var(--mui-palette-text-primary)'
          }}
        >
          {valor}
        </Typography>

        {percentualCrescimento && <PercentualChip percentualCrescimento={percentualCrescimento} />}
      </div>
    </Card>
  )
}

type ValorItem = {
  icon: string
  label: string
  valor: string
}

type TotalContribuidoOuPatrimonioProps = {
  titulo: string
  descricao: string
  iconTotal: string
  labelTotal: string
  total: string
  percentualCrescimento?: number
  valores: Array<ReactNode | ValorItem>
}

export function TotalContribuidoOuPatrimonio({
  titulo,
  descricao,
  iconTotal,
  labelTotal,
  total,
  percentualCrescimento,
  valores
}: TotalContribuidoOuPatrimonioProps) {
  return (
    <div className='flex-1 flex flex-col gap-4'>
      <div className='my-2'>
        <Typography variant='h4'>{titulo}</Typography>
        <Typography variant='body1'>{descricao}</Typography>
      </div>

      <div className='flex flex-col gap-6'>
        <div className='flex-1 flex justify-center items-center flex-wrap gap-4'>
          {valores.map((valor, index) =>
            typeof valor === 'object' && valor !== null && 'label' in valor ? (
              <TotalContribuidoOuPatrimonioItem
                key={index}
                titulo={(valor as ValorItem).label}
                valor={(valor as ValorItem).valor}
                icon={(valor as ValorItem).icon}
              />
            ) : (
              valor
            )
          )}
        </div>
        <div className='flex items-center justify-center gap-4 flex-col md:flex-row'>
          <i className={`fa-regular fa-equals text-2xl text-primary-main`}></i>

          <TotalContribuidoOuPatrimonioItem
            titulo={labelTotal}
            valor={total}
            icon={iconTotal}
            primary
            percentualCrescimento={percentualCrescimento}
          />
        </div>
      </div>
    </div>
  )
}
