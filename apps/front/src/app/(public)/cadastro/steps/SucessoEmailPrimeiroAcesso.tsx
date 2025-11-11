'use client'

import { Typography, Button } from '@mui/material'

import type { SucessoEmailPrimeiroAcessoProps } from '../types'

const SucessoEmailPrimeiroAcessoStep = ({ goToLogin }: SucessoEmailPrimeiroAcessoProps) => {
  return (
    <div className='flex flex-col gap-5'>
      <div className='text-center'>
        <div className='flex justify-center mb-4'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
            <i className='ri-check-line text-3xl text-green-600' />
          </div>
        </div>

        <Typography variant='h4'>Sucesso!</Typography>
        <Typography variant='body1'>Enviamos um e-mail de primeiro acesso para você.</Typography>
      </div>

      <div className='flex flex-col gap-3'>
        <Button fullWidth variant='contained' onClick={goToLogin} className='max-w-[180px] min-w-[180px] mx-auto'>
          Ir para o login
        </Button>
      </div>
    </div>
  )
}

export default SucessoEmailPrimeiroAcessoStep
