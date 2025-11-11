'use client'

import { useEffect } from 'react'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

import { Box, Skeleton } from '@mui/material'

import { useToast } from '@/@layouts/components/customized/Toast'

// hooks
import useGetParticipante from '@/hooks/participante/useGetParticipante'

// components
import { useAuth } from '@/contexts/AuthContext'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { DadosParticipante } from './components/DadosParticipante'
import { DadosBeneficiarios } from './components/DadosBeneficiarios'
import { DadosOrgao } from './components/DadosOrgao'
import { DadosPlanos } from './components/DadosPlanos'
import { DadosPercentuais } from './components/DadosPercentuais'

export default function Page() {
  const { Toast, showToast } = useToast()
  const { user } = useAuth()
  const { participante, error, getParticipante } = useGetParticipante()

  const handleUpdate = async () => {
    await getParticipante(user?.cpf || '')
  }

  useEffect(() => {
    if (user?.cpf) {
      getParticipante(user.cpf)
    }
  }, [getParticipante, user?.cpf])

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  // Show loading state during static generation or when user is not available
  if (!user || !participante) {
    return (
      <div className='flex flex-col gap-4'>
        <CardCustomized.Root>
          <CardCustomized.Content className='flex flex-col gap-4'>
            <Skeleton component={Box} variant='rectangular' width={'100%'} height={150} style={{ borderRadius: 10 }} />
            <Skeleton component={Box} variant='rectangular' width={'100%'} height={300} style={{ borderRadius: 10 }} />
            <Skeleton component={Box} variant='rectangular' width={'100%'} height={250} style={{ borderRadius: 10 }} />
            <Skeleton component={Box} variant='rectangular' width={'100%'} height={250} style={{ borderRadius: 10 }} />
          </CardCustomized.Content>
        </CardCustomized.Root>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <Toast />
      <DadosParticipante
        participanteId={user.cpf}
        participante={participante}
        onUpdate={handleUpdate}
        showToast={showToast}
      />
      <DadosBeneficiarios participanteId={user.cpf} showToast={showToast} />
      <DadosOrgao />
      <DadosPercentuais />
      <DadosPlanos />
    </div>
  )
}
