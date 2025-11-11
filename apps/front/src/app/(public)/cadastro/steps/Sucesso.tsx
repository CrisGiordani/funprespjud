'use client'

import { Typography } from '@mui/material'

import type { SucessoProps } from '../types'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

const SucessoStep = ({ goToLogin }: SucessoProps) => {
  return (
    <div className='w-full'>
      <div className='text-center mb-8'>
        <div className='flex justify-center mb-4'>
          <div className='w-16 h-16 bg-[#147160]/10 rounded-full flex items-center justify-center'>
            <i className='fa-regular fa-check text-3xl text-success' />
          </div>
        </div>
        <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
          Senha redefinida com sucesso!
        </Typography>
      </div>
      <div className='w-full'>
        <div className='max-w-[250px] flex flex-col text-center gap-4 m-auto'>
          <ButtonCustomized fullWidth variant='contained' onClick={goToLogin}>
            Ir para o login
          </ButtonCustomized>
        </div>
      </div>
    </div>
  )
}

export default SucessoStep
