'use client'

import { useEffect, useMemo } from 'react'

import { Typography, CircularProgress } from '@mui/material'

import { formatCurrency } from '@/app/utils/formatters'
import { useAuth } from '@/contexts/AuthContext'
import useSaldoTotal from '@/hooks/dashboard/useSaldoTotal'
import { CardCustomized } from '@/components/ui/CardCustomized'

export function CardSaldoTotal() {
  const { user } = useAuth()
  const { saldoTotal, getSaldoTotal, error, isLoading } = useSaldoTotal()

  const formattedSaldo = useMemo(() => {
    return formatCurrency(Number(saldoTotal) || 0)
  }, [saldoTotal])

  const getIconColor = () => {
    if (error && !saldoTotal) return 'text-red-600'

    return 'text-primary-main'
  }

  const getIconBackground = () => {
    if (error && !saldoTotal) return 'bg-red-100'

    return 'bg-primary-main/10'
  }

  const renderContent = () => {
    if (isLoading && !saldoTotal && !error) {
      return (
        <div className='flex items-center gap-2'>
          <CircularProgress size={20} />
          <Typography variant='body2' className='text-gray-500'>
            Carregando...
          </Typography>
        </div>
      )
    }

    if (error && !saldoTotal) {
      return (
        <div className='flex items-center gap-2 mt-1'>
          <i className='fa-solid fa-exclamation-triangle text-red-600 text-sm'></i>
          <Typography variant='body2' className='text-red-600'>
            Erro ao carregar dados
          </Typography>
        </div>
      )
    }

    return (
      <Typography variant='h4' className='font-bold py-0 my-0'>
        {formattedSaldo}
      </Typography>
    )
  }

  useEffect(() => {
    if (user?.cpf) {
      getSaldoTotal(user.cpf)
    }
  }, [user, getSaldoTotal])

  return (
    <CardCustomized.Root>
      <CardCustomized.Content>
        <div className='flex flex-row items-center'>
          <div className={`rounded-full ${getIconBackground()} p-4 flex items-center justify-center  `}>
            <i className={`fa-kit fa-regular-sack-dollar-user ${getIconColor()} text-2xl`}></i>
          </div>
          <div className='flex flex-col ms-3 flex-1'>
            <Typography variant='body1' className='mt-2 py-0'>
              Saldo total
            </Typography>
            {renderContent()}
          </div>
        </div>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
