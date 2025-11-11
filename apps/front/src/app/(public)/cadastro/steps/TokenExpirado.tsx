import Image from 'next/image'

import { Typography } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import type { NavigationProps } from '../types'

export default function TokenExpiradoStep({ navigateTo, goToLogin }: NavigationProps) {
  return (
    <div className='w-full'>
      <div className='text-center mb-8'>
        <div className='flex flex-col items-center gap-4 mb-4'>
          <Image src='/images/iris/modal-link-expirado-invalido.svg' alt='Token expirado' width={140} height={84} />
          <div className='text-center'>
            <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
              Esse link expirou
            </Typography>
            <Typography variant='body1' className='text-gray-600'>
              O prazo de validade desse link expirou. Como você deseja prosseguir?
            </Typography>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <div className='max-w-[240px] flex flex-col text-center gap-4 m-auto'>
          <ButtonCustomized
            fullWidth
            variant='contained'
            onClick={() => {
              navigateTo('recuperacao-de-senha')
            }}
          >
            Receber novo link
          </ButtonCustomized>
          <ButtonCustomized
            fullWidth
            variant='outlined'
            onClick={() => {
              goToLogin()
            }}
          >
            Ir para login
          </ButtonCustomized>
        </div>
      </div>
    </div>
  )
}
